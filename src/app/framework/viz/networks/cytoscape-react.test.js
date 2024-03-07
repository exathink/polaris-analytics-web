/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import Cytoscape from "./cytoscape-react";

import React, {useImperativeHandle} from "react";
import ReactDOM from "react-dom";
import {render, cleanup, screen, findByTestId, fireEvent} from "@testing-library/react";
import {getScratch, SCRATCH} from "./scratch";
import {MockedProvider} from "@apollo/client/testing";
import {gql, useQuery} from "@apollo/client";

import {Menu} from "antd";
import {getPopperContainer} from "./cytoscape";
import AppContextProvider from "../../appContextProvider";


const layout = {name: "preset"};

const containerStyle = {width: "500px", height: "500px"};
const style = [
  {
    selector: "node",
    style: {content: "data(id)"}
  },
  {
    selector: "edge",
    style: {curveStyle: "bezier"}
  }
];

const elements = [
  {data: {id: "node1"}},
  {data: {id: "node2"}},
  {data: {id: "edge1", source: "node1", target: "node2"}}
];

const defaults = {
  /* All tests run headless. Cytoscape rendering does not work in node environments, */
  headless: true
};


/**
 * Renders a Cytoscape component with the given props.
 *
 * @param {Object} props - The props to be passed to the Cytoscape component.
 * @param {function} rerender - The function to be called when rerendering the Cytoscape component. This is
 * can be obtained from the return value of a previous render operation
 * eg. const {rerender} = renderCytoscape()
 *
 * @return {ReactElement} The rendered Cytoscape component.
 */
export function renderCytoscape(props = {}, rerender = null) {
  if (rerender != null) {
    return rerender(<Cytoscape {...defaults} {...props} />);
  } else {
    return render(<Cytoscape {...defaults} {...props} />);
  }
}

function getNodePositions(graph) {
  return graph.nodes().map(node => node.position());
}

describe("Cytoscape Component API", () => {

  it("renders with empty props", () => {
    const {container} = renderCytoscape();
    expect(container).toBeInTheDocument();
  });

  it("should expose an instance of the cytoscape graph as a ref", () => {
    const cyRef = React.createRef();
    renderCytoscape({ref: cyRef});
    const graph = cyRef.current.cy();
    expect(graph).not.toBeNull();
    expect(graph.nodes().length).toBe(0);
    expect(graph.edges().length).toBe(0);
  });

  it("sets the style on the container of the cytoscape component", () => {
    const {container} = renderCytoscape({
      containerStyle
    });
    const cyContainerStyle = container.firstChild.style;
    expect(cyContainerStyle.width).toEqual(containerStyle.width);
    expect(cyContainerStyle.height).toEqual(containerStyle.height);
  });

  it("sets the elements of the cytoscape component", () => {
    const cyRef = React.createRef();
    renderCytoscape({ref: cyRef, elements});
    const graph = cyRef.current.cy();
    expect(graph).not.toBeNull();
    expect(graph.nodes().length).toBe(2);
    expect(graph.edges().length).toBe(1);
  });
  it("sets the default layout of the cytoscape component", () => {
    const cyRef = React.createRef();
    renderCytoscape({ref: cyRef, elements, layout});
    const graph = cyRef.current.cy();
    expect(graph).not.toBeNull();

    expect(getNodePositions(graph)).toEqual([
      {x: 0, y: 0},
      {x: 0, y: 0}
    ]);
  });


  it("sets a custom layout of the cytoscape component", () => {
    const cyRef = React.createRef();
    renderCytoscape({
      ref: cyRef,
      elements,
      layout: {
        name: "grid",
        fit: true, // whether to fit to viewport
        padding: 30 // fit padding
      }
    });
    const graph = cyRef.current.cy();
    expect(graph).not.toBeNull();

    expect(getNodePositions(graph)).not.toEqual([
      {x: 0, y: 0},
      {x: 0, y: 0}
    ]);
  });
});


describe("Initialize tooltips", () => {

  it("initializes popper ref", () => {
    const cyRef = React.createRef();
    renderCytoscape({ref: cyRef, elements});
    const graph = cyRef.current.cy();
    expect(graph).not.toBeNull();

    graph.elements().forEach(
      element => {
        expect(element.popperRef).not.toBeNull();
      }
    );
  });
  it("shows a tooltip on mouseover", async () => {
    const cyRef = React.createRef();

    const hiThere = "Hi there!";
    renderCytoscape({
      ref: cyRef,
      elements,
      tooltip: {
        enable: true,
        tooltip: () => hiThere
      }
    });
    const graph = cyRef.current.cy();
    expect(graph).not.toBeNull();

    const node = graph.nodes()[0];
    node.emit("mouseover");
    const tooltip = await screen.findByText(hiThere);
    expect(tooltip).toBeInTheDocument();

  });
  it("shows an element specific tooltip", async () => {
    const cyRef = React.createRef();

    const hiThere = "Hi there!";
    renderCytoscape({
      ref: cyRef,
      elements,
      tooltip: {
        enable: true,
        tooltip: (element) => {
          return element?.data("id") ?? ``;
        }
      }
    });
    const graph = cyRef.current.cy();
    expect(graph).not.toBeNull();

    const node = graph.nodes()[0];
    node.emit("mouseover");
    const tooltip = await screen.findByText(node.data("id"));
    expect(tooltip).toBeInTheDocument();

  });
});

describe("Context Menu Behavior", () => {

  let cyRef, graph = null;

  beforeEach(() => {
    cyRef = React.createRef();
    renderCytoscape({
      ref: cyRef,
      elements,
      selectionDetailView: {
        enable: true,
        component: () => {
          return (
            <Menu
              data-testid={"menu1"}
              mode="horizontal"
              theme="dark"
            >
              <Menu.Item key="1">A</Menu.Item>
              <Menu.Item key="2">B</Menu.Item>
              <Menu.Item key="3">C</Menu.Item>
            </Menu>
          );
        }
      }
    });
    graph = cyRef.current.cy();
    expect(graph).not.toBeNull();
  });

  /*
    In the following, test cases, the state of the context menu is expressed as
    {ns: <boolean>, ms: <null | boolean>}
    where ns = node selection state: selected, deselected,
    and ms = menu state: null | visible | invisible.

    Transitions are written as (event, current state) => next state.
   */
  it("has initial state: {ns: false, ms: null}", async () => {
    const node = graph.nodes()[0];
    expect(node.selected()).toBeFalsy();
    expect(getScratch(node, SCRATCH.SELECTION_DETAIL_COMPONENT)).toBeUndefined();
  });

  it("shows the menu on an initial tap select", async () => {
    // Transition: (tapselect, {ns: false, ms: null}) => {ns: false, ms: true}
    let node = graph.nodes()[0];
    node = node.emit("tapselect");
    const selectionDetailView = await screen.findByTestId("menu1");
    expect(getScratch(node, SCRATCH.SELECTION_DETAIL_COMPONENT)).toBeDefined();
    node.emit("unselect");

  });
  it("hides the menu on unselect", async () => {
    const selectionDetailViewId = "menu1";
    const spy = jest.spyOn(ReactDOM, "unmountComponentAtNode");
    const node = graph.nodes()[0];
    node.emit("tapselect");
    const selectionDetailView = await screen.findByTestId(selectionDetailViewId);
    expect(selectionDetailView).toBeInTheDocument();
    node.emit("unselect");
    expect(spy).toHaveBeenCalled();
  });


  it("cleans up the react dom node on unselect", async () => {
    const selectionDetailViewId = "menu1";
    const spy = jest.spyOn(ReactDOM, "unmountComponentAtNode");
    let node = graph.nodes()[0];
    node.emit("tapselect");
    const selectionDetailView = await screen.findByTestId(selectionDetailViewId);
    expect(selectionDetailView).toBeInTheDocument();
    node.emit("unselect");
    expect(spy).toHaveBeenCalled();
  });


});

describe("Cytoscape component lifecycle", () => {
  afterEach(cleanup);

  it("Recreates the cytoscape instance only when elements or layout change", () => {
    const cyRef = React.createRef();
    const {rerender} = renderCytoscape({
      ref: cyRef,
      elements,
      layout
    });
    const cyInstance1 = cyRef.current.cy();

    // Re-render with the same elements and layout. Instance should not change
    renderCytoscape({
      ref: cyRef,
      elements,
      layout
    }, rerender);

    const cyInstance2 = cyRef.current.cy();

    expect(cyInstance2).toBe(cyInstance1);

    // Re-render with new elements. Instance should change
    renderCytoscape({
      ref: cyRef,
      elements: [],
      layout
    }, rerender);
    const cyInstance3 = cyRef.current.cy();

    expect(cyInstance3).not.toBe(cyInstance2);
    // Re-render with new layout. Instance should change
    renderCytoscape({
      ref: cyRef,
      elements,
      layout: {name: "null"}
    }, rerender);
    const cyInstance4 = cyRef.current.cy();

    expect(cyInstance4).not.toBe(cyInstance3);

  });

  it("Maintains a stable ref", () => {
    const cyRef = React.createRef();
    const {rerender} = renderCytoscape({
      ref: cyRef
    });
    const cyInstance1 = cyRef.current.cy();

    // Re-render with the same elements and layout. Instance should not change
    renderCytoscape({
      ref: cyRef
    }, rerender);

    const cyInstance2 = cyRef.current.cy();

    expect(cyInstance2).toBe(cyInstance1);
  });
});


describe("Cytoscape Child", () => {

  const CytoscapeClient = React.forwardRef(function({testId}, ref) {
    const cyRef = React.useRef();

    useImperativeHandle(ref, () => ({
      cy: () => cyRef.current?.cy()
    }));

    return <Cytoscape ref={cyRef} testId={testId} {...defaults} />;
  });

  it("Renders as a child component", async () => {
    const cyRef = React.createRef();

    render(<CytoscapeClient ref={cyRef} testId="test-client" />);
    const component = await screen.findByTestId("test-client");

    expect(component).not.toBeNull();
    const graph = cyRef.current.cy();
    expect(graph.nodes()).not.toBeNull();
  });


});

describe("SelectDetailView component rendering", () => {
  it("should render a simple button component in SelectionDetailView", async () => {
    const ButtonComponent = () => <button>Click me</button>;

    const cyRef = React.createRef();
    renderCytoscape({
      ref: cyRef,
      elements,
      selectionDetailView: {
        enable: true,
        component: ButtonComponent
      }
    });
    const graph = cyRef.current.cy();
    expect(graph).not.toBeNull();

    const node = graph.nodes()[0];
    node.emit("tapselect");

    const selectionDetailView = await screen.findByText("Click me");
    expect(selectionDetailView).toBeInTheDocument();

    node.emit("unselect");
  });


  describe("GraphQL Component Rendering", () => {


    it("renders data from GraphQL query in SelectionDetailView", async () => {

      // Define a GraphQL query
      const SAMPLE_QUERY = gql`
          query SampleQuery {
              sample {
                  text
              }
          }
      `;

      // Create a component that calls the query and displays data from the result
      const SampleComponent = () => {
        const {loading, error, data} = useQuery(SAMPLE_QUERY);

        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;

        return <div>{data.sample.text}</div>;
      };

      // Create a mock that intercepts the GraphQL request and return a fake response
      const mocks = [
        {
          request: {
            query: SAMPLE_QUERY
          },
          result: {
            data: {
              sample: {
                text: "Mock text"
              }
            }
          }
        }
      ];

      const cyRef = React.createRef();
      const {findByText} = render(
        <Cytoscape
          ref={cyRef}
          elements={elements}
          layout={layout}
          selectionDetailView={{
            enable: true,
            component: () => {
              return (
                // The component must provide its own app context to enable the
                // features like graphql access.
                // We use the standard AppContextProvider and then mock the Apollo provider.
                <AppContextProvider>
                  <MockedProvider mocks={mocks} addTypename={false}>
                    <SampleComponent />
                  </MockedProvider>
                </AppContextProvider>
              );
            }
          }}
          {...defaults}
        />
      );
      const graph = cyRef.current.cy();
      const node = graph.nodes()[0];
      node.emit("tapselect");
      expect(graph).not.toBeNull();

      const selectionDetailView = await findByText("Mock text");
      expect(selectionDetailView).toBeVisible();
    });

    it("renders passes the selected element to the rendered component", async () => {

      const elements = [
        {data: {id: "node1", name: "apple"}},
        {data: {id: "node2", name: "orange"}},
        {data: {id: "edge1", source: "node1", target: "node2"}}
      ];
      const cyRef = React.createRef();
      // test component that takes an element as argument.

      const SampleComponent = ({element}) => {
        return <div>{element.data("name")}</div>;
      };


      const {findByText} = render(
        <Cytoscape
          ref={cyRef}
          elements={elements}
          layout={layout}
          selectionDetailView={{
            enable: true,
            component: ({graphElement}) => {
              return (
                <SampleComponent element={graphElement}/>
              );
            }
          }}
          {...defaults}
        />
      );
      const graph = cyRef.current.cy();
      const node = graph.nodes()[0];
      node.emit("tapselect");
      expect(graph).not.toBeNull();

      const selectionDetailView = await findByText(node.data('name'));
      expect(selectionDetailView).toBeVisible();
    });
  });
});
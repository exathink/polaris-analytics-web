/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import Cytoscape from "./cytoscape-react";

import React, {useImperativeHandle} from "react";
import ReactDOM from "react-dom";
import {render, cleanup, screen, findByTestId} from "@testing-library/react";
import {getScratch} from "./scratch";
import {Menu} from "antd";

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

describe("Initialize context menu", () => {

  let cyRef, graph = null;

  beforeEach(() => {
    cyRef = React.createRef();
    renderCytoscape({
      ref: cyRef,
      elements,
      contextMenu: {
        enable: true,
        menu: () => {
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

  it("shows a context menu on tap and hides it on the next tap", async () => {
    const node = graph.nodes()[0];
    node.emit("tap");
    const contextMenu = await screen.findByTestId("menu1");
    expect(contextMenu).toBeInTheDocument();
    node.emit("tap");
    expect(screen.queryByTestId("menu1")).toBeNull();
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
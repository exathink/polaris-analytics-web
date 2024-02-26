/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import Cytoscape from "./cytoscape-react";

import React from "react";
import {render, cleanup} from "@testing-library/react";
// ...other imports

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
}


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
function renderCytoscape(props = {}, rerender = null) {
  if (rerender != null) {
    return rerender(<Cytoscape {...defaults} {...props}/>);
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
    const graph = cyRef.current;
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
    const graph = cyRef.current;
    expect(graph).not.toBeNull();
    expect(graph.nodes().length).toBe(2);
    expect(graph.edges().length).toBe(1);
  });
  it("sets the default layout of the cytoscape component", () => {
    const cyRef = React.createRef();
    renderCytoscape({ref: cyRef, elements, layout});
    const graph = cyRef.current;
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
        padding: 30, // fit padding
        boundingBox: {
          x1: 0,
          y1: 0,
          w: 10,
          h: 10
        }
      }
    });
    const graph = cyRef.current;
    expect(graph).not.toBeNull();

    expect(getNodePositions(graph)).not.toEqual([
      {x: 0, y: 0},
      {x: 0, y: 0}
    ]);
  });
});

describe("Cytoscape component lifecycle", () => {
  let cyRef;

  beforeEach(() => {
    cyRef = {current: {}};
  });

  afterEach(cleanup);

  it("Recreates the cytoscape instance only when elements or layout change", () => {

    const {rerender} = renderCytoscape({
      ref: cyRef,
      elements,
      layout
    });
    const cyInstance1 = cyRef.current;

    // Re-render with the same elements and layout. Instance should not change
    renderCytoscape({
      ref: cyRef,
      elements,
      layout
    }, rerender)

    const cyInstance2 = cyRef.current;

    expect(cyInstance2).toBe(cyInstance1);

    // Re-render with new elements. Instance should change
    renderCytoscape({
      ref: cyRef,
      elements: [],
      layout
    }, rerender)
    const cyInstance3 = cyRef.current;

    expect(cyInstance3).not.toBe(cyInstance2);
    // Re-render with new layout. Instance should change
   renderCytoscape({
      ref: cyRef,
      elements,
      layout: {name: 'null'}
    }, rerender)
    const cyInstance4 = cyRef.current;

    expect(cyInstance4).not.toBe(cyInstance3);

  });
});

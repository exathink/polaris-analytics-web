/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import Cytoscape from "./cytoscape-react";

import React from "react";
import { render } from "@testing-library/react";
// ...other imports

const layout = { name: "preset" };

const containerStyle = { width: '500px', height: '500px' };
const style = [
  {
    selector: "node",
    style: { content: "data(id)" }
  },
  {
    selector: "edge",
    style: { curveStyle: "bezier" }
  }
];

const elements = [
  { data: { id: "node1" }},
  { data: { id: "node2" }},
  { data: { id: "edge1", source: "node1", target: "node2" } }
];

function renderCytoscape(props = {}) {
  return render(<Cytoscape {...props} />);
}

describe('Cytoscape Component', () => {

  it("renders with empty props", () => {
    const { container } = renderCytoscape();
    expect(container).toBeInTheDocument();
  });

  it("should expose an instance of the cytoscape graph as a ref", () => {
    const cyRef = React.createRef();
    renderCytoscape({ ref: cyRef });
    const graph = cyRef.current;
    expect(graph).not.toBeNull();
    expect(graph.nodes().length).toBe(0);
    expect(graph.edges().length).toBe(0);
  });

  it('sets the style on the container of the cytoscape component', () => {
    const { container } = renderCytoscape({
      containerStyle
    });
    const cyContainerStyle = container.firstChild.style;
    expect(cyContainerStyle.width).toEqual(containerStyle.width);
    expect(cyContainerStyle.height).toEqual(containerStyle.height);
  });

  it('sets the elements of the cytoscape component', () => {
    const cyRef = React.createRef();
    renderCytoscape({ ref: cyRef, elements });
    const graph = cyRef.current;
    expect(graph).not.toBeNull();
    expect(graph.nodes().length).toBe(2);
    expect(graph.edges().length).toBe(1);
  })
});


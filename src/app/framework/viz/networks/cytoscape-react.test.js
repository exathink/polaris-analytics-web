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

const style = [
  { style: { width: "500px", height: "500px" } },
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
  { data: { id: "node1" }, position: { x: 0, y: 0 } },
  { data: { id: "node2" }, position: { x: 0, y: 0 } },
  { data: { id: "edge1", source: "node1", target: "node2" } }
];

function renderCytoscape(props = {}) {
  return render(<Cytoscape {...props} />);
}

test("renders Cytoscape with required props", () => {
  const { container } = renderCytoscape();
  expect(container).toBeInTheDocument();
});

test("Cytoscape component should expose an instance of the cytoscape graph", () => {
  const cyRef = React.createRef();
  renderCytoscape({ ref: cyRef });
  const graph = cyRef.current;
  expect(graph).not.toBeNull();
});
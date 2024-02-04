/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import React from "react";
import ReactDOM from "react-dom";
import CytoscapeComponent  from "react-cytoscapejs";

class CytoGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Creates a network with the given number of nodes.
   *
   * @param {number} n - The number of nodes in the network.
   * @returns {Array} - An array containing the nodes and edges of the network.
   */
  createNetwork(n) {
    //@assistant: what does this function do?

    // create nodes
    const nodes = Array.from({length: n}, (_, i) => this.createNode(i + 1));

    // create edges
    const edges = Array.from({length: n}, (_, i) =>
        Array.from({length: n - (i + 1)}, (_, j) => this.createEdge(i + 1, i + j + 2))
    ).flat();

    return [...nodes, ...edges];
  }

  createNode(i) {
    return {
        data: {
          id: `node${i}`,
          label: `Node ${i}`
        },
        position: {
          x: 200 * i,
          y: 200 * i
        }
    };
  }

  createEdge(i, j) {
    return {
        data: {
            source: `node${i}`,
            target: `node${j}`,
            label: `Edge from Node${i} to Node${j}`
        }
    };
  }



  render() {
    const elements = [
      { data: { id: "one", label: "Node 3" }, position: { x: 200, y: 200 } },
      { data: { id: "two", label: "Node 2" }, position: { x: 400, y: 400 } },
      { data: { source: "one", target: "two", label: "Edge from Node1 to Node2" } }
    ];

    return <CytoscapeComponent
      elements={this.createNetwork(32)}
      style={{ width: "1200px", height: "1200px" }}
      layout={{
        name: 'random'
      }}
      stylesheet={[
        {
          selector: 'node[id = "one"]',
          style: {
            width: 30,
            height: 30,
            shape: "rectangle",
            'background-color': '#d38509'
          }
        },
        {
          selector: "edge",
          style: {
            width: 5,
            'line-color': '#d38509'
          }
        }
      ]}
    />;
  }
}

export default CytoGraph;

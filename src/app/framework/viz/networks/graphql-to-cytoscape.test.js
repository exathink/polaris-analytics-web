import React, {createRef} from "react";
import Cytoscape from "./cytoscape-react";
import {render} from "@testing-library/react";

import {graphqlConnectionToCyElements} from "./graphql-cytoscape";
import {renderCytoscape} from "./cytoscape-react.test";

describe("graphqlConnectionToCyElements", () => {
  let connectionData, orgUUID, proj1UUID, proj2UUID;

  beforeEach(() => {
    // UUIDs for parent and child nodes
    orgUUID = "550e8400-e29b-41d4-a716-446655440000";
    proj1UUID = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    proj2UUID = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";

    connectionData = {
      organization: {
        key: orgUUID,
        name: "Org1",
        __typename: "Organization",
        projects: {
          edges: [
            {node: {key: proj1UUID, name: "Project1", id: "101", __typename: "Project", archived: false}},
            {node: {key: proj2UUID, name: "Project2", id: "102", __typename: "Project", archived: true}}
          ]
        }
      }
    };
  });

  it("should correctly map GraphQL connection to Cytoscape elements", () => {
    const actualOutput = graphqlConnectionToCyElements(connectionData, "organization", "projects");

    const expectedOutput = [
      {data: {id: orgUUID, name: "Org1", nodeType: "Organization", key: orgUUID, connectionDepth: 0}},
      {data: {key: proj1UUID, name: "Project1", id: proj1UUID, nodeType: "Project", archived: false, connectionDepth:1}},
      {data: {id: `${orgUUID}_${proj1UUID}`, source: orgUUID, target: proj1UUID}},
      {data: {key: proj2UUID, name: "Project2", id: proj2UUID, nodeType: "Project", archived: true, connectionDepth: 1}},
      {data: {id: `${orgUUID}_${proj2UUID}`, source: orgUUID, target: proj2UUID}}
    ];
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("can initialize a Cytoscape component from the output", () => {
    const elements = graphqlConnectionToCyElements(connectionData, "organization", "projects");
    const cyRef = React.createRef();
    // Render the component with the obtained elements
    const {container} = renderCytoscape({
      ref: cyRef,
      elements: elements
    });

    // Check if the rendered component is not null
    expect(container).toBeInTheDocument();

    // Check if the graph is constructed properly
    const graph = cyRef.current.cy();
    expect(graph.nodes().length).toBe(3);
    expect(graph.edges().length).toBe(2);
  });


});
import React from "react";
import {useQuery} from "@apollo/client";
import {render, waitFor, screen} from "@testing-library/react";
import {MockedProvider} from "@apollo/client/testing";
import {Colors} from "../../shared/config"
import OrganizationProjectsNetwork, {GET_ORGANIZATION_PROJECTS_NETWORK_QUERY} from "./organizationProjectsNetwork";
import {genDateBeforeNow} from "../../../helpers/utility";

const mocks = [
  {
    request: {
      query: GET_ORGANIZATION_PROJECTS_NETWORK_QUERY,
      variables: {
        organizationKey: "org1"
      }
    },
    result: {
      data: {
        organization: {
          id: "org1",
          name: "Organization 1",
          key: "O1",
          __typename: "Organization",
          projects: {
            count: 2,
            edges: [
              {
                node: {
                  id: "proj1",
                  name: "Project 1",
                  key: "P1",
                  archived: false,
                  contributorCount: 3,
                  repositoryCount: 2,
                  latestCommit: genDateBeforeNow(100),
                  latestWorkItemEvent: null,
                  workItemsSources: {
                    count: 2,
                    edges: [
                      {
                        node: {
                          name: "Work Item 1"
                        }
                      },
                      {
                        node: {
                          name: "Work Item 2"
                        }
                      }
                    ]
                  },
                  __typename: "Project"
                }
              },
              {
                node: {
                  id: "proj2",
                  name: "Project 2",
                  key: "P2",
                  archived: false,
                  contributorCount: 10,
                  repositoryCount: 4,
                  latestCommit: null,
                  latestWorkItemEvent: genDateBeforeNow(10),
                  workItemsSources: {
                    count: 4,
                    edges: [
                      {
                        node: {
                          name: "Work Item 3"
                        }
                      },
                      {
                        node: {
                          name: "Work Item 4"
                        }
                      },
                      {
                        node: {
                          name: "Work Item 5"
                        }
                      },
                      {
                        node: {
                          name: "Work Item 6"
                        }
                      }
                    ]
                  },
                  __typename: "Project"
                }
              }
            ]
          }
        }
      }
    }
  }
];

describe("Organization Projects Component", () => {
  let cyRef, targetElement, graph = null;

  beforeEach(async () => {
    cyRef = React.createRef();

    const {getByText} = render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <OrganizationProjectsNetwork
          ref={cyRef}
          organizationKey="org1"
          testId={"my-graph"}
          cytoscapeOptions={{headless: true}}
        />
      </MockedProvider>
    );

    targetElement = await screen.findByTestId("my-graph");
    graph = cyRef.current?.cy();
  });

  it("renders the component", async () => {
    expect(targetElement).toBeInTheDocument();
  });

  it("initializes the graph", async () => {
    expect(graph).not.toBeNull();
    expect(graph.nodes().length).toBe(3);
    expect(graph.edges().length).toBe(2);
  });

  it("it sets the correct node types", async () => {
    expect(graph).not.toBeNull();
    expect(graph.elements("node[nodeType = 'Project']").length).toBe(2);
    expect(graph.elements("node[nodeType = 'Organization']").length).toBe(1);

  });
  it("sets the activityColor for project nodes", async () => {
    expect(graph).not.toBeNull();
    const projectAttributes = graph.elements("node[nodeType = 'Project']").map(
      node => {
        const {name, activityColor} = node.data();
        return ({name, activityColor});
      }
    );
    /* These are activity colors defined in */
    expect(projectAttributes).toStrictEqual([
      {
        "name": "Project 1",
        "activityColor": Colors.ActivityLevel.DORMANT
      },
      {
        "name": "Project 2",
        "activityColor": Colors.ActivityLevel.ACTIVE
      }
    ]);
  });

});





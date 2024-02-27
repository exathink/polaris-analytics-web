import React from "react";
import {useQuery} from "@apollo/client";
import {render, waitFor, screen} from "@testing-library/react";
import {MockedProvider} from "@apollo/client/testing";

import OrganizationProjectsNetwork, {GET_ORGANIZATION_PROJECTS_QUERY} from "./organizationProjectsNetwork";

const mocks = [
  {
    request: {
      query: GET_ORGANIZATION_PROJECTS_QUERY,
      variables: {
        organizationKey: "org1",
        days: 7,
        measurementWindow: 10,
        samplingFrequency: 1,
        specsOnly: false,
        includeSubTasks: false
      }
    },
    result: {
      data: {
        organization: {
          id: "org1",
          name: "Organization 1",
          key: "O1",
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
                  cycleMetricsTrends: {
                    avgLeadTime: 10.5,
                    avgCycleTime: 14.7,
                    totalEffort: 243,
                    workItemsWithCommits: 2
                  },
                  repositoryCount: 2,
                  latestCommit: "abc123",
                  latestWorkItemEvent: "event1",
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
                  }
                }
              },
              {
                node: {
                  id: "proj2",
                  name: "Project 2",
                  key: "P2",
                  archived: false,
                  contributorCount: 10,
                  cycleMetricsTrends: {
                    avgLeadTime: 15.5,
                    avgCycleTime: 22.7,
                    totalEffort: 460,
                    workItemsWithCommits: 3
                  },
                  repositoryCount: 4,
                  latestCommit: "def456",
                  latestWorkItemEvent: "event2",
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
                  }
                }
              }
            ]
          }
        }
      }
    }
  }
];

describe("Projects component", () => {
  it("renders projects", async () => {
    const cyRef = React.createRef();

    const {getByText} = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <OrganizationProjectsNetwork
          ref={cyRef}
          organizationKey="org1"
          days={7}
          measurementWindow={10}
          samplingFrequency={1}
          specsOnly={false}
          includeSubTasks={false}
          testId={'my-graph'}
          cytoscapeOptions={{headless: true}}
        />
      </MockedProvider>
    );

    const targetElement = await screen.findByTestId('my-graph')
    expect(targetElement).toBeInTheDocument();

    const graph = cyRef.current?.cy();
    expect(graph).not.toBeNull();
    expect(graph.nodes().length).toBe(3)
    expect(graph.edges().length).toBe(2)

  });
});





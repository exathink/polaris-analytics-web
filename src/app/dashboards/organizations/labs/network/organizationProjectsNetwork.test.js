import React from "react";
import ReactDOM from "react-dom";
import {useQuery} from "@apollo/client";
import {render, waitFor, screen} from "@testing-library/react";
import {MockedProvider} from "@apollo/client/testing";
import {Colors} from "../../../shared/config";
import OrganizationProjectsNetwork, {GET_ORGANIZATION_PROJECTS_NETWORK_QUERY} from "./organizationProjectsNetwork";
import {genDateBeforeNow} from "../../../../helpers/utility";

import {findNested} from "../../../../../test/test-utils";
import {renderCytoscape} from "../../../../framework/viz/networks/cytoscape-react.test";

function mockRequest() {
  return [
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
                    latestCommit: null,
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
                    latestWorkItemEvent: null,
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
};

function renderOrganizationProjectsNetwork(mockRequest, cyRef) {
    return render(
      <MockedProvider mocks={mockRequest} addTypename={true}>
        <OrganizationProjectsNetwork
          ref={cyRef}
          organizationKey="org1"
          testId={"my-graph"}
          cytoscapeOptions={{headless: true}}
        />
      </MockedProvider>
    );
  }

describe("Organization Projects Component", () => {
  let cyRef, targetElement, graph = null;
  beforeEach(async () => {
    cyRef = React.createRef();
    renderOrganizationProjectsNetwork(mockRequest(), cyRef);
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
});


describe("Component Activity Colors", () => {
  let cyRef, targetElement, graph = null;

  function getProjectActivityColors(graph) {
      const projectAttributes = graph.elements("node[nodeType = 'Project']").map(
        node => {
          const {name, activityColor} = node.data();
          return ({name, activityColor});
        }
      );
      return projectAttributes;
    }

  async function renderComponentAndGetActivityColors(request) {
      renderOrganizationProjectsNetwork(request, cyRef);
      targetElement = await screen.findByTestId("my-graph");

      graph = cyRef.current?.cy();
      expect(graph).not.toBeNull();

      return getProjectActivityColors(graph);
  }

  beforeEach(async () => {
    cyRef = React.createRef();
  });

  it("sets the activity color to INITIAL for project nodes when neither latestCommit or latestWorkItemEvent is specified", async () => {
    const request = mockRequest();

    const activityColors = await renderComponentAndGetActivityColors(request);

    expect(activityColors).toStrictEqual([
      {
        "name": "Project 1",
        "activityColor": Colors.ActivityLevel.INITIAL
      },
      {
        "name": "Project 2",
        "activityColor": Colors.ActivityLevel.INITIAL
      }
    ]);
  });

  it("sets the activityColor for project nodes when latestCommit is specified ", async () => {

    const request = mockRequest();
    /* Update the latestCommit for a project */
    const project1 = findNested(
      request[0],
      'result.data.organization.projects.edges',
      (edge) => edge.node.name == 'Project 1'
    );
    project1.node.latestCommit = genDateBeforeNow(100);

    const activityColors = await renderComponentAndGetActivityColors(request);

    expect(activityColors).toStrictEqual([
      {
        "name": "Project 1",
        "activityColor": Colors.ActivityLevel.DORMANT
      },
      {
        "name": "Project 2",
        "activityColor": Colors.ActivityLevel.INITIAL
      }
    ]);
  });

  it("sets the activityColor for project nodes when latestCommit is specified ", async () => {

    const request = mockRequest();

    /* Update the latestWorkItemEvent for a project */
    const project1 = findNested(
      request[0],
      'result.data.organization.projects.edges',
      (edge) => edge.node.name == 'Project 1'
    );
    project1.node.latestWorkItemEvent = genDateBeforeNow(10);

    const activityColors = await renderComponentAndGetActivityColors(request);

    expect(activityColors).toStrictEqual([
      {
        "name": "Project 1",
        "activityColor": Colors.ActivityLevel.ACTIVE
      },
      {
        "name": "Project 2",
        "activityColor": Colors.ActivityLevel.INITIAL
      }
    ]);
  });



});

describe("Tooltips", () => {
  let cyRef, targetElement, graph = null;
    beforeEach(async () => {
      cyRef = React.createRef();
      renderOrganizationProjectsNetwork(mockRequest(), cyRef);
      targetElement = await screen.findByTestId("my-graph");
      graph = cyRef.current?.cy();
    });

  it('shows a tooltip on mouseover', async () => {
      const projectNode = graph.elements("node[nodeType = 'Project']")[0];
      projectNode.emit('mouseover');
      const tooltip = await screen.findByText(`Project: ${projectNode.data('name')}`)
      expect(tooltip).toBeInTheDocument();
  })
})

describe("Context Menu", () => {
  let cyRef, targetElement, graph = null;
    beforeEach(async () => {
      cyRef = React.createRef();
      renderOrganizationProjectsNetwork(mockRequest(), cyRef);
      targetElement = await screen.findByTestId("my-graph");
      graph = cyRef.current?.cy();
    });

  it("shows a context menu on tapselect and hides it on the next unselect", async () => {
    const contextMenuId  = "organization-projects-context-menu";

    const node = graph.nodes()[0];
    node.emit("tapselect");
    const contextMenu = await screen.findByTestId(contextMenuId);
    expect(contextMenu).toBeInTheDocument();
    node.emit("unselect");
    expect(screen.queryByTestId(contextMenuId)).toBeNull();
  })

})





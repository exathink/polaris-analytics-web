import {screen, waitFor} from "@testing-library/react";
import {GraphQLError} from "graphql/error";
import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import { AppTerms } from "../../../../shared/config";
import {PROJECT_FUNNEL_COUNTS_QUERY} from "../../hooks/useQueryProjectFunnelCounts";
import {ProjectPipelineFunnelWidget} from "./projectPipelineFunnelWidget";
import { dimensionWorkItemDetailsQuery } from "../../../../shared/widgets/work_items/hooks/useQueryDimensionWorkItemDetails";

const setWorkItemScopeMock = jest.fn((scope) => ({}));
const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  latestWorkItemEvent: "2020-12-09T22:31:01.244000",
  latestCommit: "2020-12-09T22:30:42",
  days: 30,
  view: "primary",
  workItemScope: "all", // all or specs
  setWorkItemScope: setWorkItemScopeMock,
  includeSubTasks: {includeSubTasksInClosedState: true, includeSubTasksInNonClosedState: true},
};

const mocksFixture = [
  {
    request: {
      query: PROJECT_FUNNEL_COUNTS_QUERY,
      variables: {
        key: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
        closedWithinDays: 30,
        specsOnly: false,
        referenceString: "2020-12-09T22:31:01.244000",
        includeSubTasksInClosedState: true,
        includeSubTasksInNonClosedState: true,
        defectsOnly: undefined,
      },
    },
    result: {
      data: {
        project: {
          workItemStateTypeCounts: {
            backlog: 19,
            open: 7,
            wip: 3,
            complete: null,
            closed: 27,
            unmapped: null,
          },
          totalEffortByStateType: {
            backlog: 0.25,
            open: 0,
            wip: 8.66666666666667,
            complete: null,
            closed: 31.1666666666667,
            unmapped: null,
          },
        },
      },
    },
  },
  {
    request: {
      query: dimensionWorkItemDetailsQuery("project"),
      variables: {
        key: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
        specsOnly: false,
        activeOnly: true,
        includeSubTasks: true,
        tags: [],
        release: undefined,
        referenceString: "160755304200016075530612440"
      },
    },
    result: {
      data: {
        project: {
          id: "UHJvamVjdDo0MWFmOGI5Mi01MWY2LTRlODgtOTc2NS1jYzNkYmVhMzVlMWE=",
          workItems: {
            edges: [
              {
                node: {
                  name: "Create top level filter by releases as a dropdown",
                  key: "94bb3105-f39d-42c8-9470-25b701f6848d",
                  displayId: "PP-559",
                  workItemType: "story",
                  epicName: "Release Support for Value Streams",
                  state: "CODE REVIEW",
                  stateType: "wip",
                  workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
                  workItemsSourceName: "Polaris Platform",
                  workTrackingIntegrationType: "jira",
                  url: "https://exathinkdev.atlassian.net/rest/api/latest/issue/10702",
                  tags: "",
                  storyPoints: null,
                  releases: [],
                  priority: "Medium",
                  teamNodeRefs: [
                    {
                      teamName: "App Team",
                      teamKey: "f260ee33-c46a-4eb2-bb45-13b8c75e3c45",
                    },
                  ],
                  workItemStateDetails: {
                    currentStateTransition: {
                      eventDate: "2023-08-22T09:32:22.270000",
                    },
                    currentDeliveryCycleDurations: [
                      {
                        state: "CODE REVIEW",
                        stateType: "wip",
                        flowType: "waiting",
                        daysInState: null,
                      },
                      {
                        state: "created",
                        stateType: "backlog",
                        flowType: null,
                        daysInState: 0.7882175925925926,
                      },
                    ],
                    earliestCommit: "2023-08-21T16:21:06",
                    latestCommit: "2023-08-22T08:04:27",
                    commitCount: 10,
                    effort: 2,
                    endDate: null,
                    leadTime: null,
                    cycleTime: null,
                    duration: 0.6551041666666667,
                    latency: null,
                  },
                },
              },
              {
                node: {
                  name: "Expose sprints as part of the UI",
                  key: "e33befea-463a-4f47-9175-f3e8924726cb",
                  displayId: "PP-560",
                  workItemType: "story",
                  epicName: null,
                  state: "In Progress",
                  stateType: "wip",
                  workItemsSourceKey: "4ff556a6-b566-4775-8cc3-e77d406e0c16",
                  workItemsSourceName: "Polaris Platform",
                  workTrackingIntegrationType: "jira",
                  url: "https://exathinkdev.atlassian.net/rest/api/latest/issue/10703",
                  tags: "",
                  storyPoints: null,
                  releases: [],
                  priority: "Medium",
                  teamNodeRefs: [],
                  workItemStateDetails: {
                    currentStateTransition: {
                      eventDate: "2023-08-22T00:03:57.138000",
                    },
                    currentDeliveryCycleDurations: [
                      {
                        state: "created",
                        stateType: "backlog",
                        flowType: null,
                        daysInState: 0.0003125,
                      },
                      {
                        state: "In Progress",
                        stateType: "wip",
                        flowType: "active",
                        daysInState: null,
                      },
                    ],
                    earliestCommit: null,
                    latestCommit: null,
                    commitCount: null,
                    effort: null,
                    endDate: null,
                    leadTime: null,
                    cycleTime: null,
                    duration: null,
                    latency: null,
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
];

describe("ProjectPipelineFunnelWidget", () => {
  test("render projectPipelineFunnelWidget without an error", () => {
    renderWithProviders(<ProjectPipelineFunnelWidget {...propsFixture} />, mocksFixture);
  });

  test("shows a loading spinner", async () => {
    renderWithProviders(<ProjectPipelineFunnelWidget {...propsFixture} />, mocksFixture);
    expect(await screen.findByTestId("loading-spinner")).toBeInTheDocument();
  });

  describe("when there are errors", () => {
    let logGraphQlError;
    beforeEach(() => {
      logGraphQlError = jest.spyOn(gqlUtils, "logGraphQlError").mockImplementation(() => {});
    });
    afterEach(() => {
      logGraphQlError.mockRestore();
    });

    const mockNetworkError = [
      {
        request: {
          query: PROJECT_FUNNEL_COUNTS_QUERY,
          variables: {
            key: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
            closedWithinDays: 30,
            specsOnly: false,
            referenceString: "2020-12-09T22:31:01.244000",
            defectsOnly: undefined,
          },
        },
        error: new Error("A network error Occurred"),
      },
    ];

    const mockGraphQlErrors = [
      {
        request: {
          query: PROJECT_FUNNEL_COUNTS_QUERY,
          variables: {
            key: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
            closedWithinDays: 30,
            specsOnly: false,
            referenceString: "2020-12-09T22:31:01.244000",
            defectsOnly: undefined,
          },
        },
        result: {
          errors: [new GraphQLError("A GraphQL Error Occurred")],
        },
      },
    ];

    test("it renders nothing and logs the error when there is a network error", async () => {
      renderWithProviders(<ProjectPipelineFunnelWidget {...propsFixture} />, mockNetworkError);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByTestId("project-pipeline-funnel-view")).toBeNull();
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      renderWithProviders(<ProjectPipelineFunnelWidget {...propsFixture} />, mockGraphQlErrors);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByTestId("project-pipeline-funnel-view")).toBeNull();
    });
  });

  describe("when summary specs are available", () => {
    test("it shows a loading spinner", async () => {
      renderWithProviders(<ProjectPipelineFunnelWidget {...propsFixture} />, mocksFixture);
      await screen.findByTestId("loading-spinner");
    });

    test("should render default legend title", async () => {
      renderWithProviders(<ProjectPipelineFunnelWidget {...propsFixture} />, mocksFixture);
      await screen.findByTestId("loading-spinner");
      const cardsRegex = new RegExp(`All ${AppTerms.cards.display}`, "i")
      expect(await screen.findByText(cardsRegex)).toBeInTheDocument();
    });


    test("should render legend title as Specs when Specs workItemScope is selected", async () => {
      const propsFixtureForSpecs = {
        ...propsFixture,
        workItemScope: "specs", // all or specs
      };
      const mocksFixtureObj = mocksFixture[0];
      const mocksFixtureObjWip = mocksFixture[1];
      const mocksFixtureForSpecs = [
        {
          ...mocksFixtureObj,
          request: {
            ...mocksFixtureObj.request,
            variables: {...mocksFixtureObj.request.variables, specsOnly: true},
          },
        },
      ];
      const mocksFixtureForSpecsWip = [
        {
          ...mocksFixtureObjWip,
          request: {
            ...mocksFixtureObjWip.request,
            variables: {...mocksFixtureObjWip.request.variables},
          },
        },
      ];
      const mocksFixtureForAll = [
        {
          ...mocksFixtureObj,
          request: {
            ...mocksFixtureObj.request,
            variables: {...mocksFixtureObj.request.variables},
          },
        },
      ];
      renderWithProviders(
        <ProjectPipelineFunnelWidget {...propsFixtureForSpecs} />,
        [mocksFixtureForSpecs[0], mocksFixtureForSpecsWip[0], mocksFixtureForAll[0]],
      );

      const specsRegex = new RegExp(AppTerms.specs.display, "i")
      const specElements = await screen.findAllByText(specsRegex);
      expect(specElements).toHaveLength(1);
    });
  });
});

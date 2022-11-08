import {screen, waitFor} from "@testing-library/react";
import {GraphQLError} from "graphql/error";
import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import { AppTerms } from "../../../../shared/config";
import {PROJECT_PIPELINE_SUMMARY_QUERY} from "../../hooks/useQueryProjectPipelineSummary";
import {ProjectPipelineFunnelWidget} from "./projectPipelineFunnelWidget";

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
      query: PROJECT_PIPELINE_SUMMARY_QUERY,
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
          query: PROJECT_PIPELINE_SUMMARY_QUERY,
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
          query: PROJECT_PIPELINE_SUMMARY_QUERY,
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
      const mocksFixtureForSpecs = [
        {
          ...mocksFixtureObj,
          request: {
            ...mocksFixtureObj.request,
            variables: {...mocksFixtureObj.request.variables, specsOnly: true},
          },
        },
      ];

      renderWithProviders(<ProjectPipelineFunnelWidget {...propsFixtureForSpecs} />, mocksFixtureForSpecs, {
        chartTestId: "pipeline-funnel-chart",
      });

      // assert the chart existence (this also ensures chart is rendered)
      await screen.findByTestId("pipeline-funnel-chart");

      const specsRegex = new RegExp(AppTerms.specs.display, "i")
      const specElements = await screen.findAllByText(specsRegex);
      expect(specElements).toHaveLength(1);
    });
  });
});

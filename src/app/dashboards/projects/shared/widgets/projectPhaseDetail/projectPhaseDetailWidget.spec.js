import React from "react";
import {GraphQLError} from "graphql";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {dimensionPipelineStateDetailsQuery} from "../../../../shared/widgets/work_items/hooks/useQueryDimensionPipelineStateDetails";
import {PROJECT_AGGREGATE_CYCLE_METRICS} from "../../hooks/useQueryProjectCycleMetrics";
import {ProjectPhaseDetailWidget} from "./projectPhaseDetailWidget";
import {screen, waitFor} from "@testing-library/react";

const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  context: {},
  latestWorkItemEvent: "2020-12-09T22:31:01.244000",
  days: 7,
  targetPercentile: 1,
  leadTimeTargetPercentile: 0.9,
  cycleTimeTargetPercentile: 0.9,
  activeOnly: true,
  specsOnly: true,
  includeSubTasks: {
      includeSubTasksInNonClosedState: true,
      includeSubTasksInClosedState: true
    }
};

const gqlRequest1 = {
  query: dimensionPipelineStateDetailsQuery,
  variables: {
    key: propsFixture.instanceKey,
    specsOnly: true,
    referenceString: propsFixture.latestWorkItemEvent,
    activeOnly: propsFixture.activeOnly,

  },
};

const gqlRequest2 = {
  query: PROJECT_AGGREGATE_CYCLE_METRICS,
  variables: {
    key: propsFixture.instanceKey,
    days: propsFixture.days,
    targetPercentile: propsFixture.targetPercentile,
    specsOnly: propsFixture.specsOnly,
    referenceString: propsFixture.latestWorkItemEvent,
  },
};

const mocks = [
  {
    request: gqlRequest1,
    result: {
    },
  },
  {
    request: gqlRequest2,
    result: {
      data: {
        project: {
          minLeadTime: null,
          avgLeadTime: null,
          maxLeadTime: null,
          minCycleTime: null,
          avgCycleTime: null,
          maxCycleTime: null,
          percentileLeadTime: null,
          percentileCycleTime: null,
          targetPercentile: 0.9,
          workItemsInScope: 0,
          workItemsWithNullCycleTime: 0,
          earliestClosedDate: null,
          latestClosedDate: null,
        },
      },
    },
  },
];

describe("ProjectPhaseDetailWidget", () => {
  /**
   * this particular widget renders ProjectPipelineStateDetailsView component 
   * which in turn uses withNavigationContext consumer. 
   * currently we are keeping these tests on hold which require Router as parent.
   */
  test("when there are multiple workItems", async () => {

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
        request: gqlRequest1,
        error: new Error("A network error Occurred"),
      },
      {
        request: gqlRequest2,
        error: new Error("A network error Occurred"),
      },
    ];

    const mockGraphQlErrors = [
      {
        request: gqlRequest1,
        result: {
          errors: [new GraphQLError("A GraphQL Error Occurred")],
        },
      },
      {
        request: gqlRequest2,
        result: {
          errors: [new GraphQLError("A GraphQL Error Occurred")],
        },
      },
    ];

    test("it renders nothing and logs the error when there is a network error", async () => {
      renderWithProviders(<ProjectPhaseDetailWidget {...propsFixture} />, mockNetworkError);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByText(/work queue/i)).toBeNull();
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      renderWithProviders(<ProjectPhaseDetailWidget {...propsFixture} />, mockGraphQlErrors);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByText(/work queue/i)).toBeNull();
    });
  });
});

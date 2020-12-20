import {screen, waitFor} from "@testing-library/react";
import {GraphQLError} from "graphql/error";
import React from "react";
import {renderComponentWithMockedProvider, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
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
    renderComponentWithMockedProvider(<ProjectPipelineFunnelWidget {...propsFixture} />, mocksFixture);
  });

  describe("when summary specs are not available", () => {
    // still need to update these tests
    test("edge case", () => {});
  });

  describe("when there are errors", () => {
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
      const logGraphQlError = jest.spyOn(gqlUtils, "logGraphQlError");

      renderComponentWithMockedProvider(<ProjectPipelineFunnelWidget {...propsFixture} />, mockNetworkError);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByTestId("project-pipeline-funnel-view")).toBeNull();

      logGraphQlError.mockRestore();
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      const logGraphQlError = jest.spyOn(gqlUtils, "logGraphQlError");

      renderComponentWithMockedProvider(<ProjectPipelineFunnelWidget {...propsFixture} />, mockGraphQlErrors);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByTestId("project-pipeline-funnel-view")).toBeNull();

      logGraphQlError.mockRestore();
    });
  });

  describe("when summary specs are available", () => {
    test("it shows a loading spinner", async () => {
      renderComponentWithMockedProvider(<ProjectPipelineFunnelWidget {...propsFixture} />, mocksFixture);
      await screen.findByTestId("loading-spinner");
    });

    test("should render default legend title", async () => {
      renderComponentWithMockedProvider(<ProjectPipelineFunnelWidget {...propsFixture} />, mocksFixture);
      expect(await screen.findByText(/All Work Items/i)).toBeInTheDocument();
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

      renderComponentWithMockedProvider(
        <ProjectPipelineFunnelWidget {...propsFixtureForSpecs} />,
        mocksFixtureForSpecs
      );
      expect(await screen.findByText(/Specs/i)).toBeInTheDocument();
    });
  });
});

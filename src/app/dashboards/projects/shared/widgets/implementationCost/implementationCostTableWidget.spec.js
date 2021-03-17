import React from "react";
import {GraphQLError} from "graphql";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {GET_PROJECT_IMPLEMENTATION_COST_TABLE} from "./useQueryProjectImplementationCost";
import {ImplementationCostTableWidget} from "./implementationCostTableWidget";
import {screen, waitFor} from "@testing-library/react";
import {getNDaysAgo} from "../../../../../../test/test-utils";
import {getReferenceString} from "../../../../../helpers/utility";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  days: 30,
  latestCommit: getNDaysAgo(21),
  latestWorkItemEvent: getNDaysAgo(20),
  view: "primary",
};

const gqlRequest = {
  query: GET_PROJECT_IMPLEMENTATION_COST_TABLE,
  variables: {
    projectKey: propsFixture.instanceKey,
    days: propsFixture.days,
    referenceString: getReferenceString(propsFixture.latestWorkItemEvent, propsFixture.latestCommit),
  },
};

const mocks = [
  {
    request: gqlRequest,
    result: {
      data: {
        project: {
          id: "UHJvamVjdDo0MWFmOGI5Mi01MWY2LTRlODgtOTc2NS1jYzNkYmVhMzVlMWE=",
          workItems: {
            edges: [
              {
                node: {
                  id: "V29ya0l0ZW06NDczYWM4ZTAtMGQwZC00ZDcyLTg5MmQtODhjYmExMDEzZjI4",
                  displayId: "PO-556",
                  name: "Commit Timeline enhancements",
                  key: "473ac8e0-0d0d-4d72-892d-88cba1013f28",
                  workItemType: "story",
                  epicName: "Misc UX",
                  epicKey: "b3ff1c8a-749c-4c38-9dde-d5a7b2519122",
                  effort: null,
                  duration: null,
                  authorCount: 0,
                  budget: 14,
                  startDate: "2021-02-27T17:02:41.397000",
                  endDate: null,
                  closed: false,
                  lastUpdate: null,
                  elapsed: 17.5812555261921,
                },
              },
              {
                node: {
                  id: "V29ya0l0ZW06YjNmZjFjOGEtNzQ5Yy00YzM4LTlkZGUtZDVhN2IyNTE5MTIy",
                  displayId: "PO-427",
                  name: "Misc UX",
                  key: "b3ff1c8a-749c-4c38-9dde-d5a7b2519122",
                  workItemType: "epic",
                  epicName: null,
                  epicKey: null,
                  effort: 16.3333333333333,
                  duration: 68.7149421296296,
                  authorCount: 2,
                  budget: 70,
                  startDate: "2020-11-29T22:36:54.303000",
                  endDate: null,
                  closed: false,
                  lastUpdate: "2021-02-22T17:58:36",
                  elapsed: 107.349161726887,
                },
              },
            ],
          },
        },
      },
    },
  },
];

describe("ImplementationCostTableWidget", () => {
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
        request: gqlRequest,
        error: new Error("A network error Occurred"),
      },
    ];

    const mockGraphQlErrors = [
      {
        request: gqlRequest,
        result: {
          errors: [new GraphQLError("A GraphQL Error Occurred")],
        },
      },
    ];

    test("it renders nothing and logs the error when there is a network error", async () => {
      renderWithProviders(<ImplementationCostTableWidget {...propsFixture} />, mockNetworkError);

      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      renderWithProviders(<ImplementationCostTableWidget {...propsFixture} />, mockGraphQlErrors);

      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
    });
  });
});

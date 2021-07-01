import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {waitFor, screen, fireEvent, within} from "@testing-library/react";
import {UPDATE_PROJECT_WORKITEMS} from "./useQueryProjectEpicEffort";
import {getNDaysAgo} from "../../../../../../test/test-utils";
import {ValueBookDetailView as ValueBookDetailViewWithoutIntl} from "./valueBookDetailView";
import {GraphQLError} from "graphql/error";
import {injectIntl} from "react-intl";

const ValueBookDetailView = injectIntl(ValueBookDetailViewWithoutIntl);

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

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const gqlMutationRequest = {
  query: UPDATE_PROJECT_WORKITEMS,
  variables: {
    projectKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
    workItemsInfo: [{workItemKey: "b3ff1c8a-749c-4c38-9dde-d5a7b2519122", budget: 75}],
  },
};

const updateWorkItemsMocks = [
  {
    request: gqlMutationRequest,
    result: {
      data: {
        updateProjectWorkItems: {
          updateStatus: {
            success: true,
            workItemsKeys: ["b3ff1c8a-749c-4c38-9dde-d5a7b2519122"],
            message: null,
            exception: null,
          },
        },
      },
    },
  },
];

const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  data: {
    project: {
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
              startDate: getNDaysAgo(20),
              endDate: null,
              closed: false,
              lastUpdate: null,
              elapsed: 17.5561982505556,
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
              startDate: getNDaysAgo(100),
              endDate: null,
              closed: false,
              lastUpdate: getNDaysAgo(22),
              elapsed: 107.324104477315,
            },
          },
        ],
      },
    },
  },
  activeWithinDays: 30,
  setActiveWithinDays: jest.fn(),
  loading: false,
  specsOnly: false,
  epicChartData: []
};

describe("ValueBookDetailView", () => {
  describe("when there are no workItems", () => {
    const emptyPropsFixture = {
      ...propsFixture,
      data: {project: {workItems: {edges: []}}}
    };

    test("should render table with no records", () => {
      renderWithProviders(<ValueBookDetailView {...emptyPropsFixture} />, updateWorkItemsMocks);
      const {getByText} = within(screen.queryByTestId("implementation-cost-table"));
      getByText(/no data/i);
    });
  });

  describe("when there are workItems", () => {
    test("should render table with correct number of records", () => {
      const {container} = renderWithProviders(<ValueBookDetailView {...propsFixture} />, updateWorkItemsMocks);
      const tableRows = container.querySelectorAll(".ant-table-row");
      expect([...tableRows]).toHaveLength(1);
    });

    test("when budget is updated for any record, save/cancel button should appear", () => {
      renderWithProviders(<ValueBookDetailView {...propsFixture} />, updateWorkItemsMocks);
      const {getByRole} = within(screen.queryByTestId("implementation-cost-table"));
      const budgetTextBox = getByRole("spinbutton");
      fireEvent.change(budgetTextBox, {target: {value: 75}});

      expect(screen.getByText(/save/i)).toBeInTheDocument();
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });

    test("when cancel button is clicked, save/cancel button should disappear", () => {
      renderWithProviders(<ValueBookDetailView {...propsFixture} />, updateWorkItemsMocks);
      const {getByRole} = within(screen.queryByTestId("implementation-cost-table"));
      const budgetTextBox = getByRole("spinbutton");
      fireEvent.change(budgetTextBox, {target: {value: 75}});

      // before
      expect(screen.queryByText(/save/i)).toBeInTheDocument();
      expect(screen.queryByText(/cancel/i)).toBeInTheDocument();

      fireEvent.click(screen.queryByText(/cancel/i));

      // after
      expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
    });

    test("when budget is updated for any record, edited title shows above the table", () => {
      renderWithProviders(<ValueBookDetailView {...propsFixture} />, updateWorkItemsMocks);
      // before
      expect(screen.queryByText(/Budget Edited for Cards/i)).not.toBeInTheDocument();

      const {getByRole} = within(screen.queryByTestId("implementation-cost-table"));
      const budgetTextBox = getByRole("spinbutton");
      fireEvent.change(budgetTextBox, {target: {value: 75}});

      // after
      expect(screen.queryByText(/Budget Edited for Cards/i)).toBeInTheDocument();
    });

    test("when save button is clicked, button loading state should appear during the time mutation is executing. after that there is success message.", async () => {
      renderWithProviders(<ValueBookDetailView {...propsFixture} />, updateWorkItemsMocks);

      // change the value of inputNumber, so that save/cancel appears
      const {getByRole} = within(screen.queryByTestId("implementation-cost-table"));
      const budgetTextBox = getByRole("spinbutton");
      fireEvent.change(budgetTextBox, {target: {value: 75}});

      const saveElement = screen.getByText(/save/i);
      fireEvent.click(saveElement);

      const inProgressElement = screen.getByText(/Processing.../i);
      expect(inProgressElement).toBeInTheDocument();

      // after brief time, success message should appear.
      const successElement = await screen.findByText(/Updated Successfully/i);
      expect(successElement).toBeInTheDocument();
    });

    describe("when there are errors", () => {
      let logGraphQlError;
      beforeAll(() => {
        // changing the mockImplementation to be no-op, so that console remains clean. as we only need to assert whether it has been called.
        logGraphQlError = jest.spyOn(gqlUtils, "logGraphQlError").mockImplementation(() => {});
      });
      afterAll(() => {
        logGraphQlError.mockRestore();
      });

      const mockNetworkError = [
        {
          request: gqlMutationRequest,
          error: new Error("A network error Occurred"),
        },
      ];

      const mockGraphQlErrors = [
        {
          request: gqlMutationRequest,
          result: {
            errors: [new GraphQLError("A GraphQL Error Occurred")],
          },
        },
      ];

      test("it renders network error message and logs the error when there is a network error", async () => {
        renderWithProviders(<ValueBookDetailView {...propsFixture} />, mockNetworkError);

        // change the value of inputNumber, so that save/cancel appears
        const {getByRole} = within(screen.queryByTestId("implementation-cost-table"));
        const budgetTextBox = getByRole("spinbutton");
        fireEvent.change(budgetTextBox, {target: {value: 75}});

        // before
        expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
        await waitFor(() => expect(logGraphQlError).not.toHaveBeenCalled());

        const saveElement = screen.getByText(/save/i);
        fireEvent.click(saveElement);

        const inProgressElement = screen.getByText(/Processing.../i);
        expect(inProgressElement).toBeInTheDocument();

        // after
        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
        expect(screen.queryByText(/network error/i)).toBeInTheDocument();
      });

      test("it renders graphql error message and logs the error when there is a GraphQl error", async () => {
        renderWithProviders(<ValueBookDetailView {...propsFixture} />, mockGraphQlErrors);

        // change the value of inputNumber, so that save/cancel appears
        const {getByRole} = within(screen.queryByTestId("implementation-cost-table"));
        const budgetTextBox = getByRole("spinbutton");
        fireEvent.change(budgetTextBox, {target: {value: 75}});

        // before
        expect(screen.queryByText(/graphql error/i)).not.toBeInTheDocument();
        await waitFor(() => expect(logGraphQlError).not.toHaveBeenCalled());

        const saveElement = screen.getByText(/save/i);
        fireEvent.click(saveElement);

        const inProgressElement = screen.getByText(/Processing.../i);
        expect(inProgressElement).toBeInTheDocument();

        // after
        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
        expect(screen.queryByText(/graphql error/i)).toBeInTheDocument();
      });
    });
  });
});

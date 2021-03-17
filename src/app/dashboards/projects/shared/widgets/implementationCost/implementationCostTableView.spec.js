import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {waitFor, screen, fireEvent, within} from "@testing-library/react";
import {UPDATE_PROJECT_WORKITEMS} from "./useQueryProjectImplementationCost";
import {getNDaysAgo} from "../../../../../../test/test-utils";
import {ImplementationCostTableView as ImplementationCostTableViewWithoutIntl} from "./implementationCostTableView";
import {GraphQLError} from "graphql/error";
import {injectIntl} from "react-intl";

const ImplementationCostTableView = injectIntl(ImplementationCostTableViewWithoutIntl);

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
    workItemsInfo: [
      {workItemKey: "b3ff1c8a-749c-4c38-9dde-d5a7b2519122", budget: 90},
      {workItemKey: "90f21323-1020-4783-abad-fb672d4a888b", budget: 45},
    ],
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
            workItemsKeys: ["b3ff1c8a-749c-4c38-9dde-d5a7b2519122", "90f21323-1020-4783-abad-fb672d4a888b"],
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
  workItems: [
    {
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
      elapsed: 17.5561982505556,
    },
    {
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
      elapsed: 107.324104477315,
    },
  ],
  activeWithinDays: 30,
  setActiveWithinDays: jest.fn(),
  loading: false,
};

describe("ImplementationCostTableView", () => {
  describe("when there are no workItems", () => {
    const emptyPropsFixture = {
      ...propsFixture,
      workItems: [],
    };

    test("should render table with no records", () => {
      renderWithProviders(<ImplementationCostTableView {...emptyPropsFixture} />, updateWorkItemsMocks);
      const {getByText} = within(screen.queryByTestId("implementation-cost-table"));
      getByText(/no data/i);
    });
  });

  describe("when there are workItems", () => {
    test("should render slider with knob at mark 30", () => {
      renderWithProviders(<ImplementationCostTableView {...propsFixture} />, updateWorkItemsMocks);
      const daysRangeSlider = screen.getByRole("slider");
      expect(daysRangeSlider).toBeInTheDocument();
      expect(daysRangeSlider.getAttribute("aria-valuenow")).toBe("30");
    });

    test("should render table with correct number of records", () => {
      const {container} = renderWithProviders(<ImplementationCostTableView {...propsFixture} />, updateWorkItemsMocks);
      const tableRows = container.querySelectorAll(".ant-table-row");
      expect([...tableRows]).toHaveLength(1);
    });

    test("when budget is updated for any record, save/cancel button should appear", () => {
      renderWithProviders(<ImplementationCostTableView {...propsFixture} />, updateWorkItemsMocks);
      const {getByRole} = within(screen.queryByTestId("implementation-cost-table"));
      const budgetTextBox = getByRole("spinbutton");
      fireEvent.change(budgetTextBox, {target: {value: 75}});

      expect(screen.getByText(/save/i)).toBeInTheDocument();
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });

    test("when cancel button is clicked, save/cancel button should disappear", () => {
      renderWithProviders(<ImplementationCostTableView {...propsFixture} />, updateWorkItemsMocks);
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
      renderWithProviders(<ImplementationCostTableView {...propsFixture} />, updateWorkItemsMocks);
      // before 
      expect(screen.queryByText(/Budget Edited for Cards/i)).not.toBeInTheDocument();

      const {getByRole} = within(screen.queryByTestId("implementation-cost-table"));
      const budgetTextBox = getByRole("spinbutton");
      fireEvent.change(budgetTextBox, {target: {value: 75}});

      // after
      expect(screen.queryByText(/Budget Edited for Cards/i)).toBeInTheDocument();
    });
  });
});

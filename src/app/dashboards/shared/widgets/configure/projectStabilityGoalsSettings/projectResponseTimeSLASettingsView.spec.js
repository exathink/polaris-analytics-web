import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import * as settings from "./settingsReducer";
import {waitFor, screen, fireEvent} from "@testing-library/react";
import {GraphQLError} from "graphql";
import {DIMENSION_UPDATE_SETTINGS} from "../../../hooks/useQueryProjectUpdateSettings";
import {ProjectStabilityGoalSettingsView} from "./projectStabilityGoalSettingsView";
import { AppTerms } from "../../../config";

beforeAll(() => {
  jest.spyOn(settings, "settingsReducer");
  // this is remove noise from console.
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  settings.settingsReducer.mockRestore();
  console.log.mockRestore();
});

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  days: 90,
  specsOnly: false,
  dimension: "project",
  data: {
    project: {
      workItemDeliveryCycles: {
        edges: [
          {
            node: {
              name: "Funnel closed does not match Flow Metrics Closed",
              key: "5eb601cc-6a1d-483d-add7-417c321e7109:3588",
              displayId: "PO-396",
              workItemKey: "5eb601cc-6a1d-483d-add7-417c321e7109",
              workItemType: "bug",
              state: "DEPLOYED-TO-STAGING",
              startDate: "2020-12-02T00:37:17.095000",
              endDate: "2020-12-09T22:06:08.221000",
              leadTime: 7.895034722222222,
              cycleTime: 7.894618055555555,
              latency: 0.026180555555555554,
              duration: 4.00299768518519,
              effort: 1.16666666666667,
              authorCount: 1,
            },
          },
          {
            node: {
              name: "Capacity trends widget does not filter out robots. ",
              key: "f6e67348-c174-44a3-b4a4-058b9a967f9b:3603",
              displayId: "PO-402",
              workItemKey: "f6e67348-c174-44a3-b4a4-058b9a967f9b",
              workItemType: "bug",
              state: "DEPLOYED-TO-STAGING",
              startDate: "2020-12-06T17:06:11.068000",
              endDate: "2020-12-06T18:44:16.755000",
              leadTime: 0.06811342592592592,
              cycleTime: null,
              latency: 0.052569444444444446,
              duration: 0,
              effort: 0.333333333333333,
              authorCount: 1,
            },
          },
          {
            node: {
              name: "Backfill Tests: EpicNodeRef and ImplementationCost interfaces for WorkItemDeliveryCycle Nodes",
              key: "a18e5df6-70d0-4e5c-b02d-b5b09aafcf05:3534",
              displayId: "PO-360",
              workItemKey: "a18e5df6-70d0-4e5c-b02d-b5b09aafcf05",
              workItemType: "task",
              state: "ROADMAP",
              startDate: "2020-11-03T14:42:25.847000",
              endDate: "2020-12-05T14:28:16.634000",
              leadTime: 31.990162037037038,
              cycleTime: 31.989745370370372,
              latency: 0,
              duration: null,
              effort: null,
              authorCount: null,
            },
          },
        ],
      },
    },
  },
  targetMetrics: {
    leadTimeTarget: 30,
    cycleTimeTarget: 7,
    leadTimeConfidenceTarget: 0.9,
    cycleTimeConfidenceTarget: 0.9,
  },
};

const gqlMutationRequest = {
  query: DIMENSION_UPDATE_SETTINGS("project"),
  variables: {
    instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
    flowMetricsSettings: {
      leadTimeTarget: 45,
      leadTimeConfidenceTarget: 0.9,
      cycleTimeTarget: 7,
      cycleTimeConfidenceTarget: 0.9,
    },
  },
};

const projectUpdateSettingsMocks = [
  {
    request: gqlMutationRequest,
    result: {
      data: {
        updateProjectSettings: {
          success: true,
          errorMessage: null,
        },
      },
    },
  },
];

describe("ProjectResponseTimeSLASettingsView", () => {


  describe("when cycleTime tab is selected", () => {
    describe("when there are workItems", () => {
      // TODO: seems below click event of metric tab is not firing because of ant design tab is not recieving event.
      test.skip("it renders correct title for Target and Confidence sliders", async () => {
        renderWithProviders(<ProjectStabilityGoalSettingsView {...propsFixture} />, projectUpdateSettingsMocks);

        await waitFor(() => {
          // this receives {type: UPDATE_DEFAULTS}
          expect(settings.settingsReducer).toHaveBeenCalled();
          console.log(settings.settingsReducer.mock.calls);
        });

        // clear above mock
        settings.settingsReducer.mockClear();

        const cycleTimeElement = screen.getByText(/Cycle Time/i);
        fireEvent.click(cycleTimeElement);

        await waitFor(() => {
          // Here it should receive {type: UPDATE_METRIC} but not receiving.
          // expect(settings.settingsReducer).toHaveBeenCalled();
          console.log(settings.settingsReducer.mock.calls);
          // screen.debug(screen.getByText(/1 with no cycle time/i));
        });
      });
    });
  });
});

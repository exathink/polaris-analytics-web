import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import * as settings from "./settingsReducer";
import {waitFor, screen, fireEvent} from "@testing-library/react";
import {GraphQLError} from "graphql";
import {DIMENSION_UPDATE_SETTINGS} from "../../../hooks/useQueryProjectUpdateSettings";
import {ProjectResponseTimeSLASettingsView} from "./projectResponseTimeSLASettingsView";
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
  describe("when leadTime tab is selected", () => {
    describe("when there are no workItems", () => {
      const emptyPropsFixture = {
        ...propsFixture,
        data: {project: {workItemDeliveryCycles: {edges: []}}},
      };
      test("it renders correct title for Target and Confidence sliders", () => {
        renderWithProviders(<ProjectResponseTimeSLASettingsView {...emptyPropsFixture} />, projectUpdateSettingsMocks);

        expect(screen.queryAllByText(/Target/i).length).toBeGreaterThan(0);
        expect(screen.queryAllByText(/Confidence/i).length).toBeGreaterThan(0);
      });

      test("it renders default target and confidence values initially on the sliders", async () => {
        renderWithProviders(<ProjectResponseTimeSLASettingsView {...emptyPropsFixture} />, projectUpdateSettingsMocks);

        const targetInput = await screen.findByTestId("target-range-input");
        expect(targetInput.value).toBe("30");
        const confidenceInput = await screen.findByTestId("confidence-range-input");
        expect(confidenceInput.value).toBe("90");
      });

      test("it renders appropriate message on the chart", async () => {
        renderWithProviders(<ProjectResponseTimeSLASettingsView {...emptyPropsFixture} />, projectUpdateSettingsMocks);
        const cardsRegex = new RegExp(`0 ${AppTerms.cards.display} closed`, "i")
        await screen.findByText(cardsRegex);
      });
    });

    describe("when there are workItems", () => {
      test("it renders appropriate message on the chart", async () => {
        renderWithProviders(<ProjectResponseTimeSLASettingsView {...propsFixture} />, projectUpdateSettingsMocks);
        const cardsRegex = new RegExp(`3 ${AppTerms.cards.display} closed`, "i")
        expect(await screen.findByText(cardsRegex)).toBeInTheDocument();
      });

      // TODO: need to see how to test this, tried few things which are not working.
      test("when target slider value is updated, corresponding plotline is also updated", async () => {});

      test("when confidence slider value is updated, corresponding plotline text is also updated", () => {});

      // This is specific test added for a bug in a slider.
      // because of the way javascript works for floating point precision. (0.57*100 = 56.99999999999999)
      test("when confidence slider value is updated, it renders correct number on the inputNumber text box", () => {
        renderWithProviders(<ProjectResponseTimeSLASettingsView {...propsFixture} />, projectUpdateSettingsMocks);

        // change the value of slider/inputNumber, so that save/cancel appears
        const confidenceInputElement = screen.getByTestId("confidence-range-input");

        // test against values from 0 to 100
        const confVals = Array.from({length: 101}, (_, i) => i);
        confVals.forEach((confVal) => {
          fireEvent.change(confidenceInputElement, {target: {value: confVal}});
          expect(confidenceInputElement.value).toBe(`${confVal}`);
        });
      });
    });

    describe("save/cancel", () => {
      test("when target slider value is updated other than default, save/cancel buttons should appear on the screen", async () => {
        renderWithProviders(<ProjectResponseTimeSLASettingsView {...propsFixture} />, projectUpdateSettingsMocks);

        // change the value of slider/inputNumber, so that save/cancel appears
        const targetInputElement = await screen.findByTestId("target-range-input");
        fireEvent.change(targetInputElement, {target: {value: 45}});

        expect(screen.queryByText(/save/i)).toBeInTheDocument();
        expect(screen.queryByText(/cancel/i)).toBeInTheDocument();
      });

      test("when target slider value is updated back to default, save/cancel buttons should disappear from the screen", async () => {
        renderWithProviders(<ProjectResponseTimeSLASettingsView {...propsFixture} />, projectUpdateSettingsMocks);

        // change the value of slider/inputNumber, so that save/cancel appears
        let targetInputElement = await screen.findByTestId("target-range-input");
        fireEvent.change(targetInputElement, {target: {value: 45}});

        //before
        expect(screen.queryByText(/save/i)).toBeInTheDocument();
        expect(screen.queryByText(/cancel/i)).toBeInTheDocument();

        // update slider input back to default, so that save/cancel disappears
        targetInputElement = await screen.findByTestId("target-range-input");
        fireEvent.change(targetInputElement, {target: {value: 30}});

        //after
        expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
      });

      test("when confidence slider value is updated other than default, save/cancel buttons should appear on the screen", async () => {
        renderWithProviders(<ProjectResponseTimeSLASettingsView {...propsFixture} />, projectUpdateSettingsMocks);

        // change the value of slider/inputNumber, so that save/cancel appears
        const confidenceInputElement = await screen.findByTestId("confidence-range-input");
        fireEvent.change(confidenceInputElement, {target: {value: 0.8}});

        expect(screen.queryByText(/save/i)).toBeInTheDocument();
        expect(screen.queryByText(/cancel/i)).toBeInTheDocument();
      });

      test("when confidence slider value is updated back to default, save/cancel buttons should disappear from the screen", async () => {
        renderWithProviders(<ProjectResponseTimeSLASettingsView {...propsFixture} />, projectUpdateSettingsMocks);

        // change the value of slider/inputNumber, so that save/cancel appears
        let confidenceInputElement = await screen.findByTestId("confidence-range-input");
        fireEvent.change(confidenceInputElement, {target: {value: 0.8}});

        //before
        expect(screen.queryByText(/save/i)).toBeInTheDocument();
        expect(screen.queryByText(/cancel/i)).toBeInTheDocument();

        // update slider input back to default, so that save/cancel disappears
        confidenceInputElement = await screen.findByTestId("confidence-range-input");
        fireEvent.change(confidenceInputElement, {target: {value: 90}});

        //after
        expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
      });

      test("when cancel button is clicked, save/cancel buttons should disappear ", async () => {
        renderWithProviders(<ProjectResponseTimeSLASettingsView {...propsFixture} />, projectUpdateSettingsMocks);

        // change the value of slider/inputNumber, so that save/cancel appears
        const targetInputElement = await screen.findByTestId("target-range-input");
        fireEvent.change(targetInputElement, {target: {value: 45}});

        const saveElement = screen.getByText(/save/i);
        const cancelElement = screen.getByText(/cancel/i);

        // Before Cancel Button Click
        expect(saveElement).toBeInTheDocument();
        expect(cancelElement).toBeInTheDocument();

        fireEvent.click(cancelElement);

        // After Cancel Button Click
        expect(saveElement).not.toBeInTheDocument();
        expect(cancelElement).not.toBeInTheDocument();
      });

      test("when save button is clicked, button loading state should appear during the time mutation is executing. after that there is success message.", async () => {
        renderWithProviders(<ProjectResponseTimeSLASettingsView {...propsFixture} />, projectUpdateSettingsMocks);

        // change the value of slider/inputNumber, so that save/cancel appears
        const targetInputElement = await screen.findByTestId("target-range-input");
        fireEvent.change(targetInputElement, {target: {value: 45}});

        const saveElement = screen.getByText(/save/i);
        fireEvent.click(saveElement);

        const inProgressElement = screen.getByText(/Processing.../i);
        expect(inProgressElement).toBeInTheDocument();

        // after brief time, success message should appear.
        const successElement = await screen.findByText(/success/i);
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
        test("it renders network error and logs the error when there is a network error", async () => {
          renderWithProviders(<ProjectResponseTimeSLASettingsView {...propsFixture} />, mockNetworkError);

          // change the value of slider/inputNumber, so that save/cancel appears
          const targetInputElement = await screen.findByTestId("target-range-input");
          fireEvent.change(targetInputElement, {target: {value: 45}});

          // before
          await waitFor(() => expect(logGraphQlError).not.toHaveBeenCalled());
          expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();

          const saveElement = screen.getByText(/save/i);
          fireEvent.click(saveElement);

          const inProgressElement = screen.getByText(/Processing.../i);
          expect(inProgressElement).toBeInTheDocument();

          // after
          await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
          expect(screen.queryByText(/network error/i)).toBeInTheDocument();
        });

        test("it renders graphql error and logs the error when there is a GraphQl error", async () => {
          renderWithProviders(<ProjectResponseTimeSLASettingsView {...propsFixture} />, mockGraphQlErrors);

          // change the value of slider/inputNumber, so that save/cancel appears
          const targetInputElement = await screen.findByTestId("target-range-input");
          fireEvent.change(targetInputElement, {target: {value: 45}});

          // before
          await waitFor(() => expect(logGraphQlError).not.toHaveBeenCalled());
          expect(screen.queryByText(/graphql error/i)).not.toBeInTheDocument();

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

  describe("when cycleTime tab is selected", () => {
    describe("when there are workItems", () => {
      // TODO: seems below click event of metric tab is not firing because of ant design tab is not recieving event.
      test.skip("it renders correct title for Target and Confidence sliders", async () => {
        renderWithProviders(<ProjectResponseTimeSLASettingsView {...propsFixture} />, projectUpdateSettingsMocks);

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

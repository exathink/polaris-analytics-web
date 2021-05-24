import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../framework/viz/charts/chart-test-utils";
import {waitFor, screen, fireEvent} from "@testing-library/react";
import {GraphQLError} from "graphql";
import {PROJECT_UPDATE_SETTINGS} from "../../shared/hooks/useQueryProjectUpdateSettings";
import {MeasurementSettingsView} from "./measurementSettingsView";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const propsFixture = {
  instanceKey: "8e4d188a-f5a1-4230-a0a2-ef9d8d955f6a",
  includeSubTasksFlowMetrics: false,
  includeSubTasksWipInspector: false,
};

const measurementSettings = {
  flowMetricsSettings: {
    includeSubTasks: propsFixture.includeSubTasksFlowMetrics,
  },
  wipInspectorSettings: {
    includeSubTasks: propsFixture.includeSubTasksWipInspector,
  },
};

describe("MeasurementSettingsView", () => {
  describe("save/cancel", () => {
    let logGraphQlError;
    beforeAll(() => {
      // changing the mockImplementation to be no-op, so that console remains clean. as we only need to assert whether it has been called.
      logGraphQlError = jest.spyOn(gqlUtils, "logGraphQlError").mockImplementation(() => {});
    });
    afterAll(() => {
      logGraphQlError.mockRestore();
    });

    const cases = [
      {
        name: "flowMetricsSettings",
        default: propsFixture.includeSubTasksFlowMetrics,
        newValue: true,
      },
      {
        name: "wipInspectorSettings",
        default: propsFixture.includeSubTasksWipInspector,
        newValue: true,
      },
    ];
    cases.forEach((measurementItem, index) => {
      describe(`${measurementItem.name}`, () => {
        const mutationReq = {
          query: PROJECT_UPDATE_SETTINGS,
          variables: {
            projectKey: propsFixture.instanceKey,
            ...measurementSettings,
            [`${measurementItem.name}`]: {
              includeSubTasks: measurementItem.newValue,
            },
          },
        };

        const settingsMocks = [
          {
            request: mutationReq,
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

        test("when include subtasks checkbox is updated other than default, save/cancel buttons should appear on the screen", async () => {
          renderWithProviders(<MeasurementSettingsView {...propsFixture} />, settingsMocks);

          // change the default value of checkbox, so that save/cancel appears
          const checkboxElements = await screen.findAllByRole("checkbox");
          fireEvent.click(checkboxElements[index]);

          expect(screen.queryByText(/save/i)).toBeInTheDocument();
          expect(screen.queryByText(/cancel/i)).toBeInTheDocument();
        });

        test("when checkbox value is updated back to default, save/cancel buttons should disappear from the screen", async () => {
          renderWithProviders(<MeasurementSettingsView {...propsFixture} />, settingsMocks);

          // change the default value of checkbox, so that save/cancel appears
          const checkboxElements = await screen.findAllByRole("checkbox");
          fireEvent.click(checkboxElements[index]);

          //before
          expect(screen.queryByText(/save/i)).toBeInTheDocument();
          expect(screen.queryByText(/cancel/i)).toBeInTheDocument();

          // update checkbox back to default, so that save/cancel disappears
          fireEvent.click(checkboxElements[index]);

          //after
          expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
        });

        test("when cancel button is clicked, save/cancel buttons should disappear", async () => {
          renderWithProviders(<MeasurementSettingsView {...propsFixture} />, settingsMocks);

          // change the default value of checkbox, so that save/cancel appears
          const checkboxElements = await screen.findAllByRole("checkbox");
          fireEvent.click(checkboxElements[index]);

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
          renderWithProviders(<MeasurementSettingsView {...propsFixture} />, settingsMocks);

          // change the default value of checkbox, so that save/cancel appears
          const checkboxElements = await screen.findAllByRole("checkbox");
          fireEvent.click(checkboxElements[index]);

          const saveElement = screen.getByText(/save/i);
          fireEvent.click(saveElement);

          const inProgressElement = screen.getByText(/Processing.../i);
          expect(inProgressElement).toBeInTheDocument();

          // after brief time, success message should appear.
          const successElement = await screen.findByText(/Measurement settings updated successfully./i);
          expect(successElement).toBeInTheDocument();
        });

        describe("when there are errors", () => {
          const mockNetworkError = [
            {
              request: mutationReq,
              error: new Error("A network error Occurred"),
            },
          ];

          const mockGraphQlErrors = [
            {
              request: mutationReq,
              result: {
                errors: [new GraphQLError("A GraphQL Error Occurred")],
              },
            },
          ];

          test("it renders network error message and logs the error when there is a network error", async () => {
            renderWithProviders(<MeasurementSettingsView {...propsFixture} />, mockNetworkError);

            // change the default value of checkbox, so that save/cancel appears
            const checkboxElements = await screen.findAllByRole("checkbox");
            fireEvent.click(checkboxElements[index]);

            // before
            expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
            await waitFor(() => expect(logGraphQlError).not.toHaveBeenCalled());

            const saveElement = screen.getByText(/save/i);
            fireEvent.click(saveElement);

            const inProgressElement = screen.getByText(/Processing.../i);
            expect(inProgressElement).toBeInTheDocument();

            await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
            // after
            expect(screen.queryByText(/network error/i)).toBeInTheDocument();
          });

          test("it renders graphql error message and logs the error when there is a GraphQl error", async () => {
            renderWithProviders(<MeasurementSettingsView {...propsFixture} />, mockGraphQlErrors);

            // change the default value of checkbox, so that save/cancel appears
            const checkboxElements = await screen.findAllByRole("checkbox");
            fireEvent.click(checkboxElements[index]);

            // before
            expect(screen.queryByText(/graphql error/i)).not.toBeInTheDocument();
            await waitFor(() => expect(logGraphQlError).not.toHaveBeenCalled());

            const saveElement = screen.getByText(/save/i);
            fireEvent.click(saveElement);

            const inProgressElement = screen.getByText(/Processing.../i);
            expect(inProgressElement).toBeInTheDocument();

            await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
            // after
            expect(screen.queryByText(/graphql error/i)).toBeInTheDocument();
          });
        });
      });
    });
  });
});

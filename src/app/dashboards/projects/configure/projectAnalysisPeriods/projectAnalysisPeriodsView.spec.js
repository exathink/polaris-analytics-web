import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../framework/viz/charts/chart-test-utils";
import * as analysis from "./analysisPeriodsReducer";
import {waitFor, screen, fireEvent} from "@testing-library/react";
import {GraphQLError} from "graphql";
import {PROJECT_UPDATE_SETTINGS} from "../../shared/hooks/useQueryProjectUpdateSettings";
import {ProjectAnalysisPeriodsView} from "./projectAnalysisPeriodsView";

beforeAll(() => {
  jest.spyOn(analysis, "analysisPeriodsReducer");
});

afterAll(() => {
  analysis.analysisPeriodsReducer.mockRestore();
});

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  wipAnalysisPeriod: 7,
  flowAnalysisPeriod: 30,
  trendsAnalysisPeriod: 45,
};

describe("ProjectAnalysisPeriodsView", () => {
  describe("save/cancel", () => {
    let logGraphQlError;
    beforeEach(() => {
      // changing the mockImplementation to be no-op, so that console remains clean. as we only need to assert whether it has been called.
      logGraphQlError = jest.spyOn(gqlUtils, "logGraphQlError").mockImplementation(() => {});
    });

    const cases = [
      {name: "wipAnalysisPeriod", default: 7, newValue: 14, testId: "wip-range-input"},
      {name: "flowAnalysisPeriod", default: 30, newValue: 35, testId: "flow-range-input"},
      {name: "trendsAnalysisPeriod", default: 45, newValue: 50, testId: "trends-range-input"},
    ];
    cases.forEach((analysisItem) => {
      describe(`${analysisItem.name}`, () => {
        const analysisPeriods = {
          wipAnalysisPeriod: propsFixture.wipAnalysisPeriod,
          flowAnalysisPeriod: propsFixture.flowAnalysisPeriod,
          trendsAnalysisPeriod: propsFixture.trendsAnalysisPeriod,
        };
        const mutationReq = {
          query: PROJECT_UPDATE_SETTINGS,
          variables: {
            projectKey: propsFixture.instanceKey,
            analysisPeriods: {
              ...analysisPeriods,
              [`${analysisItem.name}`]: analysisItem.newValue,
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

        test("when analysis slider value is updated other than default, save/cancel buttons should appear on the screen", async () => {
          renderWithProviders(<ProjectAnalysisPeriodsView {...propsFixture} />, settingsMocks);

          // change the value of slider/inputNumber, so that save/cancel appears
          const inputElement = await screen.findByTestId(analysisItem.testId);
          fireEvent.change(inputElement, {target: {value: analysisItem.newValue}});

          expect(screen.queryByText(/save/i)).toBeInTheDocument();
          expect(screen.queryByText(/cancel/i)).toBeInTheDocument();
        });

        test("when slider value is updated back to default, save/cancel buttons should disappear from the screen", async () => {
          renderWithProviders(<ProjectAnalysisPeriodsView {...propsFixture} />, settingsMocks);

          // change the value of slider/inputNumber, so that save/cancel appears
          let inputElement = await screen.findByTestId(analysisItem.testId);
          fireEvent.change(inputElement, {target: {value: analysisItem.newValue}});

          //before
          expect(screen.queryByText(/save/i)).toBeInTheDocument();
          expect(screen.queryByText(/cancel/i)).toBeInTheDocument();

          // update slider input back to default, so that save/cancel disappears
          inputElement = await screen.findByTestId(analysisItem.testId);
          fireEvent.change(inputElement, {target: {value: analysisItem.default}});

          //after
          expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
        });

        test("when cancel button is clicked, save/cancel buttons should disappear ", async () => {
          renderWithProviders(<ProjectAnalysisPeriodsView {...propsFixture} />, settingsMocks);

          // change the value of slider/inputNumber, so that save/cancel appears
          const inputElement = await screen.findByTestId(analysisItem.testId);
          fireEvent.change(inputElement, {target: {value: analysisItem.newValue}});

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
          renderWithProviders(<ProjectAnalysisPeriodsView {...propsFixture} />, settingsMocks);

          // change the value of slider/inputNumber, so that save/cancel appears
          const inputElement = await screen.findByTestId(analysisItem.testId);
          fireEvent.change(inputElement, {target: {value: analysisItem.newValue}});

          const saveElement = screen.getByText(/save/i);
          fireEvent.click(saveElement);

          const inProgressElement = screen.getByText(/Processing.../i);
          expect(inProgressElement).toBeInTheDocument();

          // after brief time, success message should appear.
          const successElement = await screen.findByText(/Analysis Periods updated successfully/i);
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
            renderWithProviders(<ProjectAnalysisPeriodsView {...propsFixture} />, mockNetworkError);

            // change the value of slider/inputNumber, so that save/cancel appears
            const inputElement = await screen.findByTestId(analysisItem.testId);
            fireEvent.change(inputElement, {target: {value: analysisItem.newValue}});

            // before
            expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();

            const saveElement = screen.getByText(/save/i);
            fireEvent.click(saveElement);

            const inProgressElement = screen.getByText(/Processing.../i);
            expect(inProgressElement).toBeInTheDocument();

            await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
            // after
            expect(screen.queryByText(/network error/i)).toBeInTheDocument();
          });

          test("it renders graphql error message and logs the error when there is a GraphQl error", async () => {
            renderWithProviders(<ProjectAnalysisPeriodsView {...propsFixture} />, mockGraphQlErrors);

            // change the value of slider/inputNumber, so that save/cancel appears
            const inputElement = await screen.findByTestId(analysisItem.testId);
            fireEvent.change(inputElement, {target: {value: analysisItem.newValue}});

            // before
            expect(screen.queryByText(/graphql error/i)).not.toBeInTheDocument();

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

import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import * as analysis from "./analysisPeriodsReducer";
import {waitFor, screen, fireEvent, within} from "@testing-library/react";
import {GraphQLError} from "graphql";
import {DIMENSION_UPDATE_SETTINGS} from "../../../hooks/useQueryProjectUpdateSettings";
import {ProjectAnalysisPeriodsView} from "./projectAnalysisPeriodsView";

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
  dimension: "project",
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  wipAnalysisPeriod: 7,
  flowAnalysisPeriod: 30,
  trendsAnalysisPeriod: 45,
};

const analysisPeriods = {
  wipAnalysisPeriod: propsFixture.wipAnalysisPeriod,
  flowAnalysisPeriod: propsFixture.flowAnalysisPeriod,
  trendsAnalysisPeriod: propsFixture.trendsAnalysisPeriod,
};

const gqlMutationRequest = {
  query: DIMENSION_UPDATE_SETTINGS("project"),
  variables: {
    instanceKey: propsFixture.instanceKey,
    analysisPeriods: analysisPeriods,
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

describe("ProjectAnalysisPeriodsView", () => {
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
      {name: "wipAnalysisPeriod", default: propsFixture.wipAnalysisPeriod, newValue: 14, testId: "wip-range-input"},
      {name: "flowAnalysisPeriod", default: propsFixture.flowAnalysisPeriod, newValue: 35, testId: "flow-range-input"},
      {name: "trendsAnalysisPeriod", default: propsFixture.trendsAnalysisPeriod, newValue: 50, testId: "trends-range-input"},
    ];
    cases.forEach((analysisItem) => {
      describe(`${analysisItem.name}`, () => {
        const mutationReq = {
          query: DIMENSION_UPDATE_SETTINGS("project"),
          variables: {
            instanceKey: propsFixture.instanceKey,
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

  describe("warnings for violating constraints", () => {
    test("when flow slider value is updated less than current wip analysis period, appropriate warning message appears", async () => {
      renderWithProviders(<ProjectAnalysisPeriodsView {...propsFixture} />, projectUpdateSettingsMocks);

      let wipInputElement = await screen.findByTestId("wip-range-input");
      let flowInputElement = await screen.findByTestId("flow-range-input");

      //before
      expect(
        screen.queryByText(/flow analysis period can not be smaller than wip analysis period/i)
      ).not.toBeInTheDocument();

      // update flow slider to be one less than wip slider
      fireEvent.change(flowInputElement, {target: {value: Number(wipInputElement.value) - 1}});

      //after
      expect(
        screen.queryByText(/flow analysis period can not be smaller than wip analysis period/i)
      ).toBeInTheDocument();
    });

    test("when flow slider value is updated less than current wip analysis period, save/cancel doesn't appear and slider value remains same", async () => {
      renderWithProviders(<ProjectAnalysisPeriodsView {...propsFixture} />, projectUpdateSettingsMocks);

      let wipInputElement = await screen.findByTestId("wip-range-input");
      let flowInputElement = await screen.findByTestId("flow-range-input");

      //before
      expect(flowInputElement.value).toBe("30");

      // update flow slider to be one less than wip slider
      fireEvent.change(flowInputElement, {target: {value: Number(wipInputElement.value) - 1}});
      fireEvent.blur(flowInputElement);
      //after
      expect(flowInputElement.value).toBe("30");
      // save/cancel button should not appear
      expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
    });

    test("when flow slider value is updated less than current wip analysis period, if save/cancel was already there, it remains there after closing warning message", async () => {
      renderWithProviders(<ProjectAnalysisPeriodsView {...propsFixture} />, projectUpdateSettingsMocks);
      let trendsInputElement = await screen.findByTestId("trends-range-input");
      // will cause save/cancel to appear
      fireEvent.change(trendsInputElement, {target: {value: 44}});
      // save/cancel button should appear
      expect(screen.queryByText(/save/i)).toBeInTheDocument();
      expect(screen.queryByText(/cancel/i)).toBeInTheDocument();

      let wipInputElement = await screen.findByTestId("wip-range-input");
      let flowInputElement = await screen.findByTestId("flow-range-input");

      //before
      expect(flowInputElement.value).toBe("30");

      // update flow slider to be one less than wip slider
      fireEvent.change(flowInputElement, {target: {value: Number(wipInputElement.value) - 1}});
      fireEvent.blur(flowInputElement);
      
      const warningMessageElement = screen.queryByText(
        /flow analysis period can not be smaller than wip analysis period/i
      );
      //after
      expect(flowInputElement.value).toBe("30");
      expect(warningMessageElement).toBeInTheDocument();
      // save/cancel button should not appear as warning message is there
      expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();

      // close warning message
      const {getByRole} = within(screen.getByTestId("analysis-period-buttons"));
      fireEvent.click(getByRole("button"));

      expect(warningMessageElement).not.toBeInTheDocument();
      // save/cancel button should appear as warning message is closed now
      expect(screen.queryByText(/save/i)).toBeInTheDocument();
      expect(screen.queryByText(/cancel/i)).toBeInTheDocument();
    });

    test("when trends slider value is updated less than current flow analysis period, appropriate warning message appears", async () => {
      renderWithProviders(<ProjectAnalysisPeriodsView {...propsFixture} />, projectUpdateSettingsMocks);

      let flowInputElement = await screen.findByTestId("flow-range-input");
      let trendsInputElement = await screen.findByTestId("trends-range-input");

      //before
      expect(
        screen.queryByText(/trends analysis period can not be smaller than flow analysis period/i)
      ).not.toBeInTheDocument();

      // update trends slider to be one less than flow slider
      fireEvent.change(trendsInputElement, {target: {value: Number(flowInputElement.value) - 1}});

      //after
      expect(
        screen.queryByText(/trends analysis period can not be smaller than flow analysis period/i)
      ).toBeInTheDocument();
    });

    test("when wip slider value is updated greater than current flow analysis period, appropriate warning message appears", async () => {
      renderWithProviders(<ProjectAnalysisPeriodsView {...propsFixture} />, projectUpdateSettingsMocks);

      let wipInputElement = await screen.findByTestId("wip-range-input");
      let flowInputElement = await screen.findByTestId("flow-range-input");

      //before
      expect(
        screen.queryByText(/wip analysis period can not be greater than flow analysis period/i)
      ).not.toBeInTheDocument();

      // update wip slider to be one greater than flow slider
      fireEvent.change(wipInputElement, {target: {value: Number(flowInputElement.value) + 1}});

      //after
      expect(
        screen.queryByText(/wip analysis period can not be greater than flow analysis period/i)
      ).toBeInTheDocument();
    });

    test("when flow slider value is updated greater than current trends analysis period, appropriate warning message appears", async () => {
      renderWithProviders(<ProjectAnalysisPeriodsView {...propsFixture} />, projectUpdateSettingsMocks);

      let flowInputElement = await screen.findByTestId("flow-range-input");
      let trendsInputElement = await screen.findByTestId("trends-range-input");

      //before
      expect(
        screen.queryByText(/flow analysis period can not be greater than trends analysis period/i)
      ).not.toBeInTheDocument();

      // update flow slider to be one greater than trends slider
      fireEvent.change(flowInputElement, {target: {value: Number(trendsInputElement.value) + 1}});

      //after
      expect(
        screen.queryByText(/flow analysis period can not be greater than trends analysis period/i)
      ).toBeInTheDocument();
    });
  });
});

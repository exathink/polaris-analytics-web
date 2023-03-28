import React from "react";
import {render, waitFor} from "@testing-library/react";
import {AppProviders, getAppProviders, getContextProviders, getMockContextProviders, AppRouterProviders} from "../../../../test/providers";
import * as tooltipUtil from "./tooltip";
import {TestDataContext} from "./TestDataContext";

export const gqlUtils = require("./../../../components/graphql/utils");

// spy tooltipHtml function of tooltip module
jest.spyOn(tooltipUtil, "tooltipHtml");

function isObject(val) {
  return val != null && typeof val === "object" && Array.isArray(val) === false;
}

/**
 * 1. render widget, view, chart components
 * 2. also works with MockedProvider
 * 3. can pass extra optional test data through context provider
 * 4. 2nd and 3rd params are optional
 * 5. params in order when all 3 are present: (component, mocks = [], options = {})
 * 6. params in order when only 2 are present: (component, mocks/options), second arg could be either mocks or options
 * 
 * Eg usage:
 * 
 * i)  renderWithProviders(<Component {...props} />)
 * 
 * ii) renderWithProviders(<Component {...props} />, mocks)
 * 
 * iii)renderWithProviders(<Component {...props} />, options)
 * 
 * iv) renderWithProviders(<Component {...props}/>, mocks, options)
 * 
 * Example from app: 
 * add testid to chart and chart points.
 * 
 * renderWithProviders(<Widget {...props} />, {
 *    chartTestId: "test-chart",
 *    pointOptions: {seriesIndex:0, mapper: points => [points[0], points[1]]}
 * }); 
 * 
 */

export function renderWithProviders(component, ...rest) {
  const [secondArg, thirdArg] = rest;

  function getProviders() {
    if (rest.length === 0) {
      // when (component), render with intl provider only.
      return AppRouterProviders;
    }

    if (rest.length === 1) {
      if (Array.isArray(secondArg)) {
        // when (component, mocks), render with MockedProvider
        const mocks = secondArg;
        return getAppProviders(mocks);
      }

      if (isObject(secondArg)) {
        // when (component, options), render with ContextProvider
        const options = secondArg;
        return getContextProviders(options);
      }
    }

    if (rest.length === 2) {
      if (Array.isArray(secondArg) && isObject(thirdArg)) {
        // when (component, mocks, options), render with both MockedProvider and ContextProvider
        const [mocks, options] = [secondArg, thirdArg];
        return getMockContextProviders(mocks, options);
      }
    }
  }

  return render(component, {
    wrapper: getProviders(),
  });
}

/**
 * 1. render widget, view, chart components
 * 2. also works with MockedProvider
 * 3. can pass extra optional test data through context provider
 * 4. 2nd and 3rd params are optional
 * 5. params in order when all 3 are present: (component, mocks = [], options = {})
 * 6. params in order when only 2 are present: (component, mocks/options), second arg could be either mocks or options
 * 7. returns chart and chartConfig
 */
export async function renderWithProvidersGetChartAndConfig(component, ...rest) {
  const chartSpy = jest.fn((x) => x);
  const configSpy = jest.fn((x) => x);

  const [secondArg, thirdArg] = rest;
  function getOptions() {
    if (rest.length === 0) {
      // when (component)
      return {};
    }

    if (rest.length === 1) {
      if (Array.isArray(secondArg)) {
        // when (component, mocks)
        return {};
      }

      if (isObject(secondArg)) {
        // when (component, options)
        const options = secondArg;
        return options;
      }
    }

    if (rest.length === 2) {
      if (Array.isArray(secondArg) && isObject(thirdArg)) {
        const options = thirdArg;
        return options;
      }
    }
  }

  function getMocks() {
    return (rest.length === 1 || rest.length === 2) && Array.isArray(secondArg) ? [secondArg] : [];
  }

  const contextValue = {chartSpy, configSpy, ...getOptions()};
  const restArgs = [...getMocks(), contextValue];

  // don't need to capture render result, as we are using screen global to make the assertions.
  renderWithProviders(component, ...restArgs);

  // it'll wait until the mock function has been called once.
  await waitFor(() => expect(chartSpy).toHaveBeenCalled());
  return {chart: chartSpy.mock.results[0].value, chartConfig: configSpy.mock.results[0].value};
}

export function renderedChartConfig(chartComponent) {
  const configSpy = jest.fn((x) => x);

  render(<TestDataContext.Provider value={{configSpy: configSpy}}>{chartComponent}</TestDataContext.Provider>, {
    wrapper: AppProviders,
  });

  return configSpy.mock.results[0].value;
}

export async function renderedChart(chartComponent) {
  const chartSpy = jest.fn((x) => x);

  render(<TestDataContext.Provider value={{chartSpy: chartSpy}}>{chartComponent}</TestDataContext.Provider>, {
    wrapper: AppProviders,
  });

  // it'll wait until the mock function has been called once.
  await waitFor(() => expect(chartSpy).toHaveBeenCalledTimes(1));
  return chartSpy.mock.results[0].value;
}

/**
 * will return first argument of tooltipHtml function for all points
 * filtered by mapper in a single series identified by seriesIndex.
 *
 * @param {*} chartComponent
 * @param {*} mapper : points => points
 * @param {*} seriesIndex : index of the series of series arr from chart config
 */
// assuming number of series in a chart will always be limited, so using seriesIndex
export async function renderedTooltipConfig(chartComponent, mapper = (point) => point, seriesIndex = 0) {
  const {
    chart: {series},
    chartConfig: {
      tooltip: {formatter},
    },
  } = await renderWithProvidersGetChartAndConfig(chartComponent);
  const {points} = series[seriesIndex];

  // get the points after applying mapper
  const testPoints = mapper(points);

  // call the formatter only for the mapped points
  return testPoints.map((point, i) => {
    // call the formatter in the context of point
    formatter.bind({point: point})();
    // first argument of the i-th call
    return tooltipUtil.tooltipHtml.mock.calls[i][0];
  });
}

/**
 * will return result of calling the data labels formatter function for all points
 * filtered by mapper in a single series identified by seriesIndex.
 *
 * @param {*} chartComponent
 * @param {*} mapper : points => points
 * @param {*} seriesIndex : index of the series of series arr from chart config
 */
// assuming number of series in a chart will always be limited, so using seriesIndex
export async function renderedDataLabels(chartComponent, mapper = (point) => point, seriesIndex = 0) {
  const {
    chart: {series: chartSeries},
    chartConfig: {series: configSeries},
  } = await renderWithProvidersGetChartAndConfig(chartComponent);

  const {formatter} = configSeries[seriesIndex].dataLabels;
  expect(formatter).toBeDefined();

  const {points} = chartSeries[seriesIndex];

  // get the points after applying mapper
  const testPoints = mapper(points);

  // call the formatter only for the mapped points
  return testPoints.map((point, i) => {
    // call the formatter in the context of point
    return formatter.bind({point: point})();
  });
}
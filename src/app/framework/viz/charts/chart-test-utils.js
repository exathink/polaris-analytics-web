import React from "react";
import {render, waitFor} from "@testing-library/react";
import {AppProviders} from "../../../../test/providers";
import {SpyContext} from "./chartSpyContext";

import {tooltipHtml as tooltipHtmlMock} from "./tooltip";
// mock tooltipHtml function of tooltip module
jest.mock("./tooltip", () => {
  return {
    tooltipHtml: jest.fn((obj) => obj),
  };
});

// custom render function specific to our app using render of testing-lib
export function renderChart(ui) {
  const returnValue = {
    ...render(ui, {
      wrapper: AppProviders,
    }),
  };

  return returnValue;
}

export function getChartConfig(configSpy) {
  return configSpy.mock.results[0].value;
}

export function renderedChartConfig(chartComponent) {
  const configSpy = jest.fn((x) => x);

  render(<SpyContext.Provider value={{configSpy: configSpy}}>{chartComponent}</SpyContext.Provider>, {
    wrapper: AppProviders,
  });

  return configSpy.mock.results[0].value;
}

export async function renderedChart(chartComponent) {
  const chartSpy = jest.fn((x) => x);

  render(<SpyContext.Provider value={{onChartUpdated: chartSpy}}>{chartComponent}</SpyContext.Provider>, {
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
export async function getTooltipUtil(chartComponent, mapper, seriesIndex = 0) {
  const {series} = await renderedChart(chartComponent);
  const {points} = series[seriesIndex];

  const {
    tooltip: {formatter},
  } = renderedChartConfig(chartComponent);

  // get the points after applying mapper
  const _points = mapper(points);

  // call the formatter only for the mapped points
  return _points.map((point, i) => {
    // call the formatter in the context of point
    formatter.bind({point: point})();
    // first argument of the i-th call
    return tooltipHtmlMock.mock.calls[i][0];
  });
}

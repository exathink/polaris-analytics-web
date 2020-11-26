import React from "react";
import {render, waitFor} from "@testing-library/react";
import {AppProviders} from "./providers";
import {IntlProvider} from "react-intl";
import {tooltipHtml as tooltipHtmlMock} from "../app/framework/viz/charts/tooltip";
// mock tooltipHtml function of tooltip module
jest.mock("../app/framework/viz/charts/tooltip", () => {
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

  render(React.cloneElement(chartComponent, {configSpy: configSpy}), {
    wrapper: AppProviders,
  });

  return configSpy.mock.results[0].value;
}

export async function renderedChart(chartComponent) {
  const chartSpy = jest.fn((x) => x);

  render(React.cloneElement(chartComponent, {onChartUpdated: chartSpy}), {
    wrapper: AppProviders,
  });

  // it'll wait until the mock function has been called once.
  await waitFor(() => expect(chartSpy).toHaveBeenCalledTimes(1));
  return chartSpy.mock.results[0].value;
}

export function expectSetsAreEqual(arraya, arrayb) {
  expect(new Set(arraya)).toEqual(new Set(arrayb));
}

export function getIntl() {
  // Create IntlProvider to retrieve React Intl context
  const intlProvider = new IntlProvider(
    {
      locale: "en",
    },
    {}
  );
  const {intl} = intlProvider.getChildContext();
  return intl;
}

/**
 * will return first argument of tooltipHtml function for all points 
 * filtered by mapper in a single series identified by seriesIndex.
 * 
 * @param {*} chartComponent
 * @param {*} mapper : points => points
 * @param {*} seriesIndex : index of the series of series arr from char config
 */
// assuming number of series in a chart will always be limited, so using seriesIndex
export async function getTooltipUtil(chartComponent, mapper, seriesIndex = 0) {
  const {series} = await renderedChart(React.cloneElement(chartComponent));
  const {points} = series[seriesIndex];

  const {
    tooltip: {formatter},
  } = renderedChartConfig(React.cloneElement(chartComponent));

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

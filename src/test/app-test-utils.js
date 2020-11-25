import React from 'react';
import {render, waitFor} from "@testing-library/react";
import {AppProviders} from "./providers";
import { IntlProvider } from 'react-intl';

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
  await waitFor(() => expect(chartSpy).toHaveBeenCalledTimes(1))
  return chartSpy.mock.results[0].value;
}

export function expectSetsAreEqual(arraya, arrayb) {
  expect(new Set(arraya)).toEqual(new Set(arrayb))
}

export function getIntl() {
  // Create IntlProvider to retrieve React Intl context
  const intlProvider = new IntlProvider(
    {
      locale: "en"
    },
    {}
  );
  const {intl} = intlProvider.getChildContext();
  return intl;
}
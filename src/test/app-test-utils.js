import React from 'react';
import {render} from "@testing-library/react";
import {AppProviders} from "./providers";

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


export function expectSetsAreEqual(arraya, arrayb) {
  expect(new Set(arraya)).toEqual(new Set(arrayb))
}
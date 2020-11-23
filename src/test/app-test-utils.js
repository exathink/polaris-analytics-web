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

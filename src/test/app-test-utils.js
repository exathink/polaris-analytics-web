import {render as rtlRender, screen, waitForElementToBeRemoved} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {AppProviders} from "path/to/context";

// custom render function specific to our app using render of testing-lib
async function render(ui, {route = "/app", ...renderOptions} = {}) {
  const returnValue = {
    ...rtlRender(ui, {
      wrapper: AppProviders,
      ...renderOptions,
    }),
  };

  // wait for api request to settle before allowing the test to continue
  await waitForLoadingToFinish();

  return returnValue;
}

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(() => [...screen.queryAllByLabelText(/loading/i), ...screen.queryAllByText(/loading/i)], {
    timeout: 4000,
  });

// re-exporting everything from testing-lib
export * from "@testing-library/react";
export {render, userEvent, waitForLoadingToFinish};

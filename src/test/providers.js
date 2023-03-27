import * as React from "react";
import {IntlProvider} from "react-intl";
import {MockedProvider} from "@apollo/client/testing";
import AppLocale from "../app/i18n";
import config, {getCurrentLanguage} from "../containers/LanguageSwitcher/config";
import {TestDataContext} from "../app/framework/viz/charts/TestDataContext";
import {Router} from "react-router";
import {createMemoryHistory} from "history";

export const currentAppLocale = AppLocale[getCurrentLanguage(config.defaultLanguage || "english").locale];

function AppProviders({children}) {
  return (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
      {children}
    </IntlProvider>
  );
}


export function AppRouterProviders({children}) {
  let history = createMemoryHistory();
  return (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
      <Router history={history}>{children}</Router>
    </IntlProvider>
  );
}

// Higher order utility function to wrap with MockedProvider
// this will help in mocking api responses for widget components
function getAppProviders(mocks) {
  let history = createMemoryHistory();
  return ({children}) => (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
      <Router history={history}>
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      </Router>
    </IntlProvider>
  );
}

function getContextProviders(contextValue) {
  return ({children}) => (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
      <TestDataContext.Provider value={contextValue}>{children}</TestDataContext.Provider>
    </IntlProvider>
  );
}

function getMockContextProviders(mocks, contextValue) {
  return ({children}) => (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <TestDataContext.Provider value={contextValue}>{children}</TestDataContext.Provider>
      </MockedProvider>
    </IntlProvider>
  );
}

export {AppProviders, getAppProviders, getContextProviders, getMockContextProviders};

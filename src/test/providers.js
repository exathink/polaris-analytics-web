import * as React from "react";
import {IntlProvider} from "react-intl";
import {MockedProvider} from "@apollo/client/testing";
import AppLocale from "../app/i18n";
import config, {getCurrentLanguage} from "../containers/LanguageSwitcher/config";
import {TestDataContext} from "../app/framework/viz/charts/TestDataContext";
import {Router} from "react-router";
import {createMemoryHistory} from "history";
import {ProjectContext} from "../app/dashboards/projects/projectDashboard";


export const currentAppLocale = AppLocale[getCurrentLanguage(config.defaultLanguage || "english").locale];

function AppProviders({children}) {
  return (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
      {children}
    </IntlProvider>
  );
}

const data = {
  project: {settings: {customPhaseMapping: {backlog: "Define", open: "Open", wip: "Code", complete: "Ship", closed: "Closed"}}},
};

export function AppRouterProviders({children}) {
  let history = createMemoryHistory();
  return (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
      <Router history={history}>
        <ProjectContext.Provider value={data}>{children}</ProjectContext.Provider>
      </Router>
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
        <ProjectContext.Provider value={data}>
          <MockedProvider mocks={mocks} addTypename={false}>
            {children}
          </MockedProvider>
        </ProjectContext.Provider>
      </Router>
    </IntlProvider>
  );
}

function getContextProviders(contextValue) {
  return ({children}) => (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
    <ProjectContext.Provider value={data}>
      <TestDataContext.Provider value={contextValue}>{children}</TestDataContext.Provider>
    </ProjectContext.Provider>
    </IntlProvider>
  );
}

function getMockContextProviders(mocks, contextValue) {
  return ({children}) => (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
      <MockedProvider mocks={mocks} addTypename={false}>
      <ProjectContext.Provider value={data}>
        <TestDataContext.Provider value={contextValue}>{children}</TestDataContext.Provider>
      </ProjectContext.Provider>
      </MockedProvider>
    </IntlProvider>
  );
}

export {AppProviders, getAppProviders, getContextProviders, getMockContextProviders};

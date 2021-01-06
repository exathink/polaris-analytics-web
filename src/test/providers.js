import * as React from "react";
import {IntlProvider} from "react-intl";
import {MockedProvider} from "@apollo/client/testing";
import AppLocale from "../app/i18n";
import config, {getCurrentLanguage} from "../containers/LanguageSwitcher/config";
import {TestDataContext} from "../app/framework/viz/charts/TestDataContext";

export const currentAppLocale = AppLocale[getCurrentLanguage(config.defaultLanguage || "english").locale];

function AppProviders({children}) {
  return (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
      {children}
    </IntlProvider>
  );
}

// Higher order utility function to wrap with MockedProvider
// this will help in mocking api responses for widget components
function getAppProviders(mocks) {
  return ({children}) => (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
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

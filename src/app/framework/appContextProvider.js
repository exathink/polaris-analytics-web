/*
 * Copyright (c) Exathink, LLC  2016-2024.
 * All rights reserved
 *
 */

import React from 'react';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import {store} from "../../redux/store";
import AppHolder from "../../polarisFlowStyle";
import {themeConfig} from "../../config";
import config, {
  getCurrentLanguage
} from "../../containers/LanguageSwitcher/config";
import themes from "../../config/themes";

import {DefaultApolloProvider} from '../../app/services/graphql';
import {MockedProvider} from "@apollo/client/testing";

import AppLocale from "../i18n";
import {getContainerNode} from "../../app/helpers/utility";

const currentAppLocale =
  AppLocale[getCurrentLanguage(config.defaultLanguage || "english").locale];

// These are statically bound context providers. We can use these in tests.
function AppStaticContextProvider({children}) {
  return <ConfigProvider locale={currentAppLocale.antd} getPopupContainer={getContainerNode}>
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
    >
      <ThemeProvider theme={themes[themeConfig.theme]}>
        <Provider store={store}>
          <AppHolder>
            {children}
          </AppHolder>
        </Provider>
      </ThemeProvider>
    </IntlProvider>
  </ConfigProvider>;
}

// This is the top level context provider that needs mocking in tests.
export function AppContextProvider({ children }) {
  return (
    <DefaultApolloProvider>
      <AppStaticContextProvider>
        {children}
      </AppStaticContextProvider>
    </DefaultApolloProvider>
  );
}

export default AppContextProvider;
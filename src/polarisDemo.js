import React from 'react';
import { Provider } from 'react-redux';
import { store} from './redux/store';
import AllRoutes from './demo/router';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import themes from './config/themes';
import AppLocale from './app/i18n';
import config, {
  getCurrentLanguage
} from './containers/LanguageSwitcher/config';
import { themeConfig } from './config';
import AppHolder from './polarisFlowStyle';
import {DefaultApolloProvider} from "./app/services/graphql";
import {initGA} from "./app/ga";
import {getContainerNode} from "./app/helpers/utility";

const currentAppLocale =
  AppLocale[getCurrentLanguage(config.defaultLanguage || 'english').locale];

// Run the Google Analytics initialization
initGA();

const PolarisDemoApp = () => (
  <ConfigProvider locale={currentAppLocale.antd} getPopupContainer={getContainerNode}>
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
    >
      <ThemeProvider theme={themes[themeConfig.theme]}>
        <AppHolder>
          <DefaultApolloProvider>
            <Provider store={store}>
              <AllRoutes/>
            </Provider>
          </DefaultApolloProvider>
        </AppHolder>
      </ThemeProvider>
    </IntlProvider>
  </ConfigProvider>
);
export default PolarisDemoApp;
export { AppLocale };

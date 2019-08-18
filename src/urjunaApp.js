import React from 'react';
import { Provider } from 'react-redux';
import { store} from './redux/store';
import AllRoutes from './router';
import { ThemeProvider } from 'styled-components';
import { LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import themes from './config/themes';
import AppLocale from './app/i18n';
import config, {
  getCurrentLanguage
} from './containers/LanguageSwitcher/config';
import { themeConfig } from './config';
import AppHolder from './urjunaStyle';
import {DefaultApolloProvider} from "./app/services/graphql";

const currentAppLocale =
  AppLocale[getCurrentLanguage(config.defaultLanguage || 'english').locale];


const UrjunaApp = () => (
  <LocaleProvider locale={currentAppLocale.antd}>
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
  </LocaleProvider>
);
export default UrjunaApp;
export { AppLocale };

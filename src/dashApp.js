import React from 'react';
import { Provider } from 'react-redux';
import { store, history } from './redux/store';
import AllRoutes from './routes/router';
import { ThemeProvider } from 'styled-components';
import { LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import themes from './config/themes';
import AppLocale from './app/i18n';
import config, {
  getCurrentLanguage
} from './containers/LanguageSwitcher/config';
import { themeConfig } from './config';
import DashAppHolder from './dashAppStyle';
import {DefaultApolloProvider} from "./app/services/graphql";

const currentAppLocale =
  AppLocale[getCurrentLanguage(config.defaultLanguage || 'english').locale];


const DashApp = () => (
  <LocaleProvider locale={currentAppLocale.antd}>
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
    >
      <ThemeProvider theme={themes[themeConfig.theme]}>
        <DashAppHolder>
          <DefaultApolloProvider>
            <Provider store={store}>
              <AllRoutes history={history} />
            </Provider>
          </DefaultApolloProvider>
        </DashAppHolder>
      </ThemeProvider>
    </IntlProvider>
  </LocaleProvider>
);
export default DashApp;
export { AppLocale };

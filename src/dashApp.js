import React from 'react';
import { Provider } from 'react-redux';
import { store, history } from './redux/store';
import PublicRoutes from './routes/router';
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

// GraphQL Client Setup
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {GRAPHQL_ADMIN_URL} from "./config/url";

const currentAppLocale =
  AppLocale[getCurrentLanguage(config.defaultLanguage || 'english').locale];


const client = new ApolloClient({
  uri: GRAPHQL_ADMIN_URL,
  credentials: 'include'
});


const DashApp = () => (
  <LocaleProvider locale={currentAppLocale.antd}>
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
    >
      <ThemeProvider theme={themes[themeConfig.theme]}>
        <DashAppHolder>
          <ApolloProvider client={client}>
            <Provider store={store}>
              <PublicRoutes history={history} />
            </Provider>
          </ApolloProvider>
        </DashAppHolder>
      </ThemeProvider>
    </IntlProvider>
  </LocaleProvider>
);
export default DashApp;
export { AppLocale };

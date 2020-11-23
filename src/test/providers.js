import * as React from "react";
import {IntlProvider} from "react-intl";
import AppLocale from "../app/i18n";
import config, { getCurrentLanguage } from "../containers/LanguageSwitcher/config";

export const currentAppLocale = AppLocale[getCurrentLanguage(config.defaultLanguage || "english").locale];

function AppProviders({children}) {
  return (
    <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
      {children}
    </IntlProvider>
  );
}

export {AppProviders};

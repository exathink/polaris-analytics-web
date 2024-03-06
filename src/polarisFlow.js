import React from "react";
import AllRoutes from "./router";
import AppLocale from "./app/i18n";
import config, {getCurrentLanguage} from "./containers/LanguageSwitcher/config";
import {initGA} from "./app/ga";
import AppContextProvider from "./app/framework/appContextProvider";

const currentAppLocale =
  AppLocale[getCurrentLanguage(config.defaultLanguage || "english").locale];


// Run the Google Analytics initialization
initGA();

const PolarisFlowApp = () => (
  <AppContextProvider>
    <AllRoutes/>
  </AppContextProvider>
);
export default PolarisFlowApp;
export {AppLocale};

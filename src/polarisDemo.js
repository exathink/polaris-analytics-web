import React from "react";
import {IntlProvider} from "react-intl";
import AppLocale from "./app/i18n";
import config, {getCurrentLanguage} from "./containers/LanguageSwitcher/config";
import {initGA} from "./app/ga";
import {ProjectPipelineFunnelView} from "./app/dashboards/projects/shared/widgets/funnel/projectPipelineFunnelView";

const currentAppLocale = AppLocale[getCurrentLanguage(config.defaultLanguage || "english").locale];

// Run the Google Analytics initialization
initGA();

const workItemStateTypeCounts = {
  __typename: "StateTypeAggregateMeasure",
  backlog: 102,
  open: 20,
  wip: 50,
  complete: 40,
  closed: 30,
  unmapped: null,
};

const totalEffortByStateType = {
  __typename: "StateTypeAggregateMeasure",
  backlog: 5.58333333333333,
  open: null,
  wip: 13,
  complete: 2.91666666666667,
  closed: null,
  unmapped: null,
};

const PolarisDemoApp = () => (
  <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
    <div className="tw-container tw-mx-auto tw-flex tw-h-[400px]">
      <ProjectPipelineFunnelView
        context={{}}
        days={30}
        workItemStateTypeCounts={workItemStateTypeCounts}
        totalEffortByStateType={totalEffortByStateType}
        // workItemScope={workItemScope}
        // setWorkItemScope={setWorkItemScope}
        showVolumeOrEffort={"volume"}
        leadTimeTarget={30}
        cycleTimeTarget={7}
        view={"primary"}
        displayBag={{}}
      />
    </div>
  </IntlProvider>
);
export default PolarisDemoApp;
export {AppLocale};

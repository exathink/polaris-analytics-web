import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {Dashboard, DashboardRow} from "../../../framework/viz/dashboard";
import styles from "./dashboard.module.css";
import {MeasurementSettingsDashboard, ResponseTimeSLASettingsDashboard} from "../../shared/widgets/configure/settingWidgets";
import {ConfigSelector, CONFIG_TABS} from "../../shared/widgets/configure/configSelector/configSelector";

const dashboard_id = "dashboards.teams.configure";
export default withViewerContext(({viewerContext}) => {
  const [configTab, setConfigTab] = React.useState(CONFIG_TABS.MEASUREMENT_SETTINGS);

  return (
    <Dashboard dashboard={`${dashboard_id}`} gridLayout={true}>
      <DashboardRow
        h={"100%"}
        title={""}
        className={styles.configTab}
        controls={[() => <ConfigSelector dimension={"team"} configTab={configTab} setConfigTab={setConfigTab} settingsName={"Team Settings"}/>]}
        Team
      >
        {configTab === CONFIG_TABS.RESPONSE_TIME_SLA ? (
          <ResponseTimeSLASettingsDashboard dimension={"team"} />
        ) : configTab === CONFIG_TABS.MEASUREMENT_SETTINGS ? (
          <MeasurementSettingsDashboard dimension={"team"} />
        ) : null}
      </DashboardRow>
    </Dashboard>
  );
});

import React from "react";
import { ProjectDashboard, useProjectContext } from "../projectDashboard";
import { Dashboard, DashboardRow } from "../../../framework/viz/dashboard";
import styles from "./dashboard.module.css";

import {
  MeasurementSettingsDashboard,
  ResponseTimeSLASettingsDashboard
} from "../../shared/widgets/configure/projectSettingWidgets";

import { CONFIG_TABS, ConfigSelector } from "../../shared/widgets/configure/configSelector/configSelector";
import { ValueStreamMappingDashboard, ValueStreamMappingInitialDashboard } from "./valueStreamMapping/dashboard";
import { ValueStreamWorkStreamEditorDashboard } from "./valueStreams/dashboard";

const dashboard_id = "dashboards.project.configure";
ValueStreamMappingDashboard.videoConfig = {
  url: "https://vimeo.com/501974487/080d487fcf",
  title: "Configure Dashboard",
  VideoDescription: () => (
    <>
      <h2>Configure Dashboard</h2>
      <p> lorem ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    </>
  ),
};

const componentsMap = {
  [CONFIG_TABS.DELIVERY_PROCESS_MAPPING]: <ValueStreamMappingDashboard />,
  [CONFIG_TABS.VALUE_STREAMS]: <ValueStreamWorkStreamEditorDashboard />,
  [CONFIG_TABS.TIMEBOX_SETTINGS]: <ResponseTimeSLASettingsDashboard dimension={"project"} />,
  [CONFIG_TABS.MEASUREMENT_SETTINGS]: <MeasurementSettingsDashboard dimension={"project"} />,
};

function ConfigDashboard() {
  const {
    project: {mappedWorkStreamCount},
  } = useProjectContext();

  const [configTab, setConfigTab] = React.useState(CONFIG_TABS.DELIVERY_PROCESS_MAPPING);

  const isValueStreamMappingNotDone = mappedWorkStreamCount === 0;
  if (isValueStreamMappingNotDone) {
    return <ValueStreamMappingInitialDashboard />;
  }

  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      dashboardVideoConfig={ValueStreamMappingDashboard.videoConfig}
      gridLayout={true}
    >
      <DashboardRow
        h={"100%"}
        title={""}
        className={styles.configTab}
        controls={[
          () => (
            <ConfigSelector
              dimension={"project"}
              configTab={configTab}
              setConfigTab={setConfigTab}
              settingsName={"General Settings"}
            />
          ),
        ]}
      >
        {componentsMap[configTab] ?? null}
      </DashboardRow>
    </Dashboard>
  );
}

const dashboard = (({viewerContext}) => (
  <ProjectDashboard>
    <ConfigDashboard />
  </ProjectDashboard>
));

export default dashboard;
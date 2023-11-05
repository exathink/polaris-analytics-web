import React from "react";
import { ProjectDashboard, useProjectContext } from "../projectDashboard";
import { Dashboard, DashboardRow, DashboardWidget } from "../../../framework/viz/dashboard";

import { ProjectPipelineFunnelWidget } from "../shared/widgets/funnel";
import { WorkItemStateTypeMapWidget } from "../shared/widgets/workItemStateTypeMap";
import styles from "./dashboard.module.css";
import fontStyles from "../../../framework/styles/fonts.module.css";
import classNames from "classnames";

import {
  MeasurementSettingsDashboard,
  ResponseTimeSLASettingsDashboard
} from "../../shared/widgets/configure/projectSettingWidgets";

import { CONFIG_TABS, ConfigSelector } from "../../shared/widgets/configure/configSelector/configSelector";

import {
  PipelineFunnelWidgetInitialInfoConfig
} from "../../../components/misc/info/infoContent/pipelineFunnelWidget/infoConfig";
import {
  DeliveryProcessMappingInitialInfoConfig
} from "../../../components/misc/info/infoContent/deliveryProcessMapping/infoConfig";
import { ValueStreamMappingDashboard } from "./valueStreamMapping/dashboard";
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

export function ValueStreamMappingInitialDashboard() {
  const {project: {key, settingsWithDefaults}, context} = useProjectContext();

  return (
    <Dashboard
      dashboardVideoConfig={ValueStreamMappingDashboard.videoConfig}
      gridLayout={true}
      className="tw-grid tw-grid-cols-[40%_60%] tw-grid-rows-[auto_1fr_1fr_1fr_1fr_1fr] tw-gap-x-2"
    >
      <DashboardRow>
        <DashboardWidget
          className="tw-col-span-2 tw-col-start-1 tw-row-start-1"
          render={() => (
            <div className="tw-flex tw-flex-col tw-items-center tw-bg-white tw-p-2">
              <div className="tw-flex tw-flex-col tw-items-center" id="state-type-mapping">
                <div className={classNames(fontStyles["text-lg"], fontStyles["font-normal"])}>
                  Let's set up the value stream mapping for this value stream.
                </div>
                <div className={classNames(fontStyles["text-xs"], fontStyles["font-normal"])}>
                  <em>Click on the info icon for more guidance.</em>
                </div>
              </div>
            </div>
          )}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          className="tw-col-start-1 tw-row-span-4 tw-row-start-2"
          name="project-pipeline-detailed"
          infoConfig={PipelineFunnelWidgetInitialInfoConfig}
          render={({view}) => (
            <ProjectPipelineFunnelWidget
              instanceKey={key}
              context={context}
              workItemScope={"all"}
              days={30}
              view={view}
              includeSubTasks={{
                includeSubTasksInClosedState: settingsWithDefaults.includeSubTasksFlowMetrics,
                includeSubTasksInNonClosedState: settingsWithDefaults.includeSubTasksWipInspector,
              }}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          className="tw-col-start-2 tw-row-span-5 tw-row-start-2"
          infoConfig={DeliveryProcessMappingInitialInfoConfig}
          name="workitem-statetype-map"
          render={({view}) => {
            return (
              <WorkItemStateTypeMapWidget
                instanceKey={key}
                context={context}
                days={30}
                view={view}
                showMeLinkVisible={true}
              />
            );
          }}
        />
      </DashboardRow>
    </Dashboard>
  );
}

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
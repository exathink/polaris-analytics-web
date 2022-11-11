import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";

import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel";
import {WorkItemStateTypeMapWidget} from "../shared/widgets/workItemStateTypeMap";
import styles from "./dashboard.module.css";
import fontStyles from "../../../framework/styles/fonts.module.css";
import classNames from "classnames";

import {
  MeasurementSettingsDashboard,
  ResponseTimeSLASettingsDashboard,
} from "../../shared/widgets/configure/settingWidgets";

import {CONFIG_TABS, ConfigSelector} from "../../shared/widgets/configure/configSelector/configSelector";

import {PipelineFunnelWidgetInitialInfoConfig} from "../../../components/misc/info/infoContent/pipelineFunnelWidget/infoConfig";
import {DeliveryProcessMappingInitialInfoConfig} from "../../../components/misc/info/infoContent/deliveryProcessMapping/infoConfig";

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


  return (
    <ProjectDashboard
      render={({project: {key, settingsWithDefaults}, context}) => {
        return (

          <Dashboard dashboardVideoConfig={ValueStreamMappingDashboard.videoConfig}>
            <DashboardRow h={"10%"}>
              <DashboardWidget
                w={0.96}
                render={() => (
                  <div className={styles.stateTypeMappingWrapper}>
                    <div className={styles.stateTypeTitleWrapper} id="state-type-mapping">
                      <div className={classNames(fontStyles["text-lg"], fontStyles["font-normal"], styles.title1)}>
                        Configure the delivery process mapping for this value stream
                      </div>
                      <div className={classNames(fontStyles["text-xs"], fontStyles["font-normal"])}>
                        <em>
                          Click on the info icon for more guidance.
                        </em>
                      </div>
                    </div>
                  </div>
                )}
              />
            </DashboardRow>
            <DashboardRow h={"65%"} title={" "}>
              <DashboardWidget
                w={0.35}
                name="project-pipeline-detailed"
                title={" "}
                infoConfig={PipelineFunnelWidgetInitialInfoConfig}
                render={({ view }) => (
                  <ProjectPipelineFunnelWidget
                    instanceKey={key}
                    context={context}
                    workItemScope={"all"}
                    days={30}
                    view={view}
                    includeSubTasks={{
                      includeSubTasksInClosedState: settingsWithDefaults.includeSubTasksFlowMetrics,
                      includeSubTasksInNonClosedState: settingsWithDefaults.includeSubTasksWipInspector
                    }}
                  />
                )}
                showDetail={false}
              />
              <DashboardWidget
                w={0.6}
                title={" "}
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
      }}
    />
  );
}

export function ValueStreamMappingDashboard() {
  return (
    <ProjectDashboard
      render={({project: {key, settingsWithDefaults}, context}) => {
        return (
          <Dashboard dashboardVideoConfig={ValueStreamMappingDashboard.videoConfig} gridLayout={true} className="tw-grid tw-grid-cols-[40%_60%] tw-grid-rows-4 tw-gap-2">
            <DashboardRow title={" "}>
              <DashboardWidget
                className="tw-row-start-2 tw-row-end-4"
                name="project-pipeline-detailed"
                title={" "}
                infoConfig={ProjectPipelineFunnelWidget.infoConfig}
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
                className="tw-row-start-1 tw-col-start-2 tw-row-span-4"
                title={" "}
                infoConfig={WorkItemStateTypeMapWidget.infoConfig}
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
      }}
    />
  );
}


export default withViewerContext(({viewerContext}) => {
  const [configTab, setConfigTab] = React.useState(CONFIG_TABS.VALUE_STREAM);

  return (
    <ProjectDashboard
      render={({project: {key, mappedWorkStreamCount}}) => {
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
                () => <ConfigSelector dimension={"project"} configTab={configTab} setConfigTab={setConfigTab} />,
              ]}
            >
              {configTab === CONFIG_TABS.VALUE_STREAM ? (
                <ValueStreamMappingDashboard />
              ) : configTab === CONFIG_TABS.RESPONSE_TIME_SLA ? (
                <ResponseTimeSLASettingsDashboard dimension={"project"} />
              ) : configTab === CONFIG_TABS.MEASUREMENT_SETTINGS ? (
                <MeasurementSettingsDashboard dimension={"project"} />
              ) : null}

            </DashboardRow>
          </Dashboard>
        );
      }}
    />
  );
});

import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {CONFIG_TABS, ConfigSelector} from "./configSelector/configSelector";
import {ProjectResponseTimeSLASettingsWidget} from "./projectResponseTimeSLASettings";
import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel";
import {WorkItemStateTypeMapWidget} from "../shared/widgets/workItemStateTypeMap";
import {ProjectAnalysisPeriodsWidget} from "./projectAnalysisPeriods/projectAnalysisPeriodsWidget";
import {MeasurementSettingsWidget} from "./measurementSettings/measurementSettingsWidget";
import styles from "./dashboard.module.css";
import fontStyles from "../../../framework/styles/fonts.module.css";
import classNames from "classnames";
import dashboardItemStyles from "../../../framework/viz/dashboard/dashboardItem.module.css";

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
                          Click on the info icons for more guidance.
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
                w={0.6}
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

export function ValueStreamMappingDashboard() {
  return (
    <ProjectDashboard
      render={({project: {key, settingsWithDefaults}, context}) => {
        return (
          <Dashboard dashboardVideoConfig={ValueStreamMappingDashboard.videoConfig}>
            <DashboardRow h={"10%"} />
            <DashboardRow h={"65%"} title={" "}>
              <DashboardWidget
                w={0.35}
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
                w={0.6}
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
            <DashboardRow h={"15%"} />
          </Dashboard>
        );
      }}
    />
  );
}

export function ResponseTimeSLASettingsDashboard() {
  return (
    <ProjectDashboard
      render={({project: {key, settingsWithDefaults}, context}) => {
        const {
          leadTimeTarget,
          cycleTimeTarget,
          leadTimeConfidenceTarget,
          cycleTimeConfidenceTarget,
        } = settingsWithDefaults;
        return (
          <Dashboard>
            <DashboardRow h="94%">
              <DashboardWidget
                w={1}
                name="flow-metrics-setting-widget"
                className={dashboardItemStyles.dashboardItem}
                render={({view}) => {
                  return (
                    <ProjectResponseTimeSLASettingsWidget
                      dimension={"project"}
                      instanceKey={key}
                      view={view}
                      context={context}
                      days={90}
                      leadTimeTarget={leadTimeTarget}
                      cycleTimeTarget={cycleTimeTarget}
                      leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                      cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                      specsOnly={false}
                    />
                  );
                }}
                showDetail={false}
              />
            </DashboardRow>
          </Dashboard>
        );
      }}
    />
  );
}

export function MeasurementSettingsDashboard() {
  return (
    <ProjectDashboard
      render={({project: {key, settingsWithDefaults}, context}) => {
        const {
          includeSubTasksFlowMetrics,
          includeSubTasksWipInspector,
          wipAnalysisPeriod,
          flowAnalysisPeriod,
          trendsAnalysisPeriod,
        } = settingsWithDefaults;
        return (
          <Dashboard gridLayout={true} className={styles.measurementSettingsDashboard}>
            <DashboardRow>
              <DashboardWidget
                w={1}
                name="analysis-periods-widget"
                className={classNames(dashboardItemStyles.dashboardItem, styles.analysisPeriodsWidget)}
                render={({view}) => {
                  return (
                    <ProjectAnalysisPeriodsWidget
                      instanceKey={key}
                      wipAnalysisPeriod={wipAnalysisPeriod}
                      flowAnalysisPeriod={flowAnalysisPeriod}
                      trendsAnalysisPeriod={trendsAnalysisPeriod}
                    />
                  );
                }}
                showDetail={false}
              />
              <DashboardWidget
                w={1}
                name="measurement-settings-widget"
                className={classNames(dashboardItemStyles.dashboardItem, styles.settingsWidget)}
                render={({view}) => {
                  return (
                    <MeasurementSettingsWidget
                      instanceKey={key}
                      includeSubTasksFlowMetrics={includeSubTasksFlowMetrics}
                      includeSubTasksWipInspector={includeSubTasksWipInspector}
                    />
                  );
                }}
                showDetail={false}
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
          return <ValueStreamMappingInitialDashboard />
        }

        return (
          <Dashboard dashboard={`${dashboard_id}`} dashboardVideoConfig={ValueStreamMappingDashboard.videoConfig} gridLayout={true}>
            <DashboardRow
              h={"100%"}
              title={""}
              className={styles.configTab}
              controls={[() => <ConfigSelector configTab={configTab} setConfigTab={setConfigTab} />]}
            >
              {configTab === CONFIG_TABS.VALUE_STREAM ? (
                <ValueStreamMappingDashboard />
              ) : configTab === CONFIG_TABS.MEASUREMENT_SETTINGS ? (
                <MeasurementSettingsDashboard />
              ): configTab === CONFIG_TABS.RESPONSE_TIME_SLA ? (
                <ResponseTimeSLASettingsDashboard />
              )  : null}
            </DashboardRow>
          </Dashboard>
        );
      }}
    />
  );
});


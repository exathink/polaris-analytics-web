import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ConfigSelector, CONFIG_TABS} from "./configSelector/configSelector";
import {ProjectResponseTimeSLASettingsWidget} from "./projectResponseTimeSLASettings";
import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel";
import {WorkItemStateTypeMapWidget} from "../shared/widgets/workItemStateTypeMap";
import {ProjectAnalysisPeriodsWidget} from "./projectAnalysisPeriods/projectAnalysisPeriodsWidget";
import {MeasurementSettingsWidget} from "./measurementSettings/measurementSettingsWidget";
import {Button} from "antd";
import styles from "./dashboard.module.css";
import fontStyles from "../../../framework/styles/fonts.module.css";
import classNames from "classnames";
import {InfoWithDrawer} from "../../shared/components/infoDrawer/infoDrawerUtils";
import {StateMappingInfoContent} from "./stateMappingInfoContent";
import dashboardItemStyles from "../../../framework/viz/dashboard/dashboardItem.module.css";
import {TeamDashboard} from "../../teams/teamDashboard";

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

const componentMap = {
  team: TeamDashboard,
  project: ProjectDashboard
}

export function ValueStreamMappingInitialDashboard() {
  const [showPanel, setShowPanel] = React.useState(false);

  return (
    <ProjectDashboard
      render={({project: {key, settingsWithDefaults}, context}) => {
        return (
          <div className={styles.stateTypeMappingWrapper}>
            <div className={styles.stateTypeTitleWrapper} id="state-type-mapping">
              <div className= {classNames(fontStyles["text-lg"],fontStyles["font-medium"], styles.title1)}>Configure your Value Stream Phase Mapping</div>
              <div className= {classNames(fontStyles["text-base"], styles.title2)}>Map states in your workflow to phases in Polaris</div>
              <Button type="link" className={styles.showMeButton} onClick={() => setShowPanel(!showPanel)}>Show me how</Button>
              <InfoWithDrawer
                showPanel={showPanel}
                setShowPanel={setShowPanel}
                drawerOptions={{getContainer: () => document.getElementById("state-type-mapping")}}
              >
                <StateMappingInfoContent />
              </InfoWithDrawer>
            </div>
            <DashboardWidget
              w={2 / 3}
              name="workitem-statetype-map"
              className={styles.stateTypeMappingWidget}
              render={({view}) => {
                return <WorkItemStateTypeMapWidget instanceKey={key} context={context} days={30} view={view} showMeLinkVisible={false} />;
              }}
            />
          </div>
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
          <DashboardRow h={"50%"} title={" "}>
            <DashboardWidget
              w={1 / 3}
              name="project-pipeline-detailed"
              render={({view}) => (
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
              w={2 / 3}
              name="workitem-statetype-map"
              render={({view}) => {
                return <WorkItemStateTypeMapWidget instanceKey={key} context={context} days={30} view={view} showMeLinkVisible={true}/>;
              }}
            />
          </DashboardRow>
        </Dashboard>
        )
      }}
    />
  );
}

export function ResponseTimeSLASettingsDashboard({dimension}) {
  const Component = componentMap[dimension];
  return (
    <Component
      render={({[dimension]: {key, settingsWithDefaults}, context}) => {
        const {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget} = settingsWithDefaults;
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
                    dimension={dimension}
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

export function MeasurementSettingsDashboard({dimension}) {
  const Component = componentMap[dimension];
  return (
    <Component
      render={({[dimension]: {key, settingsWithDefaults}, context}) => {
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
                      dimension={dimension}
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
                      dimension={dimension}
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

export default withViewerContext(({dimension="project", viewerContext}) => {
  const [configTab, setConfigTab] = React.useState(
    dimension === "project" ? CONFIG_TABS.VALUE_STREAM : CONFIG_TABS.RESPONSE_TIME_SLA
  );

  function getDashboardElement() {
    return (
      <Dashboard dashboard={`${dashboard_id}`} dashboardVideoConfig={ValueStreamMappingDashboard.videoConfig} gridLayout={true}>
        <DashboardRow
          h={"100%"}
          title={""}
          className={styles.configTab}
          controls={[() => <ConfigSelector dimension={dimension} configTab={configTab} setConfigTab={setConfigTab} />]}
        >
          {configTab === CONFIG_TABS.VALUE_STREAM && dimension === "project" ? (
            <ValueStreamMappingDashboard />
          ) : configTab === CONFIG_TABS.RESPONSE_TIME_SLA ? (
            <ResponseTimeSLASettingsDashboard dimension={dimension}/>
          ) : configTab === CONFIG_TABS.MEASUREMENT_SETTINGS ? (
            <MeasurementSettingsDashboard dimension={dimension}/>
          ) : null}
        </DashboardRow>
      </Dashboard>
    );
  }
  if (dimension === "project") {
    return (
      <ProjectDashboard
        render={({project: {key, mappedWorkStreamCount}}) => {
          const isValueStreamMappingNotDone = mappedWorkStreamCount === 0;
          if (isValueStreamMappingNotDone) {
            return <ValueStreamMappingInitialDashboard />;
          }

          return getDashboardElement();
        }}
      />
    );
  } else if (dimension === "team") {
    return getDashboardElement();
  } else {
    return null;
  }
});


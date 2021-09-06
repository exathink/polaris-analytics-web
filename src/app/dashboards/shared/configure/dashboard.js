import React from "react";
import {ProjectDashboard} from "../../projects/projectDashboard";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ProjectResponseTimeSLASettingsWidget} from "./projectResponseTimeSLASettings";
import {ProjectAnalysisPeriodsWidget} from "./projectAnalysisPeriods/projectAnalysisPeriodsWidget";
import {MeasurementSettingsWidget} from "./measurementSettings/measurementSettingsWidget";
import styles from "./dashboard.module.css";
import classNames from "classnames";
import dashboardItemStyles from "../../../framework/viz/dashboard/dashboardItem.module.css";
import {TeamDashboard} from "../../teams/teamDashboard";

const componentMap = {
  team: TeamDashboard,
  project: ProjectDashboard,
};

export function ResponseTimeSLASettingsDashboard({dimension}) {
  const Component = componentMap[dimension];
  return (
    <Component
      render={({[dimension]: {key, settingsWithDefaults}, context}) => {
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

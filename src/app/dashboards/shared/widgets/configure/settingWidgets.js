import React from "react";
import {ProjectDashboard} from "../../../projects/projectDashboard";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectResponseTimeSLASettingsWidget} from "./projectResponseTimeSLASettings";
import {ProjectAnalysisPeriodsWidget} from "./projectAnalysisPeriods/projectAnalysisPeriodsWidget";
import {MeasurementSettingsWidget} from "./measurementSettings/measurementSettingsWidget";
import {TeamDashboard} from "../../../teams/teamDashboard";

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
                className="tw-bg-white"
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
      render={({[dimension]: {key, name, settingsWithDefaults}, context}) => {
        const {
          includeSubTasksFlowMetrics,
          includeSubTasksWipInspector,
          wipAnalysisPeriod,
          flowAnalysisPeriod,
          trendsAnalysisPeriod,
        } = settingsWithDefaults;
        return (
          <Dashboard gridLayout={true} className="tw-grid tw-grid-cols-2 tw-gap-1">
            <DashboardRow>
              <DashboardWidget
                w={1}
                name="analysis-periods-widget"
                className="tw-bg-white tw-p-4"
                render={({view}) => {
                  return (
                    <ProjectAnalysisPeriodsWidget
                      instanceKey={key}
                      dimension={dimension}
                      name={name}
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
                className="tw-bg-white tw-p-4"
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

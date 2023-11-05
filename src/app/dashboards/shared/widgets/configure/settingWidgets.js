import React from "react";
import {ProjectDashboard} from "../../../projects/projectDashboard";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectResponseTimeSLASettingsWidget} from "./projectResponseTimeSLASettings";
import {ProjectAnalysisPeriodsWidget} from "./projectAnalysisPeriods/projectAnalysisPeriodsWidget";
import {MeasurementSettingsWidget} from "./measurementSettings/measurementSettingsWidget";
import {TeamDashboard} from "../../../teams/teamDashboard";
import { ReleaseSettingsWidget } from "./measurementSettings/releaseSettingsWidget";

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
          flowAnalysisPeriod
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
                      days={flowAnalysisPeriod}
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
          enableReleases
        } = settingsWithDefaults;
        return (
          <Dashboard gridLayout={true} className="tw-grid tw-grid-cols-2 tw-grid-rows-2 tw-gap-1">
            <DashboardRow>
              <DashboardWidget
                w={1}
                name="analysis-periods-widget"
                className="tw-bg-white tw-p-4 tw-row-span-2"
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
                className={dimension==="project" ? "tw-bg-white tw-p-4" : "tw-bg-white tw-p-4 tw-row-span-2"}
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
              {dimension==="project" && <DashboardWidget
                w={1}
                name="releases-settings-widget"
                className="tw-bg-white tw-p-4 tw-col-start-2 tw-row-start-2"
                render={({view}) => {
                  return (
                    <ReleaseSettingsWidget 
                      instanceKey={key}
                      dimension={dimension}
                      releaseSettingFlag={enableReleases}
                    />
                  );
                }}
                showDetail={false}
              />}
            </DashboardRow>
          </Dashboard>
        );
      }}
    />
  );
}

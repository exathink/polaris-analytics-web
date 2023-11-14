import React, { useState } from "react";
import {useProjectContext} from "../../../projects/projectDashboard";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {DimensionStabilityGoalsSettingsWidget} from "./projectStabilityGoalsSettings";
import {ProjectAnalysisPeriodsWidget} from "./projectAnalysisPeriods/projectAnalysisPeriodsWidget";
import {MeasurementSettingsWidget} from "./measurementSettings/measurementSettingsWidget";
import {ReleaseSettingsWidget} from "./measurementSettings/releaseSettingsWidget";
import { StabilityGoalWidget } from "../../../projects/shared/widgets/flowMetricsTrends/stabilityGoalWidget";
import { useQueryParamState } from "../../../projects/shared/helper/hooks";
import { DetailViewTooltipTypes } from "../../../../framework/viz/dashboard/dashboardWidget";
import { METRICS } from "./projectStabilityGoalsSettings/constants";

export function ProjectStabilityGoalsSettingsDashboard() {
  const dimension='project';

  const {
    project: {key, settingsWithDefaults},
    context,
  } = useProjectContext();
  const {
    flowAnalysisPeriod,
    trendsAnalysisPeriod,
    includeSubTasksFlowMetrics,
    includeSubTasksWipInspector,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    cycleTimeTarget,
    leadTimeTarget,
    latencyTarget,
    wipLimit,
  } = settingsWithDefaults;

  const [metric, setSelectedMetric] = useState(METRICS.CYCLE_TIME)
  const {state} = useQueryParamState();
  const workItemSelectors = state?.vs?.workItemSelectors??[];
  const release = state?.release?.releaseValue;

  return (
    <Dashboard>
      <DashboardRow h="11%">
        <DashboardWidget
          w={1}
          name="stability-goal-widget"
          className="tw-bg-white"
          render={({view}) => {
            return (
              <StabilityGoalWidget
                dimension={dimension}
                instanceKey={key}
                view={view}
                context={context}
                metric={metric}
                days={flowAnalysisPeriod}
                measurementWindow={flowAnalysisPeriod}
                samplingFrequency={flowAnalysisPeriod}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                targetPercentile={cycleTimeConfidenceTarget}
                specsOnly={false}
                includeSubTasks={includeSubTasksFlowMetrics}
                tags={workItemSelectors}
                release={release}
              />
            );
          }}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h="89%">
        <DashboardWidget
          w={1}
          name="flow-metrics-setting-widget"
          className="tw-bg-white"
          render={({view}) => {
            return (
              <DimensionStabilityGoalsSettingsWidget
                dimension={dimension}
                instanceKey={key}
                view={view}
                context={context}
                days={settingsWithDefaults.flowAnalysisPeriod}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                specsOnly={false}
                initialMetric={metric}
                setSelectedMetric={setSelectedMetric}
              />
            );
          }}
          showDetail={true}
          showDetailTooltipType={DetailViewTooltipTypes.FOCUS_VIEW}
        />
      </DashboardRow>
    </Dashboard>
  );
}

export function MeasurementSettingsDashboard({dimension}) {
  const {
    project: {key, name, settingsWithDefaults},
  } = useProjectContext();

  const {
    includeSubTasksFlowMetrics,
    includeSubTasksWipInspector,
    wipAnalysisPeriod,
    flowAnalysisPeriod,
    trendsAnalysisPeriod,
    enableReleases,
  } = settingsWithDefaults;

  return (
    <Dashboard gridLayout={true} className="tw-grid tw-grid-cols-2 tw-grid-rows-2 tw-gap-1">
      <DashboardRow>
        <DashboardWidget
          w={1}
          name="analysis-periods-widget"
          className="tw-row-span-2 tw-bg-white tw-p-4"
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
          className={dimension === "project" ? "tw-bg-white tw-p-4" : "tw-row-span-2 tw-bg-white tw-p-4"}
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
        {dimension === "project" && (
          <DashboardWidget
            w={1}
            name="releases-settings-widget"
            className="tw-col-start-2 tw-row-start-2 tw-bg-white tw-p-4"
            render={({view}) => {
              return (
                <ReleaseSettingsWidget instanceKey={key} dimension={dimension} releaseSettingFlag={enableReleases} />
              );
            }}
            showDetail={false}
          />
        )}
      </DashboardRow>
    </Dashboard>
  );
}

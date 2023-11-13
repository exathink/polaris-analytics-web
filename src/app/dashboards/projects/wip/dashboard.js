import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {AppTerms, WorkItemStateTypes} from "../../shared/config";

import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {ProjectDashboard, useCustomPhaseMapping, useProjectContext} from "../projectDashboard";
import {DimensionPipelineCycleTimeLatencyWidget} from "../../shared/widgets/work_items/wip";

import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector/workItemScopeSelector";

import {DimensionWipSummaryWidget} from "../../shared/widgets/work_items/wip/cycleTimeLatency/dimensionWipSummaryWidget";
import { getReferenceString, percentileToText, useFeatureFlag } from "../../../helpers/utility";
import {GroupingSelector} from "../../shared/components/groupingSelector/groupingSelector";

import {AGE_LATENCY_ENHANCEMENTS} from "../../../../config/featureFlags";
import {useQueryParamState} from "../shared/helper/hooks";
import {useLocalStorage} from "../../../helpers/hooksUtil";
import {FlowMetricsTrendsWidget} from "../shared/widgets/flowMetricsTrends/flowMetricsTrendsWidget";
import classNames from "classnames";
import fontStyles from "../../../framework/styles/fonts.module.css";
import {WIP_CHART_TYPE} from "../../../helpers/localStorageUtils";
import { Checkbox } from "antd";
import { FILTERS, getFilterValue } from "../../shared/widgets/work_items/wip/cycleTimeLatency/cycleTimeLatencyUtils";
import { ProjectTraceabilityTrendsWidget } from "../../shared/widgets/commits/traceability";
import { DetailViewTooltipTypes } from "../../../framework/viz/dashboard/dashboardWidget";

const dashboard_id = "dashboards.activity.projects.newDashboard.instance";

WipDashboard.videoConfig = {
  url: "https://vimeo.com/501974487/080d487fcf",
  title: "WIP Dashboard",
  VideoDescription: () => (
    <>
      <h2>Wip Dashboard</h2>
      <p> lorem ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    </>
  ),
};

function WipDashboard({
  context,
  viewerContext,
}) {

  const {key, latestWorkItemEvent, latestCommit, settingsWithDefaults} = useProjectContext((result) => result.project);

  const [workItemScope, setWorkItemScope] = useState("all");
  const customPhaseMapping = useCustomPhaseMapping();

  const [wip_chart_type_localstorage, setValueToLocalStorage] = useLocalStorage(WIP_CHART_TYPE);
  const [wipChartType, setWipChartType] = useState(wip_chart_type_localstorage || "queue");
  const specsOnly = workItemScope === "specs";

  const updateWipChartType = (value) => {
    setValueToLocalStorage(value);
    setWipChartType(value);
  }

  const ageLatencyFeatureFlag = useFeatureFlag(AGE_LATENCY_ENHANCEMENTS, true);
  const {state} = useQueryParamState();
  const workItemSelectors = state?.vs?.workItemSelectors??[];
  const release = state?.release?.releaseValue;

  // maintain all filters state over here
  const [appliedFilters, setAppliedFilters] = React.useState(new Map([[FILTERS.EXCLUDE_ABANDONED, {value: [true]}]]));
  const [excludeMotionless] = getFilterValue(appliedFilters, FILTERS.EXCLUDE_ABANDONED);

  const {
    cycleTimeTarget,
    leadTimeTarget,
    responseTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    flowAnalysisPeriod,
    includeSubTasksWipInspector,
    latencyTarget,
    trendsAnalysisPeriod,
  } = settingsWithDefaults;

  const DIMENSION = "project";

  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      dashboardVideoConfig={WipDashboard.videoConfig}
      className="tw-grid tw-grid-cols-6 tw-grid-rows-[8%_auto_97%] tw-gap-x-2 tw-gap-y-1 tw-p-2"
      gridLayout={true}
    >
      <div className="tw-col-span-2 tw-col-start-1 tw-row-start-1 tw-flex tw-items-center tw-gap-8 tw-text-2xl tw-text-gray-300">
        <div className="tw-flex tw-justify-start">
          {specsOnly ? `All ${AppTerms.specs.display} in Process` : `All ${AppTerms.cards.display} in Process`}
        </div>

        <div className="tw-self-center tw-text-gray-300">
          <Checkbox
            onChange={(e) => {
              // setExclude(e.target.checked);
              if (e.target.checked) {
                setAppliedFilters((prev) => new Map(prev.set(FILTERS.EXCLUDE_ABANDONED, {value: [e.target.checked]})));
              } else {
                setAppliedFilters((prev) => {
                  prev.delete(FILTERS.EXCLUDE_ABANDONED);
                  return new Map(prev);
                });
              }
            }}
            name="state-exclude"
            checked={excludeMotionless}
            style={{alignItems: "center"}}
          >
            <div className="tw-flex tw-flex-col tw-justify-center tw-leading-4">
              <div>Exclude</div>
              <div>Motionless</div>
            </div>
          </Checkbox>
        </div>
      </div>

      <div className="tw-col-span-2 tw-col-start-3 tw-row-start-1 tw-flex tw-flex-col tw-items-center tw-text-2xl tw-text-gray-300">
        <div className="tw-flex tw-justify-start">Stability Goal</div>
        <div className="tw-flex tw-justify-start tw-text-base">{`${percentileToText(cycleTimeConfidenceTarget)} cycle time <= ${cycleTimeTarget} Days`}</div>
      </div>
      <div className="tw-col-span-2 tw-col-start-5 tw-row-start-1 tw-mr-2 tw-flex tw-items-baseline tw-justify-end tw-gap-8 tw-text-base">
        <GroupingSelector
          label="Show"
          value={wipChartType}
          onGroupingChanged={updateWipChartType}
          groupings={[
            {
              key: "queue",
              display: "Queueing",
            },
            {
              key: "age",
              display: "Aging",
            },
            {
              key: "motion",
              display: "Motion",
            },


          ]}
          layout="col"
        />
        <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} layout="col" />
      </div>
      <DashboardRow title={" "}>
        <DashboardWidget
          name="engineering"
          className="tw-col-span-3 tw-col-start-1 tw-row-start-3"
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              queryVars={{
                dimension: DIMENSION,
                key,
                tags: workItemSelectors,
                release: release,
                specsOnly,
                activeOnly: true,
                includeSubTasks: includeSubTasksWipInspector,
                latestWorkItemEvent,
                latestCommit,
              }}
              stageName={customPhaseMapping.wip}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              stateTypes={[WorkItemStateTypes.open, WorkItemStateTypes.make]}
              groupByState={true}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              tooltipType="small"
              view={view}
              context={context}
              displayBag={{
                displayType: "FlowEfficiencyCard",
                wipChartType,
                setWipChartType: updateWipChartType,
                appliedFilters,
                setAppliedFilters,
                excludeMotionless: Boolean(excludeMotionless),
                customPhaseMapping,
              }}
            />
          )}
          showDetail={true}
          showDetailTooltipType={DetailViewTooltipTypes.TABULAR_DETAILS_VIEW}
        />

        <DashboardWidget
          name="delivery"
          className="tw-col-span-3 tw-col-start-4 tw-row-start-3"
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              queryVars={{
                dimension: DIMENSION,
                key,
                tags: workItemSelectors,
                release: release,
                specsOnly,
                activeOnly: true,
                includeSubTasks: includeSubTasksWipInspector,
                latestWorkItemEvent,
                latestCommit,
              }}
              stageName={customPhaseMapping.complete}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              stateTypes={[WorkItemStateTypes.deliver]}
              groupByState={true}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              tooltipType="small"
              view={view}
              context={context}
              displayBag={{
                displayType: "FlowEfficiencyCard",
                wipChartType,
                setWipChartType: updateWipChartType,
                appliedFilters,
                setAppliedFilters,
                excludeMotionless: Boolean(excludeMotionless),
                customPhaseMapping,
              }}
            />
          )}
          showDetail={true}
          showDetailTooltipType={DetailViewTooltipTypes.TABULAR_DETAILS_VIEW}
        />
      </DashboardRow>
    </Dashboard>
  );
}
export const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60}>
    <WipDashboard viewerContext={viewerContext} />
  </ProjectDashboard>
);
export default withViewerContext(dashboard);

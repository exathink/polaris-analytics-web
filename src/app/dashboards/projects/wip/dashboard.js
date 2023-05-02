import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {AppTerms, WorkItemStateTypes} from "../../shared/config";

import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {ProjectDashboard} from "../projectDashboard";
import {DimensionPipelineCycleTimeLatencyWidget} from "../../shared/widgets/work_items/wip";

import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector/workItemScopeSelector";

import {DimensionWipFlowMetricsWidget} from "../../shared/widgets/work_items/wip/flowMetrics/dimensionWipMetricsWidget";
import {DimensionWipWidget} from "../../shared/widgets/work_items/wip/cycleTimeLatency/dimensionWipWidget";
import {DimensionWipSummaryWidget} from "../../shared/widgets/work_items/wip/cycleTimeLatency/dimensionWipSummaryWidget";
import {getReferenceString, useFeatureFlag} from "../../../helpers/utility";
import {GroupingSelector} from "../../shared/components/groupingSelector/groupingSelector";

import { AGE_LATENCY_ENHANCEMENTS } from "../../../../config/featureFlags";
import {useQueryParamState} from "../shared/helper/hooks";
import {useLocalStorage} from "../../../helpers/hooksUtil";

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
  project: {key, latestWorkItemEvent, latestCommit, latestPullRequestEvent, settings, settingsWithDefaults},
  context,
  viewerContext,
}) {
  const [workItemScope, setWorkItemScope] = useState("all");

  const [wip_chart_type_localstorage, setValueToLocalStorage] = useLocalStorage("wip_chart_type");
  const [wipChartType, setWipChartType] = useState(wip_chart_type_localstorage || "queue");
  const specsOnly = workItemScope === "specs";

  const updateWipChartType = (value) => {
    setValueToLocalStorage(value);
    setWipChartType(value);
  }

  const ageLatencyFeatureFlag = useFeatureFlag(AGE_LATENCY_ENHANCEMENTS, true);
  const {state: {workItemSelectors=[]}} = useQueryParamState();

  // maintain all filters state over here
  const [appliedFilters, setAppliedFilters] = React.useState(new Map());

  const {
    cycleTimeTarget,
    leadTimeTarget,
    responseTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    flowAnalysisPeriod,
    includeSubTasksWipInspector,
    latencyTarget,
  } = settingsWithDefaults;

  const DIMENSION = "project";

  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      dashboardVideoConfig={WipDashboard.videoConfig}
      className="tw-grid tw-grid-cols-6 tw-grid-rows-[8%_auto_72%] tw-gap-x-2 tw-gap-y-1 tw-p-2"
      gridLayout={true}
    >
      <div className="tw-col-span-3 tw-col-start-1 tw-row-start-1 tw-text-2xl tw-text-gray-300">
        <div className="tw-flex tw-justify-start">
          Flow Efficiency, {specsOnly ? AppTerms.specs.display : `All ${AppTerms.cards.display}`}
        </div>
      </div>
      <div className="tw-col-span-2 tw-col-start-3 tw-row-start-1 tw-flex tw-flex-col tw-items-center tw-text-2xl tw-text-gray-300">
        <div className="tw-flex tw-justify-start">Age Limit</div>
        <div className="tw-flex tw-justify-start tw-text-base">{cycleTimeTarget} Days</div>
      </div>
      <div className="tw-col-span-2 tw-col-start-5 tw-row-start-1 tw-mr-2 tw-flex tw-items-baseline tw-justify-end tw-gap-8 tw-text-base">
        <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} layout="col" />

        {ageLatencyFeatureFlag && (
          <GroupingSelector
            label="Show"
            value={wipChartType}
            onGroupingChanged={updateWipChartType}
            groupings={[
              {
                key: "queue",
                display: "Queue Size",
              },
              {
                key: "age",
                display: "Age",
              },
              {
                key: "motion",
                display: "Motion",
              },
            ]}
            layout="col"
          />
        )}
      </div>
      <DashboardRow>
        <DashboardWidget
          name="pipeline"
          className="tw-col-span-2 tw-col-start-1"
          title={""}
          render={({view}) => (
            <DimensionWipFlowMetricsWidget
              dimension={DIMENSION}
              instanceKey={key}
              tags={workItemSelectors}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              latestPullRequestEvent={latestPullRequestEvent}
              days={flowAnalysisPeriod}
              leadTimeTarget={leadTimeTarget}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTargetPercentile={leadTimeConfidenceTarget}
              cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
              cycleTimeTarget={cycleTimeTarget}
              view={view}
              specsOnly={specsOnly}
              context={context}
              includeSubTasks={includeSubTasksWipInspector}
            />
          )}
          showDetail={false}
          hideTitlesInDetailView={true}
        />

        <DashboardWidget
          name="summary-wip"
          className="tw-col-span-3 tw-col-start-4"
          title={""}
          render={({view}) => (
            <DimensionWipSummaryWidget
              dimension={DIMENSION}
              instanceKey={key}
              tags={workItemSelectors}
              specsOnly={specsOnly}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              cycleTimeTarget={cycleTimeTarget}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTargetPercentile={leadTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
              days={flowAnalysisPeriod}
              view={view}
              includeSubTasks={includeSubTasksWipInspector}
            />
          )}
          showDetail={false}
          hideTitlesInDetailView={true}
        />

      </DashboardRow>
      <DashboardRow title={" "}>
        <DashboardWidget
          name="engineering"
          className="tw-col-span-3 tw-col-start-1 tw-row-start-3"
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              queryVars={{
                dimension: DIMENSION,
                instanceKey: key,
                tags: workItemSelectors,
                specsOnly,
                activeOnly: true,
                includeSubTasks: includeSubTasksWipInspector,
                referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
              }}
              stageName="Coding"
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
              }}
            />
          )}
          showDetail={true}
        />

        <DashboardWidget
          name="delivery"
          className="tw-col-span-3 tw-col-start-4 tw-row-start-3"
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              queryVars={{
                dimension: DIMENSION,
                instanceKey: key,
                tags: workItemSelectors,
                specsOnly,
                activeOnly: true,
                includeSubTasks: includeSubTasksWipInspector,
                referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
              }}
              stageName={"Shipping"}
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
              }}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
}
export const dashboard = ({viewerContext}) => (
  <ProjectDashboard
    pollInterval={1000 * 60}
    render={(props) => <WipDashboard viewerContext={viewerContext} {...props} />}
  />
);
export default withViewerContext(dashboard);

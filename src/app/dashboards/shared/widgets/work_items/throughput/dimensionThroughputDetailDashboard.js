import React, { useState } from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {DaysRangeSlider, THREE_MONTHS} from "../../../../shared/components/daysRangeSlider/daysRangeSlider";
import {DimensionFlowMetricsWidget} from "../../../../shared/widgets/work_items/closed/flowMetrics";
import {DimensionWorkBalanceTrendsWidget} from "../balance";
import cn from "classnames";
import { WorkItemScopeSelector } from "../../../components/workItemScopeSelector/workItemScopeSelector";
import { VolumeTrendsTableWidget } from "../trends/volume/volumeTrendsTableWidget";
import { AppTerms } from "../../../config";
import { useQueryParamState } from "../../../../projects/shared/helper/hooks";

const dashboard_id = "dashboards.trends.projects.dashboard.instance";

export function DimensionThroughputDetailDashboard({
  dimension,
  dimensionData: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults},
  context,
}) {
  const {
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    responseTimeConfidenceTarget,
    flowAnalysisPeriod,
    includeSubTasksFlowMetrics,
  } = settingsWithDefaults;

  const [workItemScope, setWorkItemScope] = useState("specs");
  const [daysRange, setDaysRange] = React.useState(flowAnalysisPeriod);
  const [selectedMetric, setSelectedMetric] = React.useState("workItemsWithCommits");

  const limitToSpecsOnly = workItemScope === 'specs';
  const {state: {workItemSelectors=[]}} = useQueryParamState();

  return (
    <Dashboard dashboard={`${dashboard_id}`} className="tw-bg-ghostwhite tw-grid tw-grid-cols-6 tw-grid-rows-[7%_auto_auto_auto_5%_50%] tw-gap-2 tw-p-2" gridLayout={true}>
      <div className="tw-col-start-1 tw-col-span-2 tw-row-start-1 tw-text-2xl tw-text-gray-300">
        <div className="tw-flex tw-justify-start">Flow Velocity, {limitToSpecsOnly ? AppTerms.specs.display : `All ${AppTerms.cards.display}`}</div>
        <div className="tw-flex tw-justify-start tw-text-sm">Last {daysRange} Days</div>
      </div>
      <div className="tw-col-start-4 tw-col-span-2 tw-row-start-1 tw-text-base">
        <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange} range={THREE_MONTHS} />
      </div>
      <div className="tw-col-start-6 tw-row-start-1 tw-text-base tw-flex tw-justify-end tw-mr-4">
        <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
      </div>
      <DashboardRow
      >
        <DashboardWidget
          name="flow-metrics"
          className="tw-col-start-1 tw-col-span-3 tw-row-start-2 tw-row-span-3 tw-mt-4"
          render={({view}) => (
            <DimensionFlowMetricsWidget
              dimension={dimension}
              instanceKey={key}
              tags={workItemSelectors}
              view={view}
              display={"throughputDetail"}
              displayProps={{
                initialSelection: selectedMetric,
                onSelectionChanged: (metric) => setSelectedMetric(metric),
              }}
              twoRows={true}
              context={context}
              specsOnly={limitToSpecsOnly}
              latestWorkItemEvent={latestWorkItemEvent}
              days={daysRange}
              measurementWindow={daysRange}
              samplingFrequency={daysRange}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="Cadence"
          title={"Cadence"}
          className="tw-col-start-4 tw-col-span-3 tw-row-start-3 tw-row-span-2"
          render={({view}) => (
            <DimensionFlowMetricsWidget
              dimension={dimension}
              instanceKey={key}
              tags={workItemSelectors}
              view={view}
              display={"cadenceDetail"}
              twoRows={true}
              context={context}
              specsOnly={limitToSpecsOnly}
              latestWorkItemEvent={latestWorkItemEvent}
              days={daysRange}
              measurementWindow={daysRange}
              samplingFrequency={daysRange}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="volume-trends"
          className={cn((selectedMetric === "workItemsWithCommits" || selectedMetric === "workItemsInScope") ? "" : "!tw-hidden", "tw-col-start-1 tw-row-start-6 tw-col-span-6")}
          render={({view}) => (
            <VolumeTrendsTableWidget
              dimension={dimension}
              instanceKey={key}
              tags={workItemSelectors}
              days={daysRange}
              measurementWindow={1}
              samplingFrequency={1}
              targetPercentile={0.7}
              context={context}
              specsOnly={limitToSpecsOnly}
              view={view}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="workbalance-trends"
          className={cn(
            selectedMetric === "totalEffort" || context.targetUrl.includes("workbalance-trends") ? "" : "!tw-hidden",
            "tw-col-start-1 tw-row-start-6 tw-col-span-6"
          )}
          render={({view}) => (
            <DimensionWorkBalanceTrendsWidget
              context={context}
              dimension={dimension}
              instanceKey={key}
              tags={workItemSelectors}
              view={view}
              display="withCardDetails"
              showAllTrends={true}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={daysRange}

              measurementWindow={7}
              samplingFrequency={7}
              showContributorDetail={false}
              showEffort={true}
              chartConfig={{totalEffortDisplayType: "column"}}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
}

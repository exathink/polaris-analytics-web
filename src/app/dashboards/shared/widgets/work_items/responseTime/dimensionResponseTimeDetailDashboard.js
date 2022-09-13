import React, { useState } from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {DaysRangeSlider, THREE_MONTHS} from "../../../../shared/components/daysRangeSlider/daysRangeSlider";
import {DimensionFlowMetricsWidget} from "../../../../shared/widgets/work_items/closed/flowMetrics";
import {DimensionDeliveryCycleFlowMetricsWidget} from "../../../../shared/widgets/work_items/closed/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget";
import { WorkItemScopeSelector } from "../../../components/workItemScopeSelector/workItemScopeSelector";
import { DimensionPullRequestsWidget } from "../../pullRequests/openPullRequests";

const dashboard_id = "dashboards.trends.projects.dashboard.instance";

const metricMapping = {
  avgCycleTime: "cycleTime",
  avgLeadTime: "leadTime",
  avgDuration: "duration",
  avgEffort: "effort",
  avgLatency: "latency",
  pullRequestAvgAge: "pullRequestAvgAge"
};

export function DimensionResponseTimeDetailDashboard({
  dimension,
  dimensionData: {key, latestWorkItemEvent, latestCommit, latestPullRequestEvent, settingsWithDefaults},
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
  const [selectedMetric, setSelectedMetric] = React.useState("avgCycleTime");
  const [yAxisScale, setYAxisScale] = React.useState("histogram");
  const [selectedFilter, setFilter] = React.useState(null);

  const limitToSpecsOnly = workItemScope === 'specs';

  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      gridLayout={true}
      className="tw-grid tw-grid-cols-5 tw-grid-rows-[10%,auto,45%] tw-gap-2 tw-p-2 lg:tw-grid-rows-[6%,43%,45%]"
    >
      <div className="tw-col-start-1 tw-col-span-2 tw-row-start-1 tw-text-2xl tw-text-gray-300">
        <div className="tw-flex tw-justify-start">Variability Analysis, {limitToSpecsOnly ? "Specs" : "All Cards"}</div>
        <div className="tw-flex tw-justify-start tw-text-sm">Last {flowAnalysisPeriod} Days</div>
      </div>
      <div className="tw-col-start-3 tw-col-span-2 tw-row-start-1 tw-text-base">
        <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange} range={THREE_MONTHS} />
      </div>
      <div className="tw-col-start-5 tw-row-start-1 tw-text-base tw-flex tw-justify-end tw-mr-4">
        <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
      </div>

      <DashboardRow>
        <DashboardWidget
          name="flow-metrics"
          hideTitlesInDetailView={true}
          className="tw-col-span-5"
          render={({view}) => (
            <DimensionFlowMetricsWidget
              dimension={dimension}
              instanceKey={key}
              view={view}
              display={"responseTimeDetail"}
              displayProps={{
                initialSelection: selectedMetric,
                onSelectionChanged: (metric) => setSelectedMetric(metric),
              }}
              initialSelection={""}
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
        {metricMapping[selectedMetric] !== metricMapping.pullRequestAvgAge && (
          <DashboardWidget
            title={""}
            name="flow-metrics-delivery-details"
            className="tw-col-span-5"
            render={({view}) => (
              <DimensionDeliveryCycleFlowMetricsWidget
                dimension={dimension}
                instanceKey={key}
                specsOnly={limitToSpecsOnly}
                view={view}
                context={context}
                showAll={true}
                latestWorkItemEvent={latestWorkItemEvent}
                days={daysRange}
                initialDays={daysRange}
                initialMetric={metricMapping[selectedMetric]}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                includeSubTasks={includeSubTasksFlowMetrics}
                yAxisScale={yAxisScale}
                setYAxisScale={setYAxisScale}
              />
            )}
            showDetail={false}
          />
        )}
        {metricMapping[selectedMetric] === metricMapping.pullRequestAvgAge && (
          <DashboardWidget
            name="pr-metrics-reviewtime-closed"
            className="tw-col-span-5"
            render={({view}) => (
              <DimensionPullRequestsWidget
                dimension={dimension}
                instanceKey={key}
                view={view}
                closedWithinDays={daysRange}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                latestPullRequestEvent={latestPullRequestEvent}
                selectedFilter={selectedFilter}
                setFilter={setFilter}
                display="histogramTable"
              />
            )}
            showDetail={false}
          />
        )}
      </DashboardRow>
    </Dashboard>
  );
}

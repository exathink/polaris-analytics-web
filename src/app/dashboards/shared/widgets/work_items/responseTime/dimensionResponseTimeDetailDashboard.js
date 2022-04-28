import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {DaysRangeSlider, THREE_MONTHS} from "../../../../shared/components/daysRangeSlider/daysRangeSlider";
import {DimensionFlowMetricsWidget} from "../../../../shared/widgets/work_items/closed/flowMetrics";
import {DimensionDeliveryCycleFlowMetricsWidget} from "../../../../shared/widgets/work_items/closed/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget";
import {PullRequestsReviewTimeTrendsWidget} from "../../pullRequests/trends/pullRequestsReviewTime";

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
  dimensionData: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults},
  context,
}) {
  const {
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    responseTimeConfidenceTarget,
    wipAnalysisPeriod,
    includeSubTasksFlowMetrics,
  } = settingsWithDefaults;

  const [daysRange, setDaysRange] = React.useState(wipAnalysisPeriod);
  const [selectedMetric, setSelectedMetric] = React.useState("avgCycleTime");
  const [yAxisScale, setYAxisScale] = React.useState("histogram");


  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      gridLayout={true}
      className="tw-grid tw-grid-cols-[49.5%,49.5%] tw-grid-rows-[6%,auto,45%] tw-gap-2 lg:tw-grid-rows-[6%,43%,45%]"
    >
      <DashboardRow
        className="tw-col-span-2 tw-flex tw-justify-center"
        controls={[
          () => (
            <div style={{minWidth: "500px"}}>
              <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange} range={THREE_MONTHS} />
            </div>
          ),
        ]}
      >
        <DashboardWidget
          name="flow-metrics"
          title={`Response Time`}
          subtitle={`Specs, Last ${daysRange} days`}
          hideTitlesInDetailView={true}
          className="tw-col-span-2"
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
              specsOnly={true}
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
            className="tw-col-span-2"
            render={({view}) => (
              <DimensionDeliveryCycleFlowMetricsWidget
                dimension={dimension}
                instanceKey={key}
                specsOnly={true}
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
            name="pr-metrics-reviewtime-detailed"
            className="tw-col-span-2"
            render={({view}) => (
              <PullRequestsReviewTimeTrendsWidget
                dimension={dimension}
                instanceKey={key}
                view={view}
                days={daysRange}
                measurementWindow={daysRange}
                samplingFrequency={daysRange}
                latestCommit={latestCommit}
                display="histogram"
              />
            )}
            showDetail={false}
          />
        )}
      </DashboardRow>
    </Dashboard>
  );
}

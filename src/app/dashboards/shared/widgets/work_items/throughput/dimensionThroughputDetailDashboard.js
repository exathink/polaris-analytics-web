import React, { useState } from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {DaysRangeSlider, THREE_MONTHS} from "../../../../shared/components/daysRangeSlider/daysRangeSlider";
import styles from "./dashboard.module.css";
import {DimensionFlowMetricsWidget} from "../../../../shared/widgets/work_items/closed/flowMetrics";
import {DimensionWorkBalanceTrendsWidget} from "../balance";
import cn from "classnames";
import { WorkItemScopeSelector } from "../../../components/workItemScopeSelector/workItemScopeSelector";
import { VolumeTrendsTableWidget } from "../trends/volume/volumeTrendsTableWidget";

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

  return (
    <Dashboard dashboard={`${dashboard_id}`} className={styles.throughputDashboard} gridLayout={true}>
      <DashboardRow
        className={styles.rangeSlider}
        controls={[
          () => (
            <div style={{marginRight: "20px"}}>
              <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
            </div>
          ),
          () => (
            <div style={{minWidth: "500px"}}>
              <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange} range={THREE_MONTHS} />
            </div>
          ),
        ]}
      >
        <DashboardWidget
          name="flow-metrics"
          title={`Throughput`}
          subtitle={`Specs, Last ${daysRange} Days`}
          className={styles.throughputMetrics}
          render={({view}) => (
            <DimensionFlowMetricsWidget
              dimension={dimension}
              instanceKey={key}
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
          className={styles.cadence}
          render={({view}) => (
            <DimensionFlowMetricsWidget
              dimension={dimension}
              instanceKey={key}
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
      <DashboardRow className={styles.chartsToggleRow}>
        <DashboardWidget
          name="volume-trends"
          className={cn((selectedMetric === "workItemsWithCommits" || selectedMetric === "workItemsInScope") ? "" : "tw-impHidden", styles.throughputDetail)}
          render={({view}) => (
            <VolumeTrendsTableWidget
              dimension={dimension}
              instanceKey={key}
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
            selectedMetric === "totalEffort" || context.targetUrl.includes("workbalance-trends") ? "" : "tw-impHidden",
            styles.throughputDetail
          )}
          render={({view}) => (
            <DimensionWorkBalanceTrendsWidget
              context={context}
              dimension={dimension}
              instanceKey={key}
              view={view}
              display="withCardDetails"
              showAllTrends={true}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={daysRange}
              // Using this scheme here, since a weekly non-overlapping rollup is the
              // the most sensible way to show the effort out. It also matches what we see
              // in the detail dashboard when we first launch it.
              measurementWindow={1}
              samplingFrequency={1}
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

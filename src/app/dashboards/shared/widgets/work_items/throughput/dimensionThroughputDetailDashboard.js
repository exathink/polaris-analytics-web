import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {DaysRangeSlider, THREE_MONTHS} from "../../../../shared/components/daysRangeSlider/daysRangeSlider";
import styles from "./dashboard.module.css";
import {DimensionFlowMetricsWidget} from "../../../../shared/widgets/work_items/closed/flowMetrics";
import {DimensionVolumeTrendsWidget} from "../../../../shared/widgets/work_items/trends/volume";

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
    wipAnalysisPeriod,
    includeSubTasksFlowMetrics,
  } = settingsWithDefaults;

  const [daysRange, setDaysRange] = React.useState(wipAnalysisPeriod);
  const [selectedMetric, setSelectedMetric] = React.useState("workItemsWithCommits");

  return (
    <Dashboard dashboard={`${dashboard_id}`} className={styles.throughputDashboard} gridLayout={true}>
      <DashboardRow
        className={styles.rangeSlider}
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
      <DashboardRow
        className={styles.chartsToggleRow}
      >
        <DashboardWidget
          name="volume-trends"
          className={styles.throughputDetail}
          render={({view}) => (
            <DimensionVolumeTrendsWidget
              dimension={dimension}
              instanceKey={key}
              days={daysRange}
              measurementWindow={1}
              samplingFrequency={1}
              targetPercentile={0.7}
              context={context}
              view={view}
              display="withCardDetails"
              latestWorkItemEvent={latestWorkItemEvent}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
}

import React from "react";
import {DimensionResponseTimeTrendsWidget} from "../../../../shared/widgets/work_items/trends/responseTime";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {DaysRangeSlider, THREE_MONTHS} from "../../../../shared/components/daysRangeSlider/daysRangeSlider";
import styles from "./dashboard.module.css";
import {DimensionFlowMetricsWidget} from "../../../../shared/widgets/work_items/closed/flowMetrics";
import {DimensionDeliveryCycleFlowMetricsWidget} from "../../../../shared/widgets/work_items/closed/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget";
import {GroupingSelector} from "../../../../shared/components/groupingSelector/groupingSelector";

const dashboard_id = "dashboards.trends.projects.dashboard.instance";

const metricMapping = {
  avgCycleTime: "cycleTime",
  avgLeadTime: "leadTime",
  avgDuration: "duration",
  avgEffort: "effort",
  avgLatency: "latency",
};

export function ResponseTimeDetailDashboard({
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
  const [yAxisScale, setYAxisScale] = React.useState("logarithmic");
  const [chartToggle, setChartToggle] = React.useState("trend");

  return (
    <Dashboard dashboard={`${dashboard_id}`} className={styles.responseTimeDashboard} gridLayout={true}>
      <DashboardRow
        h="45%"
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
          title={`Spec Response Time`}
          hideTitlesInDetailView={true}
          className={styles.responseTimeMetrics}
          render={({view}) => (
            <DimensionFlowMetricsWidget
              dimension={"team"}
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
        h="46%"
        className={styles.chartsRow}
        controls={[
          () => (
            <GroupingSelector
              label={" "}
              value={chartToggle}
              groupings={[
                {
                  key: "trend",
                  display: "Trend",
                },
                {
                  key: "cardDetail",
                  display: "Card Detail",
                },
              ]}
              initialValue={"trend"}
              onGroupingChanged={setChartToggle}
            />
          ),
        ]}
      >
        <DashboardWidget
          name="cycle-time"
          className={chartToggle === "trend" ? styles.responseTimeDetail : styles.responseTimeDetailHidden}
          render={({view}) => (
            <DimensionResponseTimeTrendsWidget
              dimension={"team"}
              instanceKey={key}
              measurementWindow={7}
              days={daysRange}
              samplingFrequency={7}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              targetPercentile={cycleTimeConfidenceTarget}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              defaultSeries={["all"]}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
        />

        <DashboardWidget
          title={""}
          name="flow-metrics-delivery-details"
          className={chartToggle === "cardDetail" ? styles.responseTimeDetail : styles.responseTimeDetailHidden}
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
      </DashboardRow>
    </Dashboard>
  );
}

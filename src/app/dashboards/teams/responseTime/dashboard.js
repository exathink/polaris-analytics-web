import React from "react";
import {TeamDashboard} from "../teamDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {DimensionPredictabilityTrendsWidget} from "../../shared/widgets/work_items/trends/predictability";
import {DimensionVolumeTrendsWidget} from "../../shared/widgets/work_items/trends/volume";
import {
  DimensionDefectResponseTimeWidget,
  DimensionResponseTimeTrendsWidget,
} from "../../shared/widgets/work_items/trends/responseTime";

import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {DaysRangeSlider, THREE_MONTHS} from "../../shared/components/daysRangeSlider/daysRangeSlider";
import styles from "./dashboard.module.css";
import {DimensionFlowMetricsWidget} from "../../shared/widgets/work_items/closed/flowMetrics";
import { DimensionDeliveryCycleFlowMetricsWidget } from "../../shared/widgets/work_items/closed/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget";



const dashboard_id = "dashboards.trends.projects.dashboard.instance";

const dashboard = ({viewerContext}) => (
  <TeamDashboard
    pollInterval={1000 * 60}
    render={({team, ...rest}) => <DimensionResponseTimeDashboard dimension={'team'} dimensionData={team} {...rest} viewerContext={viewerContext} />}
  />
);

const metricMapping = {
  avgCycleTime: "cycleTime",
  avgLeadTime: "leadTime",
  avgDuration: "duration",
  avgEffort: "effort",
  avgLatency: "latency"
};

function DimensionResponseTimeDashboard({
  dimension,
  dimensionData: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults},
  context,
  viewerContext,
}) {
  const {
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    responseTimeConfidenceTarget,
    trendsAnalysisPeriod,
    wipAnalysisPeriod,
    includeSubTasksFlowMetrics,
  } = settingsWithDefaults;

  const [daysRange, setDaysRange] = React.useState(wipAnalysisPeriod);
  const selectedMetricState = React.useState("avgCycleTime");
  const [selectedMetric] = selectedMetricState;

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
          )
        ]}
      >
        <DashboardWidget
          name="flow-metrics"
          title={`Spec Response Time`}
          subtitle={`Last ${daysRange} Days`}
          hideTitlesInDetailView={true}
          className={styles.responseTimeDetail}
          render={({view}) => (
            <DimensionFlowMetricsWidget
              dimension={"team"}
              instanceKey={key}
              view={view}
              display={"responseTimeDetail"}
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
              selectedMetricState={selectedMetricState}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h="46%" >
        <DashboardWidget
          name="cycle-time"
          subtitle={"7 Day Detail"}
          className={styles.responseTimeTrends}
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
          showDetail={false}
        />
        <DashboardWidget
          subtitle={"Spec Detail"}
          name="flow-metrics-delivery-details"
          className={styles.flowMetricsScatter}
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
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}


export default withViewerContext(dashboard);

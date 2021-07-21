import React from "react";
import { TeamDashboard } from "../teamDashboard";
import { withViewerContext } from "../../../framework/viewer/viewerContext";

import { Dashboard, DashboardRow, DashboardWidget } from "../../../framework/viz/dashboard";
import { DaysRangeSlider, THREE_MONTHS } from "../../shared/components/daysRangeSlider/daysRangeSlider";
import styles from "./dashboard.module.css";
import { DimensionFlowMetricsWidget } from "../../shared/widgets/work_items/closed/flowMetrics";
import { DimensionDeliveryCycleFlowMetricsWidget } from "../../shared/widgets/work_items/closed/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget";
// import {DimensionVolumeTrendsWidget} from "../../shared/widgets/work_items/trends/volume";
// import {ProjectEffortTrendsWidget} from "../../projects/shared/widgets/capacity";



const dashboard_id = "dashboards.trends.projects.dashboard.instance";

const dashboard = ({viewerContext}) => (
  <TeamDashboard
    pollInterval={1000 * 60}
    render={({team, ...rest}) => (
      <DimensionThroughputDashboard dimension={"team"} dimensionData={team} {...rest} viewerContext={viewerContext} />
    )}
  />
);

function DimensionThroughputDashboard({
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
          title={"Throughput"}
          className={styles.throughputMetrics}
          render={({view}) => (
            <DimensionFlowMetricsWidget
              dimension={"team"}
              instanceKey={key}
              view={view}
              display={"throughputDetail"}
              displayProps={{
                initialSelection: selectedMetric,
                onSelectionChanged: (metric) => setSelectedMetric(metric)
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
          )
          }
          showDetail={false}
        />
        <DashboardWidget
          name="Cadence"
          title={"Cadence"}
          className={styles.cadence}
          render={({view}) => (
            <DimensionFlowMetricsWidget
              dimension={"team"}
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
          )
          }
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow
        className={styles.chartsToggleRow}
      >
        <DashboardWidget
          title={""}
          name="flow-metrics-delivery-details"
          className={styles.throughputDetail}
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
              initialMetric={"leadTime"}
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

export default withViewerContext(dashboard);

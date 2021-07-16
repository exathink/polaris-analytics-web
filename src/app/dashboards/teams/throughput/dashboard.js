import React from "react";
import {TeamDashboard} from "../teamDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {DaysRangeSlider, THREE_MONTHS} from "../../shared/components/daysRangeSlider/daysRangeSlider";
import styles from "./dashboard.module.css";
import {DimensionFlowMetricsWidget} from "../../shared/widgets/work_items/closed/flowMetrics";
import {DimensionFlowMixTrendsWidget} from "../../shared/widgets/work_items/trends/flowMix/flowMixTrendsWidget";
import {DimensionVolumeTrendsWidget} from "../../shared/widgets/work_items/trends/volume";
import {ProjectEffortTrendsWidget} from "../../projects/shared/widgets/capacity";

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
  const selectedMetricState = React.useState("workItemsWithCommits");

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
        <DashboardWidget
          name="flow-type-flow-mix"
          title="Value Mix"
          className={styles.valueMix}
          render={({view}) => (
            <DimensionFlowMixTrendsWidget
              dimension={"team"}
              instanceKey={key}
              measurementWindow={daysRange}
              days={daysRange}
              samplingFrequency={7}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              specsOnly={true}
              showCounts={true}
              includeSubTasks={includeSubTasksFlowMetrics}
              asStatistic={true}
              selectedMetricState={selectedMetricState}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="flow-mix"
          className={styles.valueMixChart}
          render={({view}) => (
            <DimensionFlowMixTrendsWidget
              dimension={"team"}
              instanceKey={key}
              measurementWindow={daysRange}
              days={daysRange}
              samplingFrequency={7}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              specsOnly={true}
              asStatistic={false}
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

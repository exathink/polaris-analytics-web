import React from "react";
import {TeamDashboard} from "../teamDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {DaysRangeSlider, THREE_MONTHS} from "../../shared/components/daysRangeSlider/daysRangeSlider";
import styles from "./dashboard.module.css";
import {DimensionFlowMetricsWidget} from "../../shared/widgets/work_items/closed/flowMetrics";
import {DimensionFlowMixTrendsWidget} from "../../shared/widgets/work_items/trends/flowMix/flowMixTrendsWidget";
import { GroupingSelector } from "../../shared/components/groupingSelector/groupingSelector";
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
  const [chartToggle, setChartToggle] = React.useState("throughputDetail");
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
          name="flow-type-flow-mix"
          title={`Value Mix by ${selectedMetric === 'workItemsWithCommits' ? 'Volume' : 'Effort'}`}
          className={chartToggle === 'valueMix' ? styles.valueMix : styles.hidden}
          render={({view}) => (
            <DimensionFlowMixTrendsWidget
              dimension={"team"}
              instanceKey={key}
              measurementWindow={daysRange}
              days={daysRange}
              samplingFrequency={daysRange}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              specsOnly={selectedMetric==="totalEffort"}
              showCounts={true}
              includeSubTasks={includeSubTasksFlowMetrics}
              asStatistic={true}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="Cadence"
          title={"Cadence"}
          className={chartToggle === 'throughputDetail' ? styles.valueMix : styles.hidden}
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
        controls={[
          () => (
            <GroupingSelector
              label={" "}
              value={chartToggle}
              groupings={[
                {
                  key: "throughputDetail",
                  display: "Cadence",
                },
                {
                  key: "valueMix",
                  display: "Value Mix",
                },

              ]}
              initialValue={"throughputDetail"}
              onGroupingChanged={setChartToggle}
            />
          ),
        ]}
      >
        <DashboardWidget
          name="flow-mix"
          className={chartToggle === "valueMix" ? styles.throughputDetail : styles.throughputDetailHidden}
          render={({view}) => (
            <DimensionFlowMixTrendsWidget
              dimension={"team"}
              instanceKey={key}
              measurementWindow={daysRange}
              days={daysRange}
              samplingFrequency={daysRange}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              specsOnly={selectedMetric==="totalEffort"}
              asStatistic={false}
              showCounts={true}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={false}
        />

        <DashboardWidget
          title={""}
          name="flow-metrics-delivery-details"
          className={chartToggle === "throughputDetail" ? styles.throughputDetail : styles.throughputDetailHidden}
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

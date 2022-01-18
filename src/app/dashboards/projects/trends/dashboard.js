import React from "react";
import {ProjectDashboard} from "../projectDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {DimensionVolumeTrendsWidget} from "../../shared/widgets/work_items/trends/volume";
import {
  DimensionDefectResponseTimeWidget,
  DimensionResponseTimeTrendsWidget,
} from "../../shared/widgets/work_items/trends/responseTime";

import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {DimensionFlowMixTrendsWidget} from "../../shared/widgets/work_items/trends/flowMix";
import {DimensionWorkBalanceTrendsWidget} from "../../shared/widgets/work_items/balance";
import {DefectArrivalCloseRateWidget, DefectBacklogTrendsWidget} from "../shared/widgets/quality";
import {DaysRangeSlider, SIX_MONTHS} from "../../shared/components/daysRangeSlider/daysRangeSlider";
import styles from "../alignment/dashboard.module.css";
import {ProjectValueBookWidget} from "../../shared/widgets/work_items/valueBook";

const dashboard_id = "dashboards.trends.projects.dashboard.instance";

function TrendsDashboard({
  project: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults},
  context,
  viewerContext,
}) {
  const {
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    trendsAnalysisPeriod,
    includeSubTasksFlowMetrics,
  } = settingsWithDefaults;

  const [daysRange, setDaysRange] = React.useState(trendsAnalysisPeriod);

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow
        h="28%"
        title={`Speed`}
        controls={[
          () => (
            <div style={{minWidth: "500px"}}>
              <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange} range={SIX_MONTHS} />
            </div>
          ),
        ]}
      >
        <DashboardWidget
          w={1 / 3}
          name="cycle-time"
          render={({view}) => (
            <DimensionResponseTimeTrendsWidget
              dimension={"project"}
              instanceKey={key}
              measurementWindow={30}
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
          w={1 / 3}
          name="throughput"
          render={({view}) => (
            <DimensionVolumeTrendsWidget
              dimension={"project"}
              instanceKey={key}
              measurementWindow={30}
              days={daysRange}
              samplingFrequency={7}
              targetPercentile={0.7}
              context={context}
              view={view}
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

        <DashboardWidget
          w={1 / 3}
          name="capacity"
          render={({view}) => (
            <DimensionWorkBalanceTrendsWidget
              dimension={"project"}
              instanceKey={key}
              measurementWindow={30}
              days={daysRange}
              samplingFrequency={7}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              target={0.9}
              showEffort={true}
              showContributorDetail={false}
              chartConfig={{totalEffortDisplayType: "areaspline"}}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>

      <DashboardRow h="28%" title={`Quality`}>

        <DashboardWidget
          w={1 / 3}
          name="defect-response-time"
          render={({view}) => (
            <DimensionDefectResponseTimeWidget
              dimension={"project"}
              instanceKey={key}
              measurementWindow={30}
              days={daysRange}
              samplingFrequency={7}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              cycleTimeTarget={cycleTimeTarget}
              view={view}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          w={1 / 3}
          name="defect-rate"
          render={({view}) => (
            <DefectArrivalCloseRateWidget
              instanceKey={key}
              measurementWindow={30}
              days={daysRange}
              samplingFrequency={7}
              view={view}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          w={1 / 3}
          name="backlog-trends-widget"
          render={({view}) => (
            <DefectBacklogTrendsWidget
              instanceKey={key}
              measurementWindow={30}
              days={daysRange}
              samplingFrequency={7}
              view={view}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow
        h={"28%"}
        title={"Alignment"}

      >
        <DashboardWidget
          w={1 / 2}
          name="flow-mix"
          render={({view}) => (
            <DimensionFlowMixTrendsWidget
              dimension={"project"}
              instanceKey={key}
              measurementWindow={30}
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
          showDetail={true}
        />
        <DashboardWidget
          name="epic-flow-mix-closed"
          w={1 / 2}
          className={styles.valueBookClosed}
          render={({view}) => (
            <ProjectValueBookWidget
              instanceKey={key}
              context={context}
              days={daysRange}
              specsOnly={true}
              view={view}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}

const dashboard = ({viewerContext}) => (
  <ProjectDashboard
    pollInterval={1000 * 60}
    render={(props) => <TrendsDashboard {...props} viewerContext={viewerContext} />}
  />
);
export default withViewerContext(dashboard);

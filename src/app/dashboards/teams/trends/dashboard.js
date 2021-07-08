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
import {DaysRangeSlider, ONE_YEAR} from "../../shared/components/daysRangeSlider/daysRangeSlider";
import styles from "../../projects/flow/dashboard.module.css";
import {DimensionFlowMetricsWidget} from "../../shared/widgets/work_items/closed/flowMetrics";



const dashboard_id = "dashboards.trends.projects.dashboard.instance";

const dashboard = ({viewerContext}) => (
  <TeamDashboard
    pollInterval={1000 * 60}
    render={(props) => <TrendsDashboard {...props} viewerContext={viewerContext} />}
  />
);

function TrendsDashboard({
  team: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults},
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
    includeSubTasksFlowMetrics,
  } = settingsWithDefaults;

  const [daysRange, setDaysRange] = React.useState(trendsAnalysisPeriod);

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow
        h="60%"
        controls={[
          () => (
            <div style={{minWidth: "500px"}}>
              <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange} range={ONE_YEAR} />
            </div>
          ),
        ]}
      >
        <DashboardWidget
          w={1}
          name="flow-metrics"
          title={`Response Time`}
          subtitle={`Last ${daysRange} Days`}
          hideTitlesInDetailView={true}
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
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h="40%" >
        <DashboardWidget
          w={1}
          name="cycle-time"
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
      </DashboardRow>
    </Dashboard>
  );
}


export default withViewerContext(dashboard);

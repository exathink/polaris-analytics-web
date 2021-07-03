import React from "react";
import {TeamDashboard} from "../teamDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {DimensionPredictabilityTrendsWidget} from "../../shared/widgets/work_items/trends/predictability";
import {DimensionVolumeTrendsWidget} from "../../shared/widgets/work_items/trends/volume";
import {
  DimensionResponseTimeTrendsWidget,
  DimensionDefectResponseTimeWidget,
} from "../../shared/widgets/work_items/trends/responseTime";
import {ProjectTraceabilityTrendsWidget} from "../../shared/widgets/commits/traceability";

import {PROJECTS_ALIGNMENT_TRENDS_WIDGETS} from "../../../../config/featureFlags";

import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";

import {DaysRangeSlider, ONE_YEAR} from "../../shared/components/daysRangeSlider/daysRangeSlider";
import { DefectArrivalCloseRateWidget, DefectBacklogTrendsWidget } from "../../projects/shared/widgets/quality";

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
    trendsAnalysisPeriod,
    includeSubTasksFlowMetrics,
  } = settingsWithDefaults;

  const [daysRange, setDaysRange] = React.useState(trendsAnalysisPeriod);

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h="50%" title={`Flow`}>
        <DashboardWidget
          w={1 / 3}
          name="throughput"
          render={({view}) => (
            <DimensionVolumeTrendsWidget
              dimension={"team"}
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
          name="cycle-time"
          render={({view}) => (
            <DimensionResponseTimeTrendsWidget
              dimension={"team"}
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
          name="predictability"
          render={({view}) => (
            <DimensionPredictabilityTrendsWidget
              dimension={"team"}
              instanceKey={key}
              measurementWindow={30}
              days={daysRange}
              samplingFrequency={7}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              targetPercentile={cycleTimeConfidenceTarget}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h="45%" title={`Quality`}>
        <DashboardWidget
          w={1 / 3}
          name="defect-rate"
          render={({view}) => (
            null
          )}
          showDetail={true}
        />
        <DashboardWidget
          w={1 / 3}
          name="defect-response-time"
          render={({view}) => (
            <DimensionDefectResponseTimeWidget
              dimension={"team"}
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
          name="backlog-trends-widget"
          render={({view}) => (
            null
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
}


export default withViewerContext(dashboard);

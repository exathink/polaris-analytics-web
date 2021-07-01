import React from "react";
import {ProjectDashboard} from "../projectDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {DimensionPredictabilityTrendsWidget} from "../../shared/widgets/work_items/trends/predictability";
import {DimensionVolumeTrendsWidget} from "../../shared/widgets/work_items/trends/volume";
import {DimensionResponseTimeTrendsWidget, DimensionDefectResponseTimeWidget} from "../../shared/widgets/work_items/trends/responseTime";
import {ProjectTraceabilityTrendsWidget} from "../shared/widgets/traceability";

import {PROJECTS_ALIGNMENT_TRENDS_WIDGETS} from "../../../../config/featureFlags";

import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ProjectFlowMixTrendsWidget} from "../shared/widgets/flowMix";
import {ProjectEffortTrendsWidget} from "../shared/widgets/capacity";
import {
  DefectArrivalCloseRateWidget,
  DefectBacklogTrendsWidget,
} from "../shared/widgets/quality";
import {DaysRangeSlider, ONE_YEAR} from "../../shared/components/daysRangeSlider/daysRangeSlider";

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
    includeSubTasksFlowMetrics
  } = settingsWithDefaults;

  const [daysRange, setDaysRange] = React.useState(trendsAnalysisPeriod);

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      {viewerContext.isFeatureFlagActive(PROJECTS_ALIGNMENT_TRENDS_WIDGETS) && (
        <DashboardRow
          h={"28%"}
          title={"Alignment"}
          controls={[
            () => (
              <div style={{minWidth: "500px"}}>
                <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange} range={ONE_YEAR}/>
              </div>
            ),
          ]}
        >
          <DashboardWidget
            w={1 / 3}
            name="capacity"
            render={({view}) => (
              <ProjectEffortTrendsWidget
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
                chartConfig={{totalEffortDisplayType: "spline"}}
                includeSubTasks={includeSubTasksFlowMetrics}
              />
            )}
            showDetail={true}
          />

          <DashboardWidget
            w={1 / 3}
            name="flow-mix"
            render={({view}) => (
              <ProjectFlowMixTrendsWidget
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
            w={1 / 3}
            name="traceability"
            render={({view}) => (
              <ProjectTraceabilityTrendsWidget
                instanceKey={key}
                measurementWindow={30}
                days={daysRange}
                samplingFrequency={7}
                context={context}
                view={view}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
              />
            )}
            showDetail={true}
          />
        </DashboardRow>
      )}
      <DashboardRow h="28%" title={`Flow`}>
        <DashboardWidget
          w={1 / 3}
          name="throughput"
          render={({view}) => (
            <DimensionVolumeTrendsWidget
              dimension={'project'}
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
              dimension={'project'}
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
              defaultSeries={["leadTime", "cycleTime"]}
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
              dimension={'project'}
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
      <DashboardRow h="28%" title={`Quality`}>
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
          name="defect-response-time"
          render={({view}) => (
            <DimensionDefectResponseTimeWidget
              dimension={'project'}
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

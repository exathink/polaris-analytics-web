import React from "react";
import {ProjectDashboard, useProjectContext} from "../projectDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {
  DimensionDefectResponseTimeWidget,
} from "../../shared/widgets/work_items/trends/responseTime";

import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {DimensionFlowMixTrendsWidget} from "../../shared/widgets/work_items/trends/flowMix";
import {DefectArrivalCloseRateWidget, DefectBacklogTrendsWidget} from "../shared/widgets/quality";
import {DaysRangeSlider, ONE_YEAR} from "../../shared/components/daysRangeSlider/daysRangeSlider";
import { useQueryParamState } from "../shared/helper/hooks";

const dashboard_id = "dashboards.trends.projects.dashboard.instance";

function TrendsDashboard({
  viewerContext,
}) {
  const {project: {key, latestCommit, latestWorkItemEvent, settingsWithDefaults}, context} = useProjectContext();
  const {
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    trendsAnalysisPeriod,
    includeSubTasksFlowMetrics,
  } = settingsWithDefaults;

  const [daysRange, setDaysRange] = React.useState(trendsAnalysisPeriod);
  
  const {state} = useQueryParamState();
  const workItemSelectors = state?.vs?.workItemSelectors??[];
  const release = state?.release?.releaseValue;

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow
        h="45%"
        title={`Quality Analysis`}
        subTitle={`Last ${daysRange} Days`}
        controls={[
          () => (
            <div style={{minWidth: "500px"}}>
              <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange} range={ONE_YEAR} />
            </div>
          ),
        ]}>
        <DashboardWidget
          w={1 / 2}
          name="defect-rate"
          render={({view}) => (
            <DefectArrivalCloseRateWidget
              instanceKey={key}
              measurementWindow={30}
              days={daysRange}
              samplingFrequency={30}
              release={release}
              tags={workItemSelectors}
              view={view}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          w={1 / 2}
          name="defect-response-time"
          render={({view}) => (
            <DimensionDefectResponseTimeWidget
              dimension={"project"}
              instanceKey={key}
              release={release}
              tags={workItemSelectors}
              measurementWindow={30}
              days={daysRange}
              samplingFrequency={30}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              cycleTimeTarget={cycleTimeTarget}
              view={view}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow
        h={"45%"}
      >
        <DashboardWidget
          w={1}
          name="flow-mix"
          render={({view}) => (
            <DimensionFlowMixTrendsWidget
              dimension={"project"}
              release={release}
              tags={workItemSelectors}
              title={`Capacity Allocated to Defects, Last ${daysRange} Days`}
              instanceKey={key}
              measurementWindow={30}
              days={daysRange}
              samplingFrequency={30}
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

      </DashboardRow>
    </Dashboard>
  );
}

const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60}>
    <TrendsDashboard viewerContext={viewerContext} />
  </ProjectDashboard>
);
export default withViewerContext(dashboard);

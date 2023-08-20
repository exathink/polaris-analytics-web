import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {TeamDashboard} from "../teamDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import styles from "./dashboard.module.css";
import {DimensionCommitsNavigatorWidget} from "../../shared/widgets/accountHierarchy";
import {
  DimensionPipelineCycleTimeLatencyWidget,
  DimensionWipFlowMetricsWidget,
} from "../../shared/widgets/work_items/wip";
import {WorkItemStateTypes} from "../../shared/config";
import {DimensionPullRequestsWidget} from "../../shared/widgets/pullRequests/openPullRequests";
import {DimensionResponseTimeWidget} from "../../shared/widgets/work_items/responseTime/dimensionResponseTimeWidget";
import {DimensionThroughputWidget} from "../../shared/widgets/work_items/throughput/dimensionThroughputWidget";
import {getReferenceString} from "../../../helpers/utility";

const dashboard_id = "dashboards.activity.teams.instance";

export const dashboard = ({viewerContext}) => (
  <TeamDashboard
    pollInterval={1000 * 60}
    render={(props) => <WipDashboard viewerContext={viewerContext} {...props} />}
  />
);

function WipDashboard({
  team: {key, latestWorkItemEvent, latestCommit, latestPullRequestEvent, settings, settingsWithDefaults},
  context,
  viewerContext,
}) {
  const [workItemScope, setWorkItemScope] = useState("specs");
  const specsOnly = workItemScope === "specs";
  const {
    leadTimeTarget,
    cycleTimeTarget,
    responseTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    wipLimit,
    wipAnalysisPeriod,
    includeSubTasksWipInspector,
    includeSubTasksFlowMetrics,
    latencyTarget,
  } = settingsWithDefaults;
  const DIMENSION = "team";
  return (
    <Dashboard dashboard={`${dashboard_id}`} >
      <DashboardRow h="45%" >
        <DashboardWidget
          name={"code-reviews"}
          title={"Pending Code Reviews"}
          w={1}
          render={({view}) => (
            <DimensionPullRequestsWidget
              dimension={"team"}
              instanceKey={key}
              view={view}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              latestPullRequestEvent={latestPullRequestEvent}
              asStatistic={false}
              activeOnly={true}
              specsOnly={true}
              days={wipAnalysisPeriod}
              measurementWindow={wipAnalysisPeriod}
              samplingFrequency={wipAnalysisPeriod}
              latencyTarget={latencyTarget}
              display="histogram"
              title={"Open Pull Requests"}

            />
          )}
          showDetail={true}
          hideTitlesInDetailView={true}
        />
      </DashboardRow>
      <DashboardRow h={"55%"} >
        <DashboardWidget
          name="commits"
          title={"Latest Activity"}
          w={1}
          render={({view}) => (
            <DimensionCommitsNavigatorWidget
              dimension={"team"}
              instanceKey={key}
              context={context}
              view={view}
              days={1}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              groupBy={"workItem"}
              groupings={[ "workItem", "author", "repository", "branch"]}
              showHeader
              showTable
            />
          )}
          showDetail={true}
        />
      </DashboardRow>


    </Dashboard>
  );
}

export default withViewerContext(dashboard);

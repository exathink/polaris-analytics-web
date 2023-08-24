import React from "react";
import { Dashboard, DashboardRow, DashboardWidget } from "../../../framework/viz/dashboard";
import { TeamDashboard } from "../teamDashboard";
import { withViewerContext } from "../../../framework/viewer/viewerContext";
import { DimensionCommitsNavigatorWidget } from "../../shared/widgets/accountHierarchy";
import { DimensionPullRequestsWidget } from "../../shared/widgets/pullRequests/openPullRequests";

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


  const {
    wipAnalysisPeriod,
    latencyTarget
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
              dimension={DIMENSION}
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

import React from "react";
import {TeamDashboard} from "../teamDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {DimensionWorkBalanceTrendsDetailDashboard} from "../../shared/widgets/work_items/balance";

const dashboard_id = "dashboards.trends.projects.dashboard.instance";

const dashboard = ({viewerContext}) => (
  <TeamDashboard
    pollInterval={1000 * 60}
    render={({team, ...rest}) => (
      <DimensionWorkBalanceTrendsDashboard dimension={"team"} dimensionData={team} {...rest} viewerContext={viewerContext} />
    )}
  />
);



function DimensionWorkBalanceTrendsDashboard({
  dimension,
  dimensionData: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults},
  context,
  viewerContext,
}) {
  const {
    flowAnalysisPeriod
  } = settingsWithDefaults;


  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow
        h="75%"

      >
        <DashboardWidget
          name="capacity"
          w={1}
          hideTitlesInDetailView={true}
          render={({view}) => (
            <DimensionWorkBalanceTrendsDetailDashboard
              dimension={"team"}
              instanceKey={key}
              view={view}
              context={context}
              specsOnly={true}
              latestWorkItemEvent={latestWorkItemEvent}
              days={flowAnalysisPeriod}
              measurementWindow={7}
              samplingFrequency={7}
              showContributorDetail={true}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}


export default withViewerContext(dashboard);

import React from "react";
import {ProjectDashboard} from "../projectDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ImplementationCostTableWidget} from "../shared/widgets/implementationCost";
import {injectIntl} from "react-intl";

const dashboard_id = "dashboards.value.projects.dashboard.instance";

function ValueDashboard({
  project: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults},
  context,
  viewerContext,
  intl
}) {
  const {includeSubTasksFlowMetrics} = settingsWithDefaults;

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h="50%" title={``}>
        <DashboardWidget
          w={1}
          name="implementation-cost-table-widget"
          render={({view}) => (
            <ImplementationCostTableWidget
              instanceKey={key}
              days={30}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              context={context}
              view={view}
              intl={intl}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}

const dashboard = ({viewerContext, intl}) => (
  <ProjectDashboard
    pollInterval={1000 * 60}
    render={(props) => <ValueDashboard {...props} viewerContext={viewerContext} intl={intl}/>}
  />
);
export default withViewerContext(injectIntl(dashboard));

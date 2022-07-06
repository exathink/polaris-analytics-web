import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";

const dashboard_id = "dashboards.activity.projects.newFlow.instance";

function NewFlowDashboard({
  project: {key, latestWorkItemEvent, latestCommit, settings, settingsWithDefaults},
  context,
}) {
  const [workItemScope, setWorkItemScope] = useState("all");
  const specsOnly = workItemScope === "specs";

  const {
    leadTimeTarget,
    cycleTimeTarget,
    latencyTarget,
    responseTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    flowAnalysisPeriod,
    wipLimit,
    includeSubTasksFlowMetrics,
    includeSubTasksWipInspector,
  } = settingsWithDefaults;

  return (
    <Dashboard dashboard={`${dashboard_id}`} className={""} gridLayout={true}>
      <DashboardRow>
        <DashboardWidget
          name="first-widget"
          render={() => {
            return <div>New Flow Dashboard</div>;
          }}
        />
      </DashboardRow>
    </Dashboard>
  );
}
export const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60} render={(props) => <NewFlowDashboard {...props} />} />
);
export default withViewerContext(dashboard);

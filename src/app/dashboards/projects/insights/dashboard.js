import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {CycleTimeHealth, LeadTimeHealth} from "./metricHealthComponents";

export function InsightsDashboard({
  project: {key, latestWorkItemEvent, latestCommit, settings, settingsWithDefaults},
  context,
}) {
  const [workItemScope, setWorkItemScope] = React.useState("all");
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

  // if its on-demand insights, it could be very scalable (we can have few insights ready initially)

  return (
    <div className="tw-grid tw-grid-cols-3 tw-gap-2">
      Insights Module
      <CycleTimeHealth target={cycleTimeTarget} value={3} />
      <LeadTimeHealth target={leadTimeTarget} value={35} />
    </div>
  );
}

export const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60} render={(props) => <InsightsDashboard {...props} />} />
);
export default withViewerContext(dashboard);

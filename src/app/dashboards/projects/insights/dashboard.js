import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {getMetricInsight} from "./rules_engine";

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
  const metric = "cycleTime";
  const text = getMetricInsight({metric, target: cycleTimeTarget, value: 3});

  return (
    <div className="">
      Insights Module
      <div>{text}</div>
    </div>
  );
}

export const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60} render={(props) => <InsightsDashboard {...props} />} />
);
export default withViewerContext(dashboard);

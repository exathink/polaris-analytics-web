import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {DaysRangeSlider, SIX_MONTHS} from "../../shared/components/daysRangeSlider/daysRangeSlider";
import {ProjectDashboard} from "../projectDashboard";
import {ResponseTimeHealth} from "./responseTimeHealth";

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
  const [daysRange, setDaysRange] = React.useState(flowAnalysisPeriod);

  return (
    <div className="tw-grid tw-grid-cols-3 tw-gap-2">
      <div className="tw-col-start-2 tw-col-end-4 tw-p-2">
        <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange} range={SIX_MONTHS} />
      </div>
      <ResponseTimeHealth
        dimension={"project"}
        instanceKey={key}
        leadTimeTarget={leadTimeTarget}
        cycleTimeTarget={cycleTimeTarget}
        leadTimeConfidenceTarget={leadTimeConfidenceTarget}
        cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
        days={daysRange}
        measurementWindow={daysRange}
        samplingFrequency={daysRange}
        specsOnly={true}
        includeSubTasks={true}
        latestCommit={latestCommit}
        latestWorkItemEvent={latestWorkItemEvent}
      />
    </div>
  );
}

export const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60} render={(props) => <InsightsDashboard {...props} />} />
);
export default withViewerContext(dashboard);

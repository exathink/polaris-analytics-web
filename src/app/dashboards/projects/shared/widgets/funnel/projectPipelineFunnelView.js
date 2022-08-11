import React from "react";
import {PipelineFunnelChart} from "./pipelineFunnelChart";

export const ProjectPipelineFunnelView = ({
  workItemStateTypeCounts,
  totalEffortByStateType,
  days,
  leadTimeTarget,
  cycleTimeTarget,
  workItemScope,
  setWorkItemScope,
  showVolumeOrEffort,
  view,
  context,
  displayBag
}) => {
  return (
    <div data-testid="project-pipeline-funnel-view" style={{width: "100%", height: "100%"}}>
          <PipelineFunnelChart
            workItemStateTypeCounts={workItemStateTypeCounts}
            totalEffortByStateType={totalEffortByStateType}
            days={days}
            leadTimeTarget={leadTimeTarget}
            cycleTimeTarget={cycleTimeTarget}
            grouping={workItemScope}
            showVolumeOrEffort={showVolumeOrEffort}
            displayBag={displayBag}
          />
    </div>
  );
};








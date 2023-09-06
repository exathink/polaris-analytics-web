import React from "react";
import {PipelineFunnelChart} from "./pipelineFunnelChart";
import {useCustomPhaseMapping} from "../../../projectDashboard";

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
  const customPhaseMapping = useCustomPhaseMapping();

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
            workItemStateTypeDisplayName={customPhaseMapping}
          />
    </div>
  );
};








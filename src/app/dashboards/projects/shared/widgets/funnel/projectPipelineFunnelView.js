import React from "react";
import {PipelineFunnelChart} from "./pipelineFunnelChart";

export const ProjectPipelineFunnelView = ({
  workItemStateTypeCounts,
  totalEffortByStateType,
  days,
  workItemScope,
  setWorkItemScope,
  view,
  context,
}) => {
  return (
    <div data-testid="project-pipeline-funnel-view" style={{width: "100%", height: "100%"}}>
          <PipelineFunnelChart
            workItemStateTypeCounts={workItemStateTypeCounts}
            totalEffortByStateType={totalEffortByStateType}
            days={days}
            title={" "}
            grouping={workItemScope}
          />
    </div>
  );
};








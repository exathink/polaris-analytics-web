import React from "react";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {PipelineFunnelChart} from "./pipelineFunnelChart";
import {Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../components/workItemScopeSelector";

export const ProjectPipelineFunnelView = ({
  workItemStateTypeCounts,
  totalEffortByStateType,
  workItemScope,
  setWorkItemScope,
  view,
  context,
}) => {
  return (
    <VizRow h={"100%"}>
      <VizItem w={1}>
        <div style={{width: "100%", height: "100%"}}>
          <PipelineFunnelChart
            workItemStateTypeCounts={workItemStateTypeCounts}
            totalEffortByStateType={totalEffortByStateType}
            title={" "}
            grouping={workItemScope}
          />
          {setWorkItemScope != null ? (
            <Flex w={1} justify={"center"}>
              <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
            </Flex>
          ) : null}
        </div>
      </VizItem>
    </VizRow>
  );
};








import React from 'react';
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {PipelineFunnelChart} from "./pipelineFunnelChart";
import {Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../components/workItemScopeSelector";

export const ProjectPipelineFunnelView = (
  {
    workItemStateTypeCounts,
    specStateTypeCounts,
    totalEffortByStateType,
    workItemScope,
    setWorkItemScope,
    view,
    context,
  }
) => {


  return (
    <VizRow h={"100%"}>
      <VizItem w={1}>

        <div style={{width: "100%", height: "100%"}}>

          <PipelineFunnelChart
            workItemStateTypeCounts={workItemStateTypeCounts}
            specStateTypeCounts={specStateTypeCounts}
            totalEffortByStateType={totalEffortByStateType}

            title={' '}
            grouping={workItemScope}
          />
          <Flex w={1} justify={'center'}>
            <WorkItemScopeSelector
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
            />
          </Flex>
        </div>

      </VizItem>
    </VizRow>


  )
};








import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {PipelineFunnelChart} from "./pipelineFunnelChart";
import {Flex} from "reflexbox";
import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";

export const ProjectPipelineFunnelView = (
  {
    workItemStateTypeCounts,
    specStateTypeCounts,
    selectedGrouping,
    setSelectedGrouping,
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
            title={'Flow States'}
            grouping={selectedGrouping}
          />
          <Flex w={1} justify={'center'}>
            <GroupingSelector
              label={'Show'}
              groupings={
                [
                  {
                    key: 'all',
                    display: 'All'
                  },
                  {
                    key: 'specs',
                    display: 'Specs'
                  },
                ]
              }
              initialValue={selectedGrouping}
              onGroupingChanged={(selected) => setSelectedGrouping(selected)}
            />
          </Flex>
        </div>

      </VizItem>
    </VizRow>


  )
};








import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {PipelineFunnelChart} from "./pipelineFunnelChart";
import {VizStickerWidget} from "../../../shared/containers/stickers/vizSticker/vizStickerWidget";
import {MostActiveChildrenBarChart} from "../../../shared/views/mostActiveChildren";
import {Flex} from "reflexbox";
import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import {Checkbox} from "antd";

export const ProjectPipelineFunnelView = (
  {
    workItemStateTypeCounts,
    specStateTypeCounts,
    view,
    context,
  }
) => {
  return (
    view === 'primary' ?
      <VizRow h={"100%"}>
        <VizItem w={1}>

          <div style={{width: "100%", height: "100%"}}>

            <PipelineFunnelChart
              workItemStateTypeCounts={workItemStateTypeCounts}
              specStateTypeCounts={specStateTypeCounts}
            />
            <Flex w={1} justify={'center'}>
              <GroupingSelector
                label={'Show'}
                groupings={
                  [

                    {
                      key: 'spec',
                      display: 'Specs'
                    },
                    {
                      key: 'all',
                      display: 'All'
                    },
                  ]
                }
                initialValue={'spec'}
              />
            </Flex>
          </div>

        </VizItem>
      </VizRow>
      :
      <Flex style={{height: "95%"}}>
        <PipelineFunnelChart
          title={'Status'}
          workItemStateTypeCounts={workItemStateTypeCounts}
          specStateTypeCounts={specStateTypeCounts}
        />
      </Flex>

  )
};

export const ProjectPipelineFunnel = withNavigationContext(ProjectPipelineFunnelView);






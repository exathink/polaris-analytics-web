import React from 'react';
import {VizItem} from "../../../shared/containers/layout";
import {WorkItemStateTypeDisplayName} from "../../../shared/config";

import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {Statistic} from "antd";
import {Flex} from "reflexbox";

const WorkItemDetailLayout = (
  {
    instanceKey,
    workItem,
    context,
  }
) => {

  const bgColor = context.color();
  const fontColor = "#ffffff";
  return (
    <div>
      <h2>
        {workItem.displayId}: {workItem.name}
      </h2>

      <Flex auto align='center' justify='left'>
        <VizItem>
          <Statistic
              title="Phase"
              value={WorkItemStateTypeDisplayName[workItem.stateType || 'unmapped']}
              precision={0}
              valueStyle={{color: '#3f8600'}}
              style={{backgroundColor: '#f2f3f6'}}
              />
        </VizItem>
        <VizItem>
          <Statistic
              title="State"
              value={workItem.state|| 0}
              precision={0}
              valueStyle={{color: '#3f8600'}}
              style={{backgroundColor: '#f2f3f6'}}
              />
        </VizItem>

      </Flex>
    </div>
  )
};

export const WorkItemDetailView = withNavigationContext(WorkItemDetailLayout);
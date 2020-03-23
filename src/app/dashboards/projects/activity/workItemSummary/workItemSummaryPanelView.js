import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {VizItem, VizRow} from "../../../shared/containers/layout";


import {Statistic} from "../../../../../app/components/misc/statistic/statistic";

const WorkItemSummaryPanelView = (
  {
    model: {
      open,
      wip,
      complete,
      unmapped
    },
    context,
  }
) => {

  const numUnMapped = unmapped || 0;


  return (
    numUnMapped === 0 ?
      <React.Fragment>
        <VizRow h={"100%"}>
          <VizItem w={0.3}>
            <Statistic
              title="Open"
              value={open || 0}
              precision={0}
              valueStyle={{ color: '#3f8600'}}
              style={{backgroundColor: '#f2f3f6'}}
              suffix={"Work Items"}
            />
          </VizItem>
          <VizItem w={0.3}>
            <Statistic
              title="Wip"
              value={wip || 0}
              precision={0}
              valueStyle={{ color: '#3f8600'}}
              style={{backgroundColor: '#f2f3f6'}}
              suffix={"Work Items"}
            />
          </VizItem>
          <VizItem w={0.4}>
            <Statistic
              title="Code Complete"
              value={complete || 0}
              precision={0}
              valueStyle={{ color: '#3f8600'}}
              style={{backgroundColor: '#f2f3f6'}}
              suffix={"Work Items"}
            />
          </VizItem>
        </VizRow>
      </React.Fragment>
      :
        <React.Fragment>
          <VizRow h={"100%"}>
            <VizItem w={0.5}>
              <Statistic
                title="Total Active"
                value={(open || 0) + (wip || 0) + (complete || 0)}
                precision={0}
                valueStyle={{ color: '#3f8600'}}
                style={{backgroundColor: '#f2f3f6'}}
                suffix={"Work Items"}
              />
            </VizItem>
            <VizItem w={0.5}>
              <Statistic
                title="Unmapped"
                value={unmapped || 0}
                precision={0}
                valueStyle={{ color: '#3f8600'}}
                style={{backgroundColor: '#f2f3f6'}}
                suffix={"Work Items"}
              />
            </VizItem>
          </VizRow>
        </React.Fragment>
  )
};

export const WorkItemSummaryPanel = withNavigationContext(WorkItemSummaryPanelView);






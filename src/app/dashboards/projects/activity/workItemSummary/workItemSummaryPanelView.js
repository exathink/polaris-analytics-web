import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import StickerWidget from '../../../shared/containers/stickers/simpleSticker/sticker-widget';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Topics} from "../../../../meta";
import {findActivityLevel} from "../../../shared/helpers/commitUtils";


import {Statistic} from "../../../../../app/components/misc/statistic/statistic";

const WorkItemSummaryPanelView = (
  {
    model: {
      open,
      wip,
      complete

    },
    context,
  }
) => {

  const bgColor = context.color();
  const fontColor = "#ffffff";
  return (
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
            value={complete}
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






import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import StickerWidget from "../../../shared/containers/stickers/simpleSticker/sticker-widget";
import {Contexts} from "../../../../meta";
import {
  WorkItemColorMap,
  WorkItemIcons,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemTypeDisplayName,
} from "../../../shared/config";
import {HumanizedDateView} from "../../../shared/components/humanizedDateView/humanizedDateView";

export const WorkItemStateView = ({workItem, context, view}) => (
  <React.Fragment>
    <VizRow h={"100%"}>
      <VizItem w={workItem.stateType === 'closed' ? 1 / 2 : 1 / 3}>
        {/* Sticker Widget */}
        <StickerWidget
          number={WorkItemTypeDisplayName[workItem.workItemType]}
          text={workItem.displayId}
          icon={Contexts.work_items.icon}
          fontColor={"#ffffff"}
          bgColor={WorkItemColorMap[workItem.workItemType]}
        />
      </VizItem>
      <VizItem w={workItem.stateType === 'closed' ? 1 / 2 : 1 / 3}>
        {/* Sticker Widget */}
        <StickerWidget
          number={WorkItemStateTypeDisplayName[workItem.stateType || 'unmapped']}
          text={workItem.state}
          icon={WorkItemIcons.phase}
          fontColor={"#ffffff"}
          bgColor={WorkItemStateTypeColor[workItem.stateType || 'unmapped']}

        />
      </VizItem>
      {
        workItem.stateType !== 'closed' &&
          <VizItem w={1 / 3}>
            <HumanizedDateView
              title={'Latest Commit'}
              dateValue={workItem.latestCommit}
              asStatistic={true}
            />
          </VizItem>
      }
    </VizRow>
  </React.Fragment>
);


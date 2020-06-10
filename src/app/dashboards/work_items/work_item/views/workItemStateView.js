import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import StickerWidget from "../../../shared/containers/stickers/simpleSticker/sticker-widget";
import {Contexts} from "../../../../meta";
import {fromNow} from "../../../../helpers/utility";
import {
  WorkItemColorMap,
  WorkItemIcons,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemTypeDisplayName,
} from "../../../shared/config";

export const WorkItemStateView = ({workItem, context, view}) => (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1 / 3}>
          {/* Sticker Widget */}
          <StickerWidget
            number={'Type'}
            text={WorkItemTypeDisplayName[workItem.workItemType]}
            icon={Contexts.work_items.icon}
            fontColor={"#ffffff"}
            bgColor={WorkItemColorMap[workItem.workItemType]}
          />
        </VizItem>
        <VizItem w={1/3}>
          {/* Sticker Widget */}
          <StickerWidget
            number={'Phase'}
            text={WorkItemStateTypeDisplayName[workItem.stateType] || WorkItemStateTypeDisplayName['unmapped']}
            icon={WorkItemIcons.phase}
            fontColor={"#ffffff"}
            bgColor={WorkItemStateTypeColor[workItem.stateType]}

          />
        </VizItem>
        <VizItem w={1/3}>
          {/* Sticker Widget */}
          <StickerWidget
            number={'State'}
            hoverText={`Entered: ${fromNow(workItem.latestWorkItemEvent)}`}
            text={workItem.state}
            icon={WorkItemIcons.state}
            fontColor={"#ffffff"}
            bgColor={WorkItemStateTypeColor[workItem.stateType]}
          />
        </VizItem>

      </VizRow>
    </React.Fragment>
);


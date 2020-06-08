import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import StickerWidget from "../../../shared/containers/stickers/simpleSticker/sticker-widget";
import {Contexts} from "../../../../meta";
import Contributors from "../../../contributors/context";
import {formatCommitDate, fromNow} from "../../../../helpers/utility";
import {
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemIcons
} from "../../../shared/config";

export const WorkItemStateView = ({workItem, context, view}) => (
    <React.Fragment>
      <VizRow h={"100%"}>
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
        <VizItem w={1 / 3}>
          {/* Sticker Widget */}
          <StickerWidget
            number={'Latest Commit'}
            hoverText={workItem.latestCommit && formatCommitDate(workItem.latestCommit)}
            text={workItem.latestCommit ? fromNow(workItem.latestCommit) : 'N/A'}
            icon={'ion-clock'}
            fontColor={"#ffffff"}
            bgColor={Contexts.commits.color}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
);


import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import StickerWidget from '../../../shared/containers/stickers/simpleSticker/sticker-widget';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Contexts, Topics} from "../../../../meta";
import {findActivityLevel} from "../../../shared/helpers/commitUtils";

import {LatestCommitView} from "../../../shared/views/latestCommit/latestCommitView";

const ActivitySummaryPanelView = (
  {
    model: {
      latestCommit,

    },
    context,
  }
) => {

  const bgColor = context.color();
  const fontColor = "#ffffff";
  const activityLevel = findActivityLevel(latestCommit);
  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1 / 2}>
          <StickerWidget
            number={"Status"}
            text={activityLevel.display_name}
            icon={Topics.activity.icon}
            fontColor={fontColor}
            bgColor={activityLevel.color}
          />
        </VizItem>
        <VizItem w={1 / 2}>
          <LatestCommitView
            {...{latestCommit, fontColor, bgColor}}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
  )
};

export const ActivitySummaryPanel = withNavigationContext(ActivitySummaryPanelView);






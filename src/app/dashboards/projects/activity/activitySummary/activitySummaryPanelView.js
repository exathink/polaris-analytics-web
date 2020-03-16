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
      commitCount,
      earliestCommit,
      latestCommit,
      secondaryMeasure
    },
    secondaryMeasureContext,
    context,
  }
) => {

  const bgColor = context.color();
  const fontColor = "#ffffff";
  const activityLevel = findActivityLevel(latestCommit);
  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1 / 4}>
          <StickerWidget
            number={"Status"}
            text={activityLevel.display_name}
            icon={Topics.activity.icon}
            fontColor={fontColor}
            bgColor={activityLevel.color}
          />
        </VizItem>
        <VizItem w={1 / 4}>
          <LatestCommitView
            {...{latestCommit, fontColor, bgColor}}
          />
        </VizItem>
        <VizItem w={1 / 4}>

          {/* Sticker Widget */}
          <StickerWidget
            number={commitCount ? commitCount.toLocaleString() : '0'}
            text={Contexts.commits.display(commitCount)}
            icon="ion-code"
            fontColor={fontColor}
            bgColor={bgColor}
          />

        </VizItem>

        <VizItem w={1 / 4}>
          {/* Sticker Widget */}
          <StickerWidget
            number={secondaryMeasure ? secondaryMeasure.toLocaleString() : '0'}
            text={"Active Contributors"}
            icon={secondaryMeasureContext.icon}
            fontColor={fontColor}
            bgColor={bgColor}
          />

        </VizItem>
      </VizRow>
    </React.Fragment>
  )
};

export const ActivitySummaryPanel = withNavigationContext(ActivitySummaryPanelView);






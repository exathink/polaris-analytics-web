import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import React from 'react';
import StickerWidget from '../../containers/stickers/simpleSticker/sticker-widget';
import {VizItem, VizRow} from "../../containers/layout/index";
import {human_span} from "../../../../helpers/utility";
import {Contexts} from "../../../../meta";
import {Topics} from "../../../../meta";
import {fromNow} from "../../../../helpers/utility";
import {findActivityLevel} from "../../helpers/commitUtils";

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
        <VizItem w={1 / 5}>
          <StickerWidget
            number={"Status"}
            text={activityLevel.display_name}
            icon={Topics.activity.icon}
            fontColor={fontColor}
            bgColor={activityLevel.color}
          />
        </VizItem>
        <VizItem w={1 / 5}>

          {/* Sticker Widget */}
          <StickerWidget
            number={"Latest Commit"}
            text={fromNow(latestCommit)}
            icon="ion-clock"
            fontColor={fontColor}
            bgColor={bgColor}
          />

        </VizItem>
        <VizItem w={1 / 5}>

          {/* Sticker Widget */}
          <StickerWidget
            number={commitCount ? commitCount.toLocaleString() : '0'}
            text={Contexts.commits.display(commitCount)}
            icon="ion-code"
            fontColor={fontColor}
            bgColor={bgColor}
          />

        </VizItem>

        <VizItem w={1 / 5}>
          {/* Sticker Widget */}
          <StickerWidget
            number={secondaryMeasure ? secondaryMeasure.toLocaleString() : '0'}
            text={secondaryMeasureContext.display(secondaryMeasure)}
            icon={secondaryMeasureContext.icon}
            fontColor={fontColor}
            bgColor={bgColor}
          />

        </VizItem>
        <VizItem w={1 / 5}>
          {/* Sticker Widget */}
          <StickerWidget
            number={'History'}
            text={earliestCommit && latestCommit ? human_span(latestCommit, earliestCommit) : 'N/A'}
            icon="ion-clock"
            fontColor={fontColor}
            bgColor={bgColor}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
  )
};

export const ActivitySummaryPanel = withNavigationContext(ActivitySummaryPanelView);






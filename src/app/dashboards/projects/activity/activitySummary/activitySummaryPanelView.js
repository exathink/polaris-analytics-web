import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {StickerIcon} from '../../../shared/containers/stickers/simpleSticker/sticker-widget';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Topics} from "../../../../meta";
import {findActivityLevel} from "../../../shared/helpers/commitUtils";

import {HumanizedDateView} from "../../../shared/components/humanizedDateView/humanizedDateView";
import {Statistic} from "antd";

const ActivitySummaryPanelView = (
  {
    model: {
      contributorCount,
      latestCommit
    },
    days,
    context,
  }
) => {

  const bgColor = context.color();
  const fontColor = "#ffffff";
  const activityLevel = findActivityLevel(latestCommit);
  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={0.15}>
          <StickerIcon
            icon={Topics.activity.icon}
            fontColor={fontColor}
            bgColor={activityLevel.color}
          />
        </VizItem>
        <VizItem w={0.25}>
          <Statistic
              title={<span>{'Contributors'}</span>}
              value={contributorCount}
              precision={0}
              valueStyle={{ color: '#3f8600'}}

            />
        </VizItem>
        <VizItem w={0.25}>
          <HumanizedDateView
            asStatistic={true}
            title={'Latest Closed'}
            dateValue={latestCommit}
            {...{fontColor, bgColor}}
          />
        </VizItem>
        <VizItem w={0.25}>
          <HumanizedDateView
            asStatistic={true}
            title={'Latest Commit'}
            dateValue={latestCommit}
            {...{fontColor, bgColor}}
          />
        </VizItem>

      </VizRow>
    </React.Fragment>
  )
};

export const ActivitySummaryPanel = withNavigationContext(ActivitySummaryPanelView);






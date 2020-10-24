import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import StickerWidget from '../../../shared/containers/stickers/simpleSticker/sticker-widget';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Topics} from "../../../../meta";
import {findActivityLevel} from "../../../shared/helpers/commitUtils";

import {HumanizedDateView} from "../../../shared/components/humanizedDateView/humanizedDateView";
import {Statistic} from "antd";
import {PROJECTS_FLOWBOARD_20} from "../../../../../config/featureFlags";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";

const ActivitySummaryPanelView = withViewerContext((
  {
    model: {
      contributorCount,

    },
    latestCommit,
    days,
    context,
    viewerContext
  }
) => {

  const bgColor = context.color();
  const fontColor = "#ffffff";
  const activityLevel = findActivityLevel(latestCommit);
  return (

    viewerContext.isFeatureFlagActive(PROJECTS_FLOWBOARD_20) ?
      <React.Fragment>
        <VizRow h={"100%"}>

          <VizItem w={1}>
            <Statistic
              title={<span>{'Contributors'}</span>}
              value={contributorCount}
              precision={0}
              valueStyle={{color: '#3f8600'}}

            />
          </VizItem>
        </VizRow>
      </React.Fragment>
      :
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
});

export const ActivitySummaryPanel = withNavigationContext(ActivitySummaryPanelView);






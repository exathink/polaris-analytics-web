import React from 'react';
import {withModel} from "../../../viz/withModel";
import {ActivityLevelDetailModel} from "./model";
import {TotalsBarChart} from "./components";
import {VizRow, VizItem} from "../../containers/layout";
import {VizStickerWidget} from "../../../containers/widgets/vizSticker/vizStickerWidget";

import Icons from "../../../helpers/icons";

export const ActivityLevelSummaryView = withModel(ActivityLevelDetailModel)(
  props => {
    return (
      <React.Fragment>
        <VizRow h={"100%"}>
          <VizItem w={1}>

            {/* Sticker Widget */}
            <VizStickerWidget
              icon={Icons.contexts[props.model.level_label.toLowerCase()]}
              fontColor="#ffffff"
              bgColor={props.context.color()}
              text={props.model ? `${props.model.subject_label_long}s` : null}
              number={props.model ? props.model.data.length : null}
            >
              <TotalsBarChart orientation={'horizontal'} chartBackgroundColor="#f2f3f6" {...props}/>
            </VizStickerWidget>

          </VizItem>


        </VizRow>
      </React.Fragment>
    );
  });
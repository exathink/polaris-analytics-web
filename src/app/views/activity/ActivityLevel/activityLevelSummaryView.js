import React from 'react';
import {withModel} from "../../../viz/withModel";
import {ActivityLevelDetailModel} from "./model";
import {TotalsBarChart} from "./components";
import {VizRow, VizItem} from "../../containers/layout";
import {VizStickerWidget} from "../../../containers/widgets/vizSticker/vizStickerWidget";


export const ActivityLevelSummaryView = withModel(ActivityLevelDetailModel)(
  props => {
    const {data, childContext} = props.model;
    return (
      <React.Fragment>
        <VizRow h={"100%"}>
          <VizItem w={1}>

            {/* Sticker Widget */}
            <VizStickerWidget
              icon={props.model.childContext.icon}
              fontColor="#ffffff"
              bgColor={props.context.color()}
              text={childContext && data ? props.model.childContext.display(data.length) : null}
              number={props.model ? data.length : null}
            >
              <TotalsBarChart orientation={'horizontal'} chartBackgroundColor="#f2f3f6" {...props}/>
            </VizStickerWidget>

          </VizItem>


        </VizRow>
      </React.Fragment>
    );
  });
import React from 'react';
import {ActivityProfileBarChart} from "./components/index";
import {VizItem, VizRow} from "../../containers/layout/index";
import {VizStickerWidget} from "../../containers/widgets/vizSticker/vizStickerWidget";


export const ActivityLevelSummaryView = (
  props => {
    const {data, context, childContext} = props.model;
    return (
      <React.Fragment>
        <VizRow h={"100%"}>
          <VizItem w={1}>

            {/* Sticker Widget */}
            <VizStickerWidget
              icon={props.model.childContext.icon}
              fontColor="#ffffff"
              bgColor={context.color()}
              text={childContext && data ? props.model.childContext.display(data.length) : null}
              number={props.model ? data.length : null}
              {...(props.headerWidth? {width:props.headerWidth} : {})}
            >
              <ActivityProfileBarChart orientation={'horizontal'} chartBackgroundColor="#f2f3f6" {...props}/>
            </VizStickerWidget>

          </VizItem>


        </VizRow>
      </React.Fragment>
    );
  });

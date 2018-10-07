import React from 'react';
import {MostActiveChildrenBarChart} from './mostActiveChildrenBarChart';
import {VizItem, VizRow} from "../../containers/layout";
import {VizStickerWidget} from "../../containers/stickers/vizSticker/vizStickerWidget";


export const MostActiveChildrenSummaryView = (props) => (
  <React.Fragment>
    <VizRow h={"100%"}>
      <VizItem w={1}>
        <VizStickerWidget
          bgColor={props.context.color()}
          showHeader={false}
        >

          < MostActiveChildrenBarChart {...props} />
        </VizStickerWidget>
      </VizItem>
    </VizRow>
  </React.Fragment>
)

export const MostActiveChildrenView = props => (
  props.view === 'detail'?
    <MostActiveChildrenBarChart {...props} />
    : <MostActiveChildrenSummaryView {...props} />
)
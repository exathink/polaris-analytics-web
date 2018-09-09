import React from 'react';
import {MostActiveChildrenBarChart} from './mostActiveChildrenBarChart';
import {VizItem, VizRow} from "../../containers/layout";
import {VizStickerWidget} from "../../containers/stickers/vizSticker/vizStickerWidget";


export const MostActiveChildrenSummaryView = ({
  context,
  childContext,
  ...rest
}) => (
  <React.Fragment>
    <VizRow h={"100%"}>
      <VizItem w={1}>
        <VizStickerWidget
          bgColor={context.color()}
          showHeader={false}
        >

          < MostActiveChildrenBarChart {...rest} />
        </VizStickerWidget>
      </VizItem>
    </VizRow>
  </React.Fragment>
)

export const MostActiveChildrenView = props => (
  props.view == 'detail'?
    <MostActiveChildrenBarChart {...props} />
    : <MostActiveChildrenSummaryView {...props} />
)
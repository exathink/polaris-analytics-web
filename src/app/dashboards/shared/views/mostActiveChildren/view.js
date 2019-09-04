import React from 'react';
import {MostActiveChildrenBarChart} from './mostActiveChildrenBarChart';
import {VizItem, VizRow} from "../../containers/layout";
import {VizStickerWidget} from "../../containers/stickers/vizSticker/vizStickerWidget";
import {Box, Flex} from 'reflexbox';
import {DaysRangeSlider} from "../../components/daysRangeSlider/daysRangeSlider";


export const MostActiveChildrenSummaryView = (props) => (

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
)

export const MostActiveChildrenDetailView = (props) => {
  const {days, setDaysRange} = props;
  return (
    <Flex column style={{height: "100%", width: "100%"}}>
      <Flex pl={1} pt={2} pb={2} pr={10} align='center' style={{height: "5%"}}>
        <Box w={"35%"}>
          <DaysRangeSlider initialDays={days} setDaysRange={setDaysRange}/>
        </Box>
      </Flex>
      <Flex style={{height: "95%"}}>
        < MostActiveChildrenBarChart {...props} />
      </Flex>
    </Flex>
  )
}

export const MostActiveChildrenView = props => (
  props.view === 'detail' ?
    <MostActiveChildrenDetailView {...props} />
    : <MostActiveChildrenSummaryView {...props} />
)
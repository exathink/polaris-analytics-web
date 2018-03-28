import React from 'react';
import {ActivitySummaryBubbleChart} from "../components";
import {VizItem, VizRow} from "../../containers/layout";
import {TotalsBarChart} from "../components";

export const ActivitySummaryMinView = (props) => (
  <React.Fragment>
    <VizRow h={"100%"}>
      <VizItem w={0.07}>
        <TotalsBarChart minimized={true} {...props}/>
      </VizItem>
      <VizItem w={0.63}>
        <ActivitySummaryBubbleChart minimized={true} {...props}/>
      </VizItem>
      <VizItem w={0.30}></VizItem>
    </VizRow>
  </React.Fragment>
);
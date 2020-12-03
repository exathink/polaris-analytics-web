import React from "react";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {StateMapPackedBubbleChart} from "./stateMapPackedBubbleChart";

export const StateMapPackedBubbleView = ({stateMap, view, context}) => {
  return (
    <VizRow h={"100%"}>
      <VizItem w={1}>
        <div style={{width: "100%", height: "100%"}}>
          <StateMapPackedBubbleChart stateMap={stateMap} view={view} context={context} title={" "} />
        </div>
      </VizItem>
    </VizRow>
  );
};

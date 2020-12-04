import React from "react";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {StateMapPackedBubbleChart} from "./stateMapPackedBubbleChart";


export const StateMapPackedBubbleView = ({initialStateTypeMapping, view, context}) => {
  const [draftState, setDraftState] = React.useState({});
  // console.log(draftState); // this draftState captures all the changes.
  return (
    <VizRow h={"100%"}>
      <VizItem w={1}>
        <div style={{width: "100%", height: "100%"}}>
          <StateMapPackedBubbleChart
            initialStateTypeMapping={initialStateTypeMapping}
            setDraftState={setDraftState}
            view={view}
            context={context}
            title={" "}
          />
        </div>
      </VizItem>
    </VizRow>
  );
};

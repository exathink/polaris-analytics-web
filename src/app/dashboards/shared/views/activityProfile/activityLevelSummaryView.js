import React from "react";
import {ActivityProfileBarChart} from "./components/index";
import {VizItem, VizRow} from "../../containers/layout/index";

export const ActivityLevelSummaryView = (props) => {

  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1}>
          {/* Sticker Widget */}

          <ActivityProfileBarChart orientation={"horizontal"} chartBackgroundColor="#f2f3f6" {...props} />
        </VizItem>
      </VizRow>
    </React.Fragment>
  );
};

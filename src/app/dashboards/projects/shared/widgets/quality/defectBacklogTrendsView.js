import React from "react";
import {DefectBacklogTrendsChart} from "./defectBacklogTrendsChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {DefectBacklogTrendsDetailDashboard} from "./defectBacklogTrendsDetailDashboard";

export const DefectBacklogTrendsView = ({
  instanceKey,
  backlogTrends,
  measurementPeriod,
  measurementWindow,
  samplingFrequency,
  view,
}) => {
  if (view === "detail") {
    const props = {
      instanceKey,
      measurementPeriod,
      measurementWindow,
      samplingFrequency,
    };
    return <DefectBacklogTrendsDetailDashboard {...props} />;
  }

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <DefectBacklogTrendsChart
          backlogTrends={backlogTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          view={view}
        />
      </VizItem>
    </VizRow>
  );
};

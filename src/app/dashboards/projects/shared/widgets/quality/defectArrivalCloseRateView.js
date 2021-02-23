import React from "react";
import {DefectArrivalCloseRateChart} from "./defectArrivalCloseRateChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {DefectArrivalCloseRateDetailDashboard} from "./defectArrivalCloseRateDetailDashboard";

export const DefectArrivalCloseRateView = ({
  instanceKey,
  days,
  flowRateTrends,
  measurementPeriod,
  measurementWindow,
  samplingFrequency,
  view,
}) => {
  if (view === "detail") {
    const props = {
      instanceKey,
      days,
      measurementWindow,
      samplingFrequency,
    };
    return <DefectArrivalCloseRateDetailDashboard {...props} />;
  }

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <DefectArrivalCloseRateChart
          flowRateTrends={flowRateTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          view={view}
        />
      </VizItem>
    </VizRow>
  );
};

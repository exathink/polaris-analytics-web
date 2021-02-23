import React from "react";
import {DefectResponseTimeChart} from "./defectResponseTimeChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {DefectResponseTimeDetailDashboard} from "./defectResponseTimeDetailDashboard";

export const DefectResponseTimeView = ({
  instanceKey,
  days,
  flowMetricsTrends,
  measurementPeriod,
  measurementWindow,
  samplingFrequency,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
  view,
}) => {
  if (view === "detail") {
    const props = {
      instanceKey,
      days,
      measurementWindow,
      samplingFrequency,
      leadTimeConfidenceTarget,
      cycleTimeConfidenceTarget,
    };
    return <DefectResponseTimeDetailDashboard {...props} />;
  }

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <DefectResponseTimeChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          view={view}
        />
      </VizItem>
    </VizRow>
  );
};

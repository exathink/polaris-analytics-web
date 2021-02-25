import React from "react";
import {DefectResponseTimeChart} from "./defectResponseTimeChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {DefectResponseTimeDetailDashboard} from "./defectResponseTimeDetailDashboard";

export const DefectResponseTimeView = ({
  instanceKey,
  flowMetricsTrends,
  measurementPeriod,
  measurementWindow,
  samplingFrequency,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
  cycleTimeTarget,
  view,
}) => {
  if (view === "detail") {
    const props = {
      instanceKey,
      measurementPeriod,
      measurementWindow,
      samplingFrequency,
      leadTimeConfidenceTarget,
      cycleTimeConfidenceTarget,
      cycleTimeTarget,
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
          cycleTimeTarget={cycleTimeTarget}
          view={view}
        />
      </VizItem>
    </VizRow>
  );
};

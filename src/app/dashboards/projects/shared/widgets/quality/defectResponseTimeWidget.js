import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../components/graphql/utils";

import {useQueryProjectFlowMetricsTrends} from "../../hooks/useQueryProjectFlowMetricsTrends";
import {DefectResponseTimeView} from "./defectResponseTimeView";

export const DefectResponseTimeWidget = ({
  instanceKey,
  view,
  days,
  measurementWindow,
  samplingFrequency,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
}) => {
  const {loading, error, data} = useQueryProjectFlowMetricsTrends({
    instanceKey: instanceKey,
    days: days,
    measurementWindow: measurementWindow,
    samplingFrequency: samplingFrequency,
    leadTimeTargetPercentile: leadTimeConfidenceTarget,
    cycleTimeTargetPercentile: cycleTimeConfidenceTarget,
    defectsOnly: true,
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("DefectResponseTimeWidget.useQueryProjectFlowMetricsTrends", error);
    return null;
  }

  const {cycleMetricsTrends: flowMetricsTrends} = data["project"];

  return (
    <DefectResponseTimeView
      instanceKey={instanceKey}
      flowMetricsTrends={flowMetricsTrends}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      samplingFrequency={samplingFrequency}
      leadTimeConfidenceTarget={leadTimeConfidenceTarget}
      cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
      view={view}
    />
  );
};

import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";

import {useQueryDimensionFlowMetricsTrends} from "../../hooks/useQueryDimensionFlowMetricsTrends";
import {DefectResponseTimeView} from "./defectResponseTimeView";

export const DimensionDefectResponseTimeWidget = ({
  dimension,
  instanceKey,
  view,
  days,
  measurementWindow,
  samplingFrequency,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
  cycleTimeTarget,
  tags,
  release
}) => {
  const {loading, error, data} = useQueryDimensionFlowMetricsTrends({
    dimension,
    instanceKey,
    tags,
    release,
    days,
    measurementWindow,
    samplingFrequency,
    leadTimeTargetPercentile: leadTimeConfidenceTarget,
    cycleTimeTargetPercentile: cycleTimeConfidenceTarget,
    defectsOnly: true,
    specsOnly: true,
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("DimensionDefectResponseTimeWidget.useQueryDimensionFlowMetricsTrends", error);
    return null;
  }

  const {cycleMetricsTrends: flowMetricsTrends} = data[dimension];

  return (
    <DefectResponseTimeView
      instanceKey={instanceKey}
      flowMetricsTrends={flowMetricsTrends}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      samplingFrequency={samplingFrequency}
      leadTimeConfidenceTarget={leadTimeConfidenceTarget}
      cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
      cycleTimeTarget={cycleTimeTarget}
      view={view}
    />
  );
};

import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../components/graphql/utils";

import {useQueryProjectFlowRateTrends} from "../../hooks/useQueryProjectFlowRateTrends";
import {DefectArrivalCloseRateView} from "./defectArrivalCloseRateView";

export const DefectArrivalCloseRateWidget = ({instanceKey, view, days, measurementWindow, samplingFrequency, release, tags}) => {
  const {loading, error, data} = useQueryProjectFlowRateTrends({
    instanceKey: instanceKey,
    days: days,
    measurementWindow: measurementWindow,
    samplingFrequency: samplingFrequency,
    defectsOnly: true,
    release: release,
    tags: tags
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("DefectArrivalCloseRateWidget.useQueryProjectFlowRateTrends", error);
    return null;
  }

  const {flowRateTrends} = data["project"];

  return (
    <DefectArrivalCloseRateView
      instanceKey={instanceKey}
      flowRateTrends={flowRateTrends}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      samplingFrequency={samplingFrequency}
      view={view}
    />
  );
};

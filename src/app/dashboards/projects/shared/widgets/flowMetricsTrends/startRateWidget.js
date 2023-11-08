import {Loading} from "../../../../../components/graphql/loading";
import React from "react";
import {getReferenceString} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import { StartRateView } from "./startRateView";
import { useQueryDimensionArrivalDepartureTrends } from "../../../../shared/widgets/work_items/hooks/useQueryDimensionArrivalDepartureTrends";
import { useQueryDimensionFlowMetricsTrends } from "../../../../shared/widgets/work_items/hooks/useQueryDimensionFlowMetricsTrends";

export const StartRateWidget = ({
  dimension,
  instanceKey,
  tags,
  release,
  displayBag,
  days,
  measurementWindow,
  samplingFrequency,
  flowAnalysisPeriod,
  specsOnly,
  latestCommit,
  latestWorkItemEvent,
  targetPercentile,
  includeSubTasks,
}) => {
  const {loading, error, data} = useQueryDimensionArrivalDepartureTrends({
    dimension,
    instanceKey,
    tags,
    release,
    days,
    measurementWindow,
    samplingFrequency,
    specsOnly,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent),
  });

  const {loading: loading1, error: error1, data: data1} = useQueryDimensionFlowMetricsTrends({
    dimension,
    instanceKey,
    tags,
    release,
    days: days,
    measurementWindow: measurementWindow,
    samplingFrequency: samplingFrequency,
    targetPercentile,
    includeSubTasks,
    specsOnly,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent),
  });

  if (loading || loading1) return <Loading />;
  if (error) {
    logGraphQlError("StartRateWidget.useQueryDimensionStartRateTrends", error);
    return null;
  }
  if (error1) {
    logGraphQlError("StartRateWidget.useQueryDimensionFlowMetricsTrends", error1);
    return null;
  }

  const {displayType, iconsShiftLeft, ...displayProps} = displayBag;
  const {arrivalDepartureTrends} = data[dimension];
  const {cycleMetricsTrends} = data1[dimension];

  return (
    <StartRateView
      arrivalDepartureTrends={arrivalDepartureTrends}
      cycleMetricsTrends={cycleMetricsTrends}
      displayType={displayType}
      displayProps={displayProps}
      flowAnalysisPeriod={flowAnalysisPeriod}
      specsOnly={specsOnly}
    />
  );
};

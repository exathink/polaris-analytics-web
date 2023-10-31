import {Loading} from "../../../../../components/graphql/loading";
import React from "react";
import {getReferenceString} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import { StartRateView } from "./startRateView";
import { useQueryDimensionStartRateTrends } from "../../../../shared/widgets/work_items/hooks/useQueryDimensionStartRateTrends";

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
}) => {
  const {loading, error, data} = useQueryDimensionStartRateTrends({
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
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("StartRateWidget.useQueryDimensionStartRateTrends", error);
    return null;
  }

  const {metric, displayType, iconsShiftLeft, ...displayProps} = displayBag;
  const {arrivalDepartureTrends} = data[dimension];

  return (
    <StartRateView
      arrivalDepartureTrends={arrivalDepartureTrends}
      displayType={displayType}
      displayProps={displayProps}
      flowAnalysisPeriod={flowAnalysisPeriod}
      specsOnly={specsOnly}
    />
  );
};

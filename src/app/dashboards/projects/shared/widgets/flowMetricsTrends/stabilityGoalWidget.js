/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */
import { getReferenceString, percentileToText } from "../../../../../helpers/utility";
import {
  useQueryDimensionFlowMetricsTrends
} from "../../../../shared/widgets/work_items/hooks/useQueryDimensionFlowMetricsTrends";
import { Loading } from "../../../../../components/graphql/loading";
import { logGraphQlError } from "../../../../../components/graphql/utils";
import React from "react";
import { PercentileCycleTime } from "../../../../shared/components/flowStatistics/flowStatistics";

export const StabilityGoalWidget = ({
  dimension,
  instanceKey,
  tags,
  release,
  displayBag,
  days,
  measurementWindow,
  samplingFrequency,
  cycleTimeTarget,
  cycleTimeConfidenceTarget,
  flowAnalysisPeriod,
  specsOnly,
  latestCommit,
  latestWorkItemEvent,
  targetPercentile,
  includeSubTasks,
}) => {
  const {loading, error, data} = useQueryDimensionFlowMetricsTrends({
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
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("StabilityGoalsWidget.useQueryFlowMetricsTrends", error);
    return null;
  }

  const {cycleMetricsTrends} = data[dimension];
  const current = cycleMetricsTrends[0]
  const previous = cycleMetricsTrends[1]

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-text-2xl tw-text-gray-300">
        <div className="tw-flex tw-justify-start">{"Stability Goal"}</div>
        <div className="tw-flex tw-justify-start tw-text-xl">{`${percentileToText(cycleTimeConfidenceTarget)} Cycle Time <= ${cycleTimeTarget} Days`}</div>
        <div className="tw-flex tw-justify-start tw-text-xl">
          <PercentileCycleTime
            title={"Actual "}
            previousMeasurement={previous}
            currentMeasurement={current}
            target={cycleTimeTarget}
            targetPercentile={cycleTimeConfidenceTarget}
            displayType={'inlinerender'}
          />
        </div>
    </div>
  );
};
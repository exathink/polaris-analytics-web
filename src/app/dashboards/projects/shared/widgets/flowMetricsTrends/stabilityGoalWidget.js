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
import { PercentileCycleTime, PercentileLeadTime } from "../../../../shared/components/flowStatistics/flowStatistics";
import { METRICS } from "../../../../shared/widgets/configure/projectResponseTimeSLASettings/constants";

export const StabilityGoalWidget = ({
  dimension,
  instanceKey,
  tags,
  release,
  displayBag,
  days,
  measurementWindow,
  samplingFrequency,
  metric=METRICS.CYCLE_TIME,
  cycleTimeTarget,
  cycleTimeConfidenceTarget,
  leadTimeTarget,
  leadTimeConfidenceTarget,
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
    leadTimeTargetPercentile: leadTimeConfidenceTarget || 1,
    cycleTimeTargetPercentile: cycleTimeConfidenceTarget || 1,
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
      {
        metric === METRICS.CYCLE_TIME?
        <>
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
        </>
          :
          <>
            <div className="tw-flex tw-justify-start tw-text-xl">{`${percentileToText(cycleTimeConfidenceTarget)} Lead Time <= ${leadTimeTarget} Days`}</div>
            <div className="tw-flex tw-justify-start tw-text-xl">
              <PercentileLeadTime
                title={"Actual "}
                previousMeasurement={previous}
                currentMeasurement={current}
                target={leadTimeTarget}
                targetPercentile={leadTimeConfidenceTarget}
                displayType={'inlinerender'}
              />
            </div>
          </>
      }
    </div>
  );
};
import React from "react";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {
  FlowStatistic,
  PercentileCycleTime,
  PercentileLeadTime,
} from "../../../../shared/components/flowStatistics/flowStatistics";
import {TrendIndicator} from "../../../../../components/misc/statistic/statistic";
import {percentileToText} from "../../../../../helpers/utility";
import {useGenerateTicks} from "../../../../shared/hooks/useGenerateTicks";

const CycleTimeAndLeadTimeSLA = ({
  responseTimeConfidenceTrends,
  cycleMetricsTrends,
  leadTimeTarget,
  cycleTimeTarget,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
}) => {
  const [current, previous] = responseTimeConfidenceTrends;
  const [currentCycleMetrics, previousCycleMetrics] = cycleMetricsTrends;
  const tick = useGenerateTicks(4, 5000);

  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={0.6}>
          {tick < 2 ? (
            <FlowStatistic
              title={
                <span>
                  {"CycleTime"}
                  <sup>{percentileToText(cycleTimeConfidenceTarget)} Target</sup>
                </span>
              }
              currentMeasurement={current}
              previousMeasurement={previous}
              metric={"cycleTimeTarget"}
              uom={"Days"}
            />
          ) : (
            <FlowStatistic
              title={
                <span>
                  {"LeadTime"}
                  <sup>{percentileToText(leadTimeConfidenceTarget)} Target</sup>
                </span>
              }
              currentMeasurement={current}
              previousMeasurement={previous}
              metric={"leadTimeTarget"}
              uom={"Days"}
            />
          )}
        </VizItem>
        <VizItem w={0.4}>
          {
            [
              <PercentileCycleTime
                title={"Actual"}
                currentMeasurement={currentCycleMetrics}
                previousMeasurement={previousCycleMetrics}
                target={cycleTimeTarget}
                targetPercentile={cycleTimeConfidenceTarget}
              />,

              <FlowStatistic
                title={<span>{"% at Target"}</span>}
                currentValue={current["cycleTimeConfidence"] * 100}
                previousValue={previous["cycleTimeConfidence"] * 100}
                uom={"%"}
                precision={2}
                target={cycleTimeConfidenceTarget * 100}
                good={TrendIndicator.isPositive}
              />,
              <PercentileLeadTime
                title={"Actual"}
                currentMeasurement={currentCycleMetrics}
                previousMeasurement={previousCycleMetrics}
                target={leadTimeTarget}
                targetPercentile={leadTimeConfidenceTarget}
              />,
              <FlowStatistic
                title={<span>{"% at Target"}</span>}
                currentValue={current["leadTimeConfidence"] * 100}
                previousValue={previous["leadTimeConfidence"] * 100}
                uom={"%"}
                precision={2}
                target={leadTimeConfidenceTarget}
                good={TrendIndicator.isPositive}
              />,
            ][tick]
          }
        </VizItem>
      </VizRow>
    </React.Fragment>
  );
};

const CycleTimeSLA = ({
  responseTimeConfidenceTrends,
  cycleMetricsTrends,
  cycleTimeTarget,
  cycleTimeConfidenceTarget,
}) => {
  const [current, previous] = responseTimeConfidenceTrends;
  const [currentCycleMetrics, previousCycleMetrics] = cycleMetricsTrends;


  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={0.4}>
          <FlowStatistic
            title={
              <span>
                {"Target "}
                <sup>{percentileToText(cycleTimeConfidenceTarget)}</sup>
              </span>
            }
            currentMeasurement={current}
            previousMeasurement={previous}
            metric={"cycleTimeTarget"}
            uom={"Days"}
          />
        </VizItem>
        <VizItem w={0.6}>
          <PercentileCycleTime
            title={"Actual"}
            currentMeasurement={currentCycleMetrics}
            previousMeasurement={previousCycleMetrics}
            target={cycleTimeTarget}
            targetPercentile={cycleTimeConfidenceTarget}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
  );
};

const LeadTimeSLA = ({responseTimeConfidenceTrends, cycleMetricsTrends, leadTimeTarget, leadTimeConfidenceTarget}) => {
  const [current, previous] = responseTimeConfidenceTrends;
  const [currentCycleMetrics, previousCycleMetrics] = cycleMetricsTrends;


  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={0.6}>
          <FlowStatistic
            title={
              <span>
                {"Target "}
                <sup>{percentileToText(leadTimeConfidenceTarget)}</sup>
              </span>
            }
            currentMeasurement={current}
            previousMeasurement={previous}
            metric={"leadTimeTarget"}
            uom={"Days"}
          />
        </VizItem>
        <VizItem w={0.4}>
          <PercentileLeadTime
            title={"Actual"}
            currentMeasurement={currentCycleMetrics}
            previousMeasurement={previousCycleMetrics}
            target={leadTimeTarget}
            targetPercentile={leadTimeConfidenceTarget}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
  );
};

export const ProjectResponseTimeSLAView = ({
  metric,
  responseTimeConfidenceTrends,
  cycleMetricsTrends,
  leadTimeTarget,
  cycleTimeTarget,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
}) => {
  return metric === "cycleTime" ? (
    <CycleTimeSLA
      {...{
        responseTimeConfidenceTrends,
        cycleMetricsTrends,
        cycleTimeTarget,
        cycleTimeConfidenceTarget,
      }}
    />
  ) : metric === "leadTime" ? (
    <LeadTimeSLA
      {...{
        responseTimeConfidenceTrends,
        cycleMetricsTrends,
        leadTimeTarget,
        leadTimeConfidenceTarget,
      }}
    />
  ) : (
    <CycleTimeAndLeadTimeSLA
      {...{
        responseTimeConfidenceTrends,
        cycleMetricsTrends,
        leadTimeTarget,
        cycleTimeTarget,
        leadTimeConfidenceTarget,
        cycleTimeConfidenceTarget,
      }}
    />
  );
};
import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {
  FlowStatistic,
  PercentileCycleTime,
  PercentileLeadTime
} from "../../../shared/components/flowStatistics/flowStatistics";
import {TrendIndicator} from "../../../../components/misc/statistic/statistic";
import {percentileToText} from "../../../../helpers/utility";
import {useGenerateTicks} from "../../../shared/hooks/useGenerateTicks";

export const ProjectResponseTimeSLAView = (
  {
    responseTimeConfidenceTrends,
    cycleMetricsTrends,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget
  }
) => {

  const [current, previous] = responseTimeConfidenceTrends;

  // cycle metrics trends are still being returned in descending order.
  const [currentCycleMetrics, previousCycleMetrics] = cycleMetricsTrends;
  const tick = useGenerateTicks(4, 5000);



  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={0.6}>
          {
              tick < 2 ?
              <FlowStatistic
                title={<span>{'CycleTime'}<sup>{percentileToText(cycleTimeConfidenceTarget)} Target</sup></span>}
                currentCycleMetrics={current}
                previousCycleMetrics={previous}
                metric={'cycleTimeTarget'}
                uom={'Days'}

              />
              :
              <FlowStatistic
                title={<span>{'LeadTime'}<sup>{percentileToText(leadTimeConfidenceTarget)} Target</sup></span>}
                currentCycleMetrics={current}
                previousCycleMetrics={previous}
                metric={'leadTimeTarget'}
                uom={'Days'}

              />
          }
        </VizItem>
        <VizItem w={0.4}>
          {
            [
              <PercentileCycleTime
                title={'Actual'}
                currentCycleMetrics={currentCycleMetrics}
                previousCycleMetrics={previousCycleMetrics}
                target={cycleTimeTarget}
                targetPercentile={cycleTimeConfidenceTarget}
              />,

              <FlowStatistic
                title={<span>{'% at Target'}</span>}
                currentCycleMetrics={current}
                previousCycleMetrics={previous}
                metric={'cycleTimeConfidence'}
                display={value => value * 100}
                uom={'%'}
                precision={2}
                target={cycleTimeConfidenceTarget}
                good={TrendIndicator.isPositive}

              />,
              <PercentileLeadTime
                title={'Actual'}
                currentCycleMetrics={currentCycleMetrics}
                previousCycleMetrics={previousCycleMetrics}
                target={leadTimeTarget}
                targetPercentile={leadTimeConfidenceTarget}
              />,
              <FlowStatistic
                title={<span>{'% at Target'}</span>}
                currentCycleMetrics={current}
                previousCycleMetrics={previous}
                metric={'leadTimeConfidence'}
                display={value => value * 100}
                uom={'%'}
                precision={2}
                target={leadTimeConfidenceTarget}
                good={TrendIndicator.isPositive}

              />,
            ][tick]
          }
        </VizItem>
      </VizRow>
    </React.Fragment>
  )
};
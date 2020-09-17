import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {FlowStatistic} from "../../../shared/components/flowStatistics/flowStatistics";
import {TrendIndicator} from "../../../../components/misc/statistic/statistic";
import {percentileToText} from "../../../../helpers/utility";

export const ProjectPredictabilityView = (
  {
    responseTimeConfidenceTrends,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget
  }
) => {
  const current = responseTimeConfidenceTrends[0]
  const previous = responseTimeConfidenceTrends[1]
  return (
    <React.Fragment>
      <VizRow h={"100%"}>

        <VizItem w={0.6}>
          <FlowStatistic
            title={<span>{'CycleTime'}<sup>{percentileToText(cycleTimeConfidenceTarget)} Target</sup></span>}
            currentCycleMetrics={current}
            previousCycleMetrics={previous}
            metric={'cycleTimeTarget'}
            uom={'Days'}
            good={TrendIndicator.isNegative}
          />
        </VizItem>
        <VizItem w={0.4}>
          <FlowStatistic
            title={<span>{'Confidence'}</span>}
            currentCycleMetrics={current}
            previousCycleMetrics={previous}
            metric={'cycleTimeConfidence'}
            display={value => value * 100}
            uom={'%'}
            precision={2}
            target={cycleTimeConfidenceTarget}
            good={TrendIndicator.isPositive}

          />
        </VizItem>

      </VizRow>
    </React.Fragment>
  )
};
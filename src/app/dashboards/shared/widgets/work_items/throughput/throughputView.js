import React from "react";
import {ComponentCarousel} from "../../../components/componentCarousel/componentCarousel";
import {
  Cadence,
  ContributorCount,
  EffortOUT,
  LatestClosed,
  Volume,
} from "../../../components/flowStatistics/flowStatistics";
import {VizItem, VizRow} from "../../../containers/layout";

export const ThroughputView = ({
  contributorCount,
  cycleMetricsTrends,
  specsOnly,
}) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <VizRow>
      <VizItem w={0.2}>
        <ContributorCount contributorCount={contributorCount} />
      </VizItem>
      <VizItem w={0.2}>
        <Volume currentMeasurement={current} previousMeasurement={previous} specsOnly={specsOnly} />
      </VizItem>

      <VizItem w={0.3}>
        <EffortOUT currentMeasurement={current} previousMeasurement={previous} specsOnly={specsOnly} />
      </VizItem>

      <VizItem w={0.3}>
        <ComponentCarousel tickInterval={3000}>
          <LatestClosed currentMeasurement={current} />
          <Cadence currentMeasurement={current} previousMeasurement={previous} />
        </ComponentCarousel>
      </VizItem>
    </VizRow>
  );
};

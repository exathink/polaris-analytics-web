import React from "react";
import {ComponentCarousel} from "../../../components/componentCarousel/componentCarousel";
import {
  Cadence,
  ContributorCount,
  EffortOUT,
  LatestClosed,
  Volume,
} from "../../../components/flowStatistics/flowStatistics";
import styles from "./dashboard.module.css"

export const ThroughputView = ({
  contributorCount,
  cycleMetricsTrends,
  normalized,
  specsOnly,
}) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <div className={styles.throughputStatistic}>
      <div className={styles.firstCol}>
        <ContributorCount contributorCount={contributorCount} />
      </div>
      <div className={styles.secondCol}>
        <Volume normalized={normalized} contributorCount={contributorCount} currentMeasurement={current} previousMeasurement={previous} specsOnly={specsOnly} />
      </div>

      <div className={styles.thirdCol}>
        <EffortOUT normalized={normalized} contributorCount={contributorCount} currentMeasurement={current} previousMeasurement={previous} specsOnly={specsOnly} />
      </div>

      <div className={styles.fourthCol}>
        <ComponentCarousel tickInterval={3000}>
          <LatestClosed currentMeasurement={current} />
          <Cadence currentMeasurement={current} previousMeasurement={previous} />
        </ComponentCarousel>
      </div>
    </div>
  );
};

import React from "react";
import {Volume, Throughput, TotalEffort} from "../../../components/flowStatistics/flowStatistics";
import styles from "./dashboard.module.css";

export const ThroughputView = ({
                                 measurementWindow,
                                 contributorCount,
                                 cycleMetricsTrends,
                                 normalized,
                                 specsOnly
                               }) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <div className={styles.throughputStatistic}>
      <div className={styles.firstCol}>
        <Volume currentMeasurement={current}
                            previousMeasurement={previous} specsOnly={specsOnly} />
      </div>
      <div className={styles.secondCol}>
        <Throughput currentMeasurement={current}
                            previousMeasurement={previous} measurementWindow={measurementWindow} specsOnly={specsOnly}/>
      </div>

      <div className={styles.thirdCol}>
        <TotalEffort contributorCount={contributorCount} currentMeasurement={current}
                previousMeasurement={previous} specsOnly={specsOnly} />
      </div>
    </div>
  );
};

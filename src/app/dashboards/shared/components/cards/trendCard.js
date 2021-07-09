import React from "react";
import styles from "./trendCard.module.css";
import {InfoCard} from "../../../../components/misc/info";
import classNames from "classnames";

export function TrendCard({metricTitle, metricValue, suffix, trendIndicator, info, selected = false, setSelectedMetric}) {
  const selectedTrendCardClasses = classNames({[styles.selectedTrendCard]: selected}, styles.trendCardWrapper);
  return (
    <div className={selectedTrendCardClasses} onClick={setSelectedMetric}>
      <div className={styles.metricTitle}>{metricTitle}</div>
      <div className={styles.infoIcon}>
        <InfoCard title={metricTitle} content={info.headline} drawerContent={info.drawerContent} />
      </div>
      <div className={styles.metricValue}>
        {metricValue} <span className={styles.unitOfMesurement}>{suffix}</span>
      </div>
      <div className={styles.indicator}>{trendIndicator}</div>
    </div>
  );
}

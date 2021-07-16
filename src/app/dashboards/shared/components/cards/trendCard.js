import React from "react";
import styles from "./trendCard.module.css";
import {InfoCard} from "../../../../components/misc/info";
import classNames from "classnames";

export function TrendCard({metricTitle, metricValue, suffix, trendIndicator, size="large", info, showHighlighted = false, onClick}) {
  const selectedTrendCardClasses = classNames({[styles.selectedTrendCard]: showHighlighted}, styles.trendCardWrapper);
  const metricValueClasses = classNames(styles[`${size}MetricValue`])
  return (
    <div className={selectedTrendCardClasses} onClick={onClick}>
      <div className={styles.metricTitle}>{metricTitle}</div>
      <div className={styles.infoIcon}>
        <InfoCard title={metricTitle} content={info.headline} drawerContent={info.drawerContent} />
      </div>
      <div className={metricValueClasses}>
        {metricValue} <span className={styles.unitOfMesurement}>{suffix}</span>
      </div>
      <div className={styles.indicator}>{trendIndicator}</div>
    </div>
  );
}

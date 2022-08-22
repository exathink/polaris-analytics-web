import React from "react";
import styles from "./trendCard.module.css";
import {InfoCard} from "../../../../components/misc/info";
import classNames from "classnames";

export function TrendCard({metricTitle, metricValue, suffix, trendIndicator, size="large", info, showHighlighted = false, onClick, target, className, testId}) {
  const selectedTrendCardClasses = classNames({[styles.selectedTrendCard]: showHighlighted}, styles.trendCardWrapper, className, onClick ? "tw-cursor-pointer": "");
  const metricValueClasses = classNames(styles[`${size}MetricValue`])
  return (
    <div className={selectedTrendCardClasses} onClick={onClick} data-testid={testId}>
      <div className={styles.metricTitle}>{metricTitle}</div>
      <div className={styles.infoIcon}>
        <InfoCard title={metricTitle} content={info && info.headline} drawerContent={info && info.drawerContent} />
      </div>
      <div className={metricValueClasses}>
        {metricValue} <span className={styles.unitOfMesurement}>{suffix}</span>
        {target && <div className="tw-text-xs tw-font-medium tw-text-gray-300" data-testid="target">{target}</div>}
      </div>
      <div className={styles.indicator}>{trendIndicator}</div>
    </div>
  );
}

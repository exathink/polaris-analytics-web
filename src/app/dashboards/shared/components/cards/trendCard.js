import React from "react";
import styles from "./trendCard.module.css";
import {InfoCard} from "../../../../components/misc/info";

export function TrendCard({metricTitle, metricValue, suffix, trendIndicator, info}) {
  return (
    <div className={styles.trendCardWrapper}>
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

import React from "react";
import styles from "./contributors.module.css";

export function MergeContributorsPage({accountKey, intl, renderActionButtons}) {
  return <div className={styles.mergeContributorsLandingPage}>{renderActionButtons(false)}</div>;
}

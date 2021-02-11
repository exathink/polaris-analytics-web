import {Input, Checkbox, Table} from "antd";
import React from "react";
import styles from "./contributors.module.css";

export function MergeContributorsPage({accountKey, intl, renderActionButtons}) {
  return (
    <div className={styles.mergeContributorsLandingPage}>
      <div className={styles.parentContributor}>
        <div className={styles.contributor}>Contributor</div>
        <div className={styles.inputWrapper}>
          <Input value="John Brown Sr." />
        </div>
      </div>
      <div className={styles.excludeFromAnalysisWrapper}>
        <div className={styles.excludeFromAnalysis}>Exclude From Analysis:</div>
        <div className={styles.excludeFromAnalysisCheckbox}><Checkbox size="large"/></div>
        <div className={styles.excludeFromAnalysisSubtitle}>After merging, excluded contributors will not appear in Polaris metrics and are not billed</div>
      </div>
      <div className={styles.mergeContributorTitle}>Contributions from the XXX contributors below will be merged into contributions from John Brown Sr.</div>
      <div className={styles.mergeContributorTable}><Table dataSource={[]} columns={[]}/></div>
      {renderActionButtons(false)}
    </div>
  );
}

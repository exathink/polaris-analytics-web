import {Input, Checkbox, Table} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {getRowSelection, useMergeContributorsTableColumns} from "./utils";

function getTransformedData(selectedRecords) {
  const kvArr = selectedRecords.filter((x) => x.contributorAliasesInfo == null).map(x => {
    const {parent, ...rest} = x;
    return [x.key, rest];
  });
  return new Map(kvArr);
}

export function MergeContributorsPage({accountKey, intl, renderActionButtons, selectedContributorsState}) {
  const [initSelectedRecords] = selectedContributorsState;
  const contributorsState = React.useState(initSelectedRecords.filter(x => x.contributorAliasesInfo == null));
  const columns = useMergeContributorsTableColumns();

  const parentContributor = initSelectedRecords.find((x) => x.contributorAliasesInfo != null);
  const data = getTransformedData(initSelectedRecords);

  return (
    <div className={styles.mergeContributorsLandingPage}>
      <div className={styles.parentContributor}>
        <div className={styles.contributor}>Contributor</div>
        <div className={styles.inputWrapper}>
          <Input value={parentContributor.name} />
        </div>
      </div>
      <div className={styles.excludeFromAnalysisWrapper}>
        <div className={styles.excludeFromAnalysis}>Exclude From Analysis:</div>
        <div className={styles.excludeFromAnalysisCheckbox}>
          <Checkbox size="large" />
        </div>
        <div className={styles.excludeFromAnalysisSubtitle}>
          After merging, excluded contributors will not appear in Polaris metrics and are not billed
        </div>
      </div>
      <div
        className={styles.mergeContributorTitle}
      >{`Contributions from the ${data.length} contributors below will be merged into contributions from ${parentContributor.name}`}</div>
      <div className={styles.mergeContributorTable}>
        <Table
          size="small"
          dataSource={[...data.values()]}
          columns={columns}
          rowSelection={{...getRowSelection(data, contributorsState)}}
        />
      </div>
      {renderActionButtons(false)}
    </div>
  );
}

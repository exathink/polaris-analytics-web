import {Input, Checkbox, Table} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {getRowSelection, useMergeContributorsTableColumns, VERTICAL_SCROLL_HEIGHT} from "./utils";

function getTransformedData(selectedRecords) {
  const kvArr = selectedRecords.map((x) => [x.key, x]);
  return new Map(kvArr);
}

function getParentContributor(initSelectedRecords) {
   const recordWithChildren = initSelectedRecords.find((x) => x.contributorAliasesInfo != null);
   // TODO update this logic
   if (recordWithChildren == null) {
     const placeHolderRecord = {key: "test", name: ""}
     return placeHolderRecord;
   }
   return recordWithChildren
}

export function MergeContributorsPage({accountKey, intl, renderActionButtons, selectedContributorsState}) {
  const [initSelectedRecords] = selectedContributorsState;
  const [excludeFromAnalysis, setExcludeFromAnalysis] = React.useState(false);

  // parent contributor in which to merge other contributors
  const parentContributor = getParentContributor(initSelectedRecords);
  const [parentContributorName, setParentContributorName] = React.useState(parentContributor.name);
  function handleParentContributorChange(e) {
    setParentContributorName(e.target.value);
  }

  const selectedRecordsWithoutChildren = initSelectedRecords.filter((x) => x.contributorAliasesInfo == null);

  // selection state for child contributors
  const contributorsState = React.useState(selectedRecordsWithoutChildren);

  const data = getTransformedData(selectedRecordsWithoutChildren);
  const columns = useMergeContributorsTableColumns();

  return (
    <div className={styles.mergeContributorsLandingPage}>
      <div className={styles.parentContributor}>
        <div className={styles.contributor}>Contributor</div>
        <div className={styles.inputWrapper}>
          <Input value={parentContributorName} onChange={handleParentContributorChange} />
        </div>
      </div>
      <div className={styles.excludeFromAnalysisWrapper}>
        <div className={styles.excludeFromAnalysis}>Exclude From Analysis:</div>
        <div className={styles.excludeFromAnalysisCheckbox}>
          <Checkbox
            size="large"
            checked={excludeFromAnalysis}
            onChange={() => setExcludeFromAnalysis(!excludeFromAnalysis)}
          />
        </div>
        <div className={styles.excludeFromAnalysisSubtitle}>
          After merging, excluded contributors will not appear in Polaris metrics and are not billed
        </div>
      </div>
      <div
        className={styles.mergeContributorTitle}
      >{`Contributions from the ${contributorsState[0].length} contributors below will be merged into contributions from ${parentContributorName}`}</div>
      <div className={styles.mergeContributorTable}>
        <Table
          size="small"
          dataSource={[...data.values()]}
          columns={columns}
          rowSelection={{...getRowSelection(data, contributorsState)}}
          pagination={false}
          scroll={{y: VERTICAL_SCROLL_HEIGHT}}
          showSorterTooltip={false}
        />
      </div>
      {renderActionButtons(false)}
    </div>
  );
}

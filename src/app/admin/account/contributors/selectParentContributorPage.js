import {Radio, Table} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {useMergeContributorsTableColumns, VERTICAL_SCROLL_HEIGHT, getBaseColumns} from "./utils";

function getTransformedData(selectedRecords) {
  const kvArr = selectedRecords.map((x) => [x.key, x]);
  return new Map(kvArr);
}

function getParentContributorRadioCol(selectParentContributorState) {
  const [key, setKey] = selectParentContributorState;

  function handleRadioChange({recordKey}) {
    setKey(recordKey);
  }
  return {
    ...getBaseColumns().select_parent_contributor,
    width: "10%",
    align: "center",
    render: (text, record) => (
      <Radio
        checked={record.key === key}
        onChange={(e) => handleRadioChange({recordKey: record.key})}
      >
        {text}
      </Radio>
    ),
  };
}

export function SelectParentContributorsPage({
  accountKey,
  intl,
  renderActionButtons,
  selectContributorsState,
  selectParentContributorState,
}) {
  const [initSelectedRecords] = selectContributorsState;
  const selectedRecordsWithoutChildren = initSelectedRecords;
  const data = getTransformedData(selectedRecordsWithoutChildren);

  const parentContributorRadioCol = getParentContributorRadioCol(selectParentContributorState);
  const columns = [parentContributorRadioCol, ...useMergeContributorsTableColumns()];

  return (
    <div className={styles.selectParentContributorLandingPage}>
      <div className={styles.selectParentContributorTitle}><h1>Select Parent Contributor</h1></div>
      <div className={styles.selectParentContributorTable}>
        <Table
          size="small"
          dataSource={[...data.values()]}
          columns={columns}
          pagination={false}
          scroll={{y: VERTICAL_SCROLL_HEIGHT}}
          showSorterTooltip={false}
        />
      </div>
      {renderActionButtons(false)}
    </div>
  );
}

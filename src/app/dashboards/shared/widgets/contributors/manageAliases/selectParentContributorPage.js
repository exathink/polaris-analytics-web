import {Radio, Table} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {useUpdateContributorTableColumns, VERTICAL_SCROLL_HEIGHT, getBaseColumns, NavigateOnDoneHandlers} from "./utils";
import {actionTypes} from "./constants";
import Button from "../../../../../../components/uielements/button";

function getTransformedData(selectedRecords) {
  const kvArr = selectedRecords.map((x) => [x.key, x]);
  return new Map(kvArr);
}

function getParentContributorRadioCol(selectParentContributorState) {
  const [key, dispatch] = selectParentContributorState;

  function handleRadioChange({recordKey}) {
    dispatch({type: actionTypes.UPDATE_PARENT_CONTRIBUTOR_KEY, payload: recordKey});
  }
  return {
    ...getBaseColumns().select_parent_contributor,
    width: "10%",
    align: "center",
    render: (text, record) => (
      <Radio checked={record.key === key} onChange={(e) => handleRadioChange({recordKey: record.key})}>
        {text}
      </Radio>
    ),
  };
}

export function SelectParentContributorPage({
  dimension,
  context,
  intl,
  current,
  selectedRecords,
  parentContributorKey,
  dispatch,
}) {
  const selectedRecordsWithoutChildren = selectedRecords;
  const data = getTransformedData(selectedRecordsWithoutChildren);

  const parentContributorRadioCol = getParentContributorRadioCol([parentContributorKey, dispatch]);
  const columns = [parentContributorRadioCol, ...useUpdateContributorTableColumns()];

  const handleNextClick = () => {
    dispatch({type: actionTypes.UPDATE_CURRENT_STEP, payload: current + 1});
  };

  const handleDoneClick = () => {
    NavigateOnDoneHandlers(context)[dimension]();
  };

  function renderActionButtons() {
    const nextButtonDisabled = parentContributorKey.trim() === "";

    return (
      <div className={styles.parentContributorAction}>
        <div className={styles.parentContributorNextAction}>
          <Button
            type="primary"
            onClick={handleNextClick}
            disabled={nextButtonDisabled}
          >
            Next
          </Button>
        </div>
        <div className={styles.parentContributorDoneAction}>
          <Button
            onClick={handleDoneClick}
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.selectParentContributorLandingPage}>
      <div className={styles.selectParentContributorTitle}>
        <div className={styles.userMessage}>Select a contributor: The remaining contributors will be merged into this one.</div>
      </div>
      <div className={styles.selectParentContributorTable}>
        <Table
          size="small"
          dataSource={[...data.values()]}
          columns={columns}
          pagination={false}
          scroll={{y: VERTICAL_SCROLL_HEIGHT}}
          showSorterTooltip={false}
          data-testid="select-parent-contributor"
        />
      </div>
      {renderActionButtons()}
    </div>
  );
}

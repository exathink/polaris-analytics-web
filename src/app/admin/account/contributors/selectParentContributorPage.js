import {Radio, Table, Button} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {useUpdateContributorTableColumns, VERTICAL_SCROLL_HEIGHT, getBaseColumns} from "./utils";
import {actionTypes} from "./constants";

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
  accountKey,
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

  const handleBackClick = () => {
    dispatch({type: actionTypes.UPDATE_CURRENT_STEP, payload: current - 1});
  };

  const handleDoneClick = () => {
    context.go("..");
  };

  function renderActionButtons() {
    const nextButtonDisabled = parentContributorKey.trim() === "";

    return (
      <>
        <div className={styles.parentContributorNextAction}>
          <Button
            type="primary"
            className={styles.contributorsPrimaryButton}
            onClick={handleNextClick}
            disabled={nextButtonDisabled}
          >
            Next
          </Button>
        </div>
        <div className={styles.parentContributorBackAction}>
          <Button
            className={styles.contributorsButton}
            style={{backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"}}
            onClick={handleBackClick}
          >
            Back
          </Button>
        </div>
        <div className={styles.parentContributorDoneAction}>
          <Button
            className={styles.contributorsButton}
            style={{backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"}}
            onClick={handleDoneClick}
          >
            Done
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className={styles.selectParentContributorLandingPage}>
      <div className={styles.selectParentContributorTitle}>
        <h1>Select Parent Contributor</h1>
      </div>
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
      {renderActionButtons()}
    </div>
  );
}

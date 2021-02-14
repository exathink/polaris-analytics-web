import {Input, Checkbox, Table, Alert, Button} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {getRowSelection, useMergeContributorsTableColumns, VERTICAL_SCROLL_HEIGHT} from "./utils";
import {useUpdateContributorForContributorAliases} from "./useUpdateContributor";
import {logGraphQlError} from "../../../components/graphql/utils";
import {actionTypes} from "./constants";

function getTransformedData(selectedRecords) {
  const kvArr = selectedRecords.map((x) => [x.key, x]);
  return new Map(kvArr);
}

function getParentContributor(initSelectedRecords, parentContributorKey) {
  const recordWithChildren = initSelectedRecords.find((x) => x.contributorAliasesInfo != null);
  if (recordWithChildren == null) {
    return initSelectedRecords.find((x) => x.key === parentContributorKey);
  }
  return recordWithChildren;
}

export function MergeContributorsPage({
  accountKey,
  context,
  intl,
  current,
  selectedRecords,
  parentContributorKey,
  dispatch,
}) {
  const selectedRecordsWithoutChildren = selectedRecords
    .filter((x) => x.contributorAliasesInfo == null)
    .filter((x) => x.key !== parentContributorKey);

  const [excludeFromAnalysis, setExcludeFromAnalysis] = React.useState(false);

  // parent contributor in which to merge other contributors
  const parentContributor = getParentContributor(selectedRecords, parentContributorKey);
  const [parentContributorName, setParentContributorName] = React.useState(parentContributor.name);
  function handleParentContributorChange(e) {
    setParentContributorName(e.target.value);
  }

  // selection state for records without children
  const contributorsState = React.useState(selectedRecordsWithoutChildren);

  const [[errorMessage, setErrorMessage], [successMessage, setSuccessMessage]] = [
    React.useState(""),
    React.useState(""),
  ];

  // This will remain true till the time timeout is executing.
  const [timeOutExecuting, setTimeOutExecuting] = React.useState();

  const moveToFirstStep = () => {
    dispatch({type: actionTypes.NAVIGATE_AFTER_SUCCESS});
  };

  // mutation to update contributor
  const [mutate, {loading, client}] = useUpdateContributorForContributorAliases({
    onCompleted: ({updateContributorForContributorAliases: {updateStatus}}) => {
      //  {success, contributorKey, message, exception}
      if (updateStatus.success) {
        setSuccessMessage("Updated Successfully.");
        client.resetStore();

        setTimeOutExecuting(true);
        setTimeout(() => {
          setTimeOutExecuting(false);
          // if successful navigate to select contributors page after 1 sec
          moveToFirstStep();
        }, 500);
      } else {
        logGraphQlError("MergeContributorsWorkflow.useUpdateContributorForContributorAliases", updateStatus.message);
        setErrorMessage(updateStatus.message);
      }
    },
    onError: (error) => {
      logGraphQlError("MergeContributorsWorkflow.useUpdateContributorForContributorAliases", error);
      setErrorMessage(error.message);
    },
  });

  const handleMergeContributorClick = () => {
    const updatedInfo = {
      contributorName: parentContributorName,
      excludedFromAnalysis: excludeFromAnalysis,
      contributorAliasKeys: contributorsState[0].map((x) => x.key),
    };

    // call mutation on save button click
    mutate({
      variables: {
        contributorKey: parentContributor.keyBackup,
        updatedInfo: updatedInfo,
      },
    });
  };

  const handleBackClick = () => {
    dispatch({type: actionTypes.UPDATE_CURRENT_STEP, payload: current - 1});
  };

  const handleDoneClick = () => {
    context.go("..");
  };

  function renderActionButtons({isNextButtonDisabled, actionButtonHandler}) {
    const mergeButtonDisabled = isNextButtonDisabled;

    return (
      <>
        <div className={styles.mergeContributorsMergeAction}>
          <Button
            type="primary"
            className={styles.contributorsButton}
            style={!mergeButtonDisabled ? {backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"} : {}}
            onClick={actionButtonHandler}
            disabled={mergeButtonDisabled}
          >
            Merge Contributors
          </Button>
        </div>
        <div className={styles.mergeContributorsBackAction}>
          <Button
            className={styles.contributorsButton}
            style={{backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"}}
            onClick={handleBackClick}
          >
            Back
          </Button>
        </div>
        <div className={styles.mergeContributorsDoneAction}>
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

  const data = getTransformedData(selectedRecordsWithoutChildren);
  const columns = useMergeContributorsTableColumns();

  return (
    <div className={styles.mergeContributorsLandingPage}>
      <div className={styles.messageNotification}>
        {errorMessage && (
          <Alert message={errorMessage} type="error" showIcon closable onClose={() => setErrorMessage("")} />
        )}
        {successMessage && (
          <Alert message={successMessage} type="success" showIcon closable onClose={() => setSuccessMessage("")} />
        )}
        {loading && (
          <Button className={"shiftRight"} type="primary" loading>
            Processing...
          </Button>
        )}
      </div>
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
      {renderActionButtons({
        isNextButtonDisabled: contributorsState[0].length === 0 || loading || timeOutExecuting === true,
        actionButtonHandler: handleMergeContributorClick,
      })}
    </div>
  );
}

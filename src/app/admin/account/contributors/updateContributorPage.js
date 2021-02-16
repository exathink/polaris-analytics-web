import {Input, Checkbox, Table, Alert, Button, Switch} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {
  getRowSelection,
  SCROLL_HEIGHT_UPDATE_CONTRIBUTORS,
  useUpdateContributorTableColumns,
  withChildren,
  withNoChildren,
  getBaseColumns,
} from "./utils";
import {useUpdateContributor} from "./useUpdateContributor";
import {logGraphQlError} from "../../../components/graphql/utils";
import {actionTypes} from "./constants";

function getTransformedData(selectedRecords) {
  const kvArr = selectedRecords.map((x) => [x.key, x]);
  return new Map(kvArr);
}

function getSelectedRecordsWithoutChildren(selectedRecords, parentContributorKey) {
  return selectedRecords.filter(withNoChildren).filter((x) => x.key !== parentContributorKey);
}

function getUnlinkUtils(selectedRecords) {
  const isUnlinkFlow = selectedRecords.length === 1 && selectedRecords.filter(withChildren).length === 1;
  const allUnlinkAliases = isUnlinkFlow
    ? selectedRecords[0].contributorAliasesInfo.filter((x) => x.key !== selectedRecords[0].keyBackup)
    : [];
  return {
    isUnlinkFlow,
    allUnlinkAliases,
  };
}

function getToggleCol(unlinkAliasesState) {
  const [unlinkAliases, updateUnlinkAliases] = unlinkAliasesState;

  function handleChange({recordKey, checked}) {
    const updatedRecords = unlinkAliases.map((x) => {
      if (x.key === recordKey) {
        return {...x, checked};
      }
      return {...x};
    });

    updateUnlinkAliases(updatedRecords);
  }

  return {
    ...getBaseColumns().unlink_alias_switch,
    width: "10%",
    align: "center",
    render: (text, record) => (
      <Switch
        checked={unlinkAliases.find((x) => x.key === record.key).checked}
        onChange={(checked, e) => handleChange({recordKey: record.key, checked: checked})}
        size="small"
        className={styles.toggle}
      />
    ),
  };
}

export function UpdateContributorPage({
  accountKey,
  context,
  intl,
  current,
  selectedRecords,
  parentContributorKey,
  dispatch,
}) {
  const selectedRecordsWithoutChildren = getSelectedRecordsWithoutChildren(selectedRecords, parentContributorKey);

  const [excludeFromAnalysis, setExcludeFromAnalysis] = React.useState();

  // parent contributor in which to merge other contributors
  const parentContributor = selectedRecords.find((x) => x.key === parentContributorKey);
  const [parentContributorName, setParentContributorName] = React.useState(parentContributor.name);
  function handleParentContributorChange(e) {
    setParentContributorName(e.target.value);
  }

  // selection state for records without children
  const [localRecords, setLocalRecords] = React.useState(selectedRecordsWithoutChildren);

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
  const [mutate, {loading, client}] = useUpdateContributor({
    onCompleted: ({updateContributor: {updateStatus}}) => {
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
        logGraphQlError("UpdateContributorPage.useUpdateContributor", updateStatus.message);
        setErrorMessage(updateStatus.message);
      }
    },
    onError: (error) => {
      logGraphQlError("UpdateContributorPage.useUpdateContributor", error);
      setErrorMessage(error.message);
    },
  });

  const {isUnlinkFlow, allUnlinkAliases} = getUnlinkUtils(selectedRecords);
  const [unlinkAliases, updateUnlinkAliases] = React.useState(allUnlinkAliases.map((x) => ({...x, checked: true})));

  const columns = useUpdateContributorTableColumns();
  const unlinkCols = [...columns, getToggleCol([unlinkAliases, updateUnlinkAliases])];

  function handleUpdateContributorClick() {
    const updatedInfo = {
      contributorName: parentContributorName,
      excludedFromAnalysis: excludeFromAnalysis,
      contributorAliasKeys: localRecords.length > 0 ? localRecords.map((x) => x.key) : undefined,
      unlinkContributorAliasKeys:
        unlinkAliases.length > 0 ? unlinkAliases.filter((x) => !x.checked).map((x) => x.key) : undefined,
    };

    // call mutation on save button click
    mutate({
      variables: {
        contributorKey: parentContributor.keyBackup,
        updatedInfo: updatedInfo,
      },
    });
  }

  const handleBackClick = () => {
    dispatch({type: actionTypes.UPDATE_CURRENT_STEP, payload: current - 1});
  };

  const handleDoneClick = () => {
    context.go("..");
  };

  function renderActionButtons() {
    const isButtonDisabled =
      (selectedRecordsWithoutChildren.length > 0 && localRecords.length === 0) || loading || timeOutExecuting === true || unlinkAliases.filter(x => x.checked).length === allUnlinkAliases.length;

    return (
      <>
        <div className={styles.updateContributorMergeAction}>
          <Button
            type="primary"
            className={styles.contributorsPrimaryButton}
            onClick={handleUpdateContributorClick}
            disabled={isButtonDisabled}
          >
            Update Contributor
          </Button>
        </div>
        <div className={styles.updateContributorBackAction}>
          <Button
            className={styles.contributorsButton}
            style={{backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"}}
            onClick={handleBackClick}
          >
            Back
          </Button>
        </div>
        <div className={styles.updateContributorDoneAction}>
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
  function getTable() {
    if (isUnlinkFlow) {
      const data = getTransformedData(
        selectedRecords[0].contributorAliasesInfo.filter((x) => x.key !== selectedRecords[0].keyBackup)
      );
      return (
        <Table
          size="small"
          dataSource={[...data.values()]}
          columns={unlinkCols}
          pagination={false}
          scroll={{y: SCROLL_HEIGHT_UPDATE_CONTRIBUTORS}}
          showSorterTooltip={false}
        />
      );
    }
    if (data.size > 0) {
      return (
        <Table
          size="small"
          dataSource={[...data.values()]}
          columns={columns}
          rowSelection={{...getRowSelection(data, [localRecords, setLocalRecords])}}
          pagination={false}
          scroll={{y: SCROLL_HEIGHT_UPDATE_CONTRIBUTORS}}
          showSorterTooltip={false}
        />
      );
    } else {
      return null;
    }
  }

  function getTitleText() {
    if (isUnlinkFlow && unlinkAliases.filter((x) => !x.checked).length) {
      return `${
        unlinkAliases.filter((x) => !x.checked).length
      } contributors will be unlinked from ${parentContributorName}`;
    }
    return data.size > 0 && localRecords.length > 0
      ? `Contributions from the contributors below will be merged into contributions from ${parentContributorName}`
      : null;
  }

  function getExcludeFromAnalysis() {
    if (isUnlinkFlow) {
      return null;
    }

    return (
      <>
        <div className={styles.excludeFromAnalysis}>Exclude From Analysis:</div>
        <div className={styles.excludeFromAnalysisCheckbox}>
          <Checkbox
            size="large"
            checked={excludeFromAnalysis}
            onChange={() => setExcludeFromAnalysis(!excludeFromAnalysis)}
          />
        </div>
        <div className={styles.excludeFromAnalysisSubtitle}>
          Activity and metrics for excluded contributors will not appear in Polaris and you will not be billed for them.
        </div>
      </>
    );
  }

  return (
    <div className={styles.updateContributorLandingPage}>
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
        <div className={styles.contributor}>Contributor:</div>
        <div className={styles.inputWrapper}>
          <Input value={parentContributorName} onChange={handleParentContributorChange} />
        </div>
      </div>
      <div className={styles.excludeFromAnalysisWrapper}>{getExcludeFromAnalysis()}</div>
      <div className={styles.updateContributorTitle}>{getTitleText()}</div>
      <div className={styles.updateContributorTable}>{getTable()}</div>
      {renderActionButtons()}
    </div>
  );
}

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
  NavigateOnDoneHandlers,
} from "./utils";
import {useUpdateContributor} from "./useUpdateContributor";
import {logGraphQlError} from "../../../components/graphql/utils";
import {actionTypes} from "./constants";
import {updateContributorReducer} from "./updateContributorReducer";

function getTransformedData(selectedRecords) {
  const kvArr = selectedRecords.map((x) => [x.key, x]);
  return new Map(kvArr);
}

function getSelectedRecordsWithoutChildren(selectedRecords, parentContributorKey) {
  return selectedRecords.filter(withNoChildren).filter((x) => x.key !== parentContributorKey);
}

function getUnlinkUtils(selectedRecords) {
  const isUnlinkFlow = selectedRecords.length === 1 && selectedRecords.filter(withChildren).length === 1;

  // all child records except the parent alias
  const initialUnlinkAliases = isUnlinkFlow
    ? selectedRecords[0].contributorAliasesInfo.filter((x) => x.key !== selectedRecords[0].keyBackup)
    : [];

  return {
    isUnlinkFlow,
    initialUnlinkAliases,
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

const isUnlinked = (x) => !x.checked;
const isLinked = (x) => x.checked;

export function UpdateContributorPage({
  dimension,
  context,
  intl,
  current,
  selectedRecords,
  parentContributorKey,
  dispatch: dispatchEvent,
}) {
  const selectedRecordsWithoutChildren = getSelectedRecordsWithoutChildren(selectedRecords, parentContributorKey);
  // parent contributor in which to merge other contributors
  const parentContributor = selectedRecords.find((x) => x.key === parentContributorKey);
  const {isUnlinkFlow, initialUnlinkAliases} = getUnlinkUtils(selectedRecords);

  const initialState = {
    excludeFromAnalysis: undefined,
    parentContributorName: parentContributor.name,
    localRecords: selectedRecordsWithoutChildren,
    errorMessage: "",
    successMessage: "",
    timeOutExecuting: undefined,
    unlinkAliases: initialUnlinkAliases.map((x) => ({...x, checked: true})),
  };

  const [
    {
      excludeFromAnalysis,
      parentContributorName,
      localRecords, // selection state for records without children
      errorMessage,
      successMessage,
      timeOutExecuting, // This will remain true till the time timeout is executing.
      unlinkAliases,
    },
    dispatch,
  ] = React.useReducer(updateContributorReducer, initialState);

  const unlinkedAliases = unlinkAliases.filter(isUnlinked);
  const linkedAliases = unlinkAliases.filter(isLinked);

  // clear timeout to avoid memory leaks
  const timeOutRef = React.useRef();
  React.useEffect(() => {
    return () => clearTimeout(timeOutRef.current);
  }, []);

  // mutation to update contributor
  const [mutate, {loading, client}] = useUpdateContributor({
    onCompleted: ({updateContributor: {updateStatus}}) => {
      //  {success, contributorKey, message, exception}
      if (updateStatus.success) {
        dispatch({type: actionTypes.UPDATE_SUCCESS_MESSAGE, payload: "Updated Successfully."});
        client.resetStore();

        dispatch({type: actionTypes.UPDATE_TIMEOUT_EXECUTING, payload: true});
        timeOutRef.current = setTimeout(() => {
          dispatch({type: actionTypes.UPDATE_TIMEOUT_EXECUTING, payload: false});

          // if successful navigate to select contributors page after 1/2 sec (moveToFirstStep)
          dispatchEvent({type: actionTypes.NAVIGATE_AFTER_SUCCESS});
        }, 500);
      } else {
        logGraphQlError("UpdateContributorPage.useUpdateContributor", updateStatus.message);
        dispatch({type: actionTypes.UPDATE_ERROR_MESSAGE, payload: updateStatus.message});
      }
    },
    onError: (error) => {
      logGraphQlError("UpdateContributorPage.useUpdateContributor", error);
      dispatch({type: actionTypes.UPDATE_ERROR_MESSAGE, payload: error.message});
    },
  });

  function handleUpdateContributorClick() {
    const updatedInfo = {
      contributorName: parentContributorName,
      excludedFromAnalysis: excludeFromAnalysis,
      contributorAliasKeys: localRecords.length > 0 ? localRecords.map((x) => x.key) : undefined,
      unlinkContributorAliasKeys: unlinkedAliases.length > 0 ? unlinkedAliases.map((x) => x.key) : undefined,
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
    dispatchEvent({type: actionTypes.UPDATE_CURRENT_STEP, payload: current - 1});
  };

  const handleDoneClick = () => {
    NavigateOnDoneHandlers(context)[dimension]();
  };

  function isButtonDisabled() {
    // all flows
    if (loading || timeOutExecuting === true) {
      return true;
    }

    // unlink flow
    if (isUnlinkFlow) {
      return (
        linkedAliases.length === initialUnlinkAliases.length &&
        initialState.parentContributorName === parentContributorName
      );
    }

    // others
    return (
      (selectedRecordsWithoutChildren.length > 0 &&
        localRecords.length === 0 &&
        initialState.parentContributorName === parentContributorName &&
        initialState.excludeFromAnalysis === excludeFromAnalysis) ||
      (selectedRecordsWithoutChildren.length === 0 &&
        initialState.parentContributorName === parentContributorName &&
        initialState.excludeFromAnalysis === excludeFromAnalysis)
    );
  }

  function renderActionButtons() {
    return (
      <>
        <div className={styles.updateContributorMergeAction}>
          <Button
            type="primary"
            className={styles.contributorsPrimaryButton}
            onClick={handleUpdateContributorClick}
            disabled={isButtonDisabled()}
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

  const columns = useUpdateContributorTableColumns();
  const data = getTransformedData(selectedRecordsWithoutChildren);

  function getTable() {
    if (isUnlinkFlow) {
      const updateUnlinkAliases = (ula) => dispatch({type: actionTypes.UPDATE_UNLINK_ALIASES, payload: ula});
      const unlinkCols = [...columns, getToggleCol([unlinkAliases, updateUnlinkAliases])];
      const unlinkData = getTransformedData(initialUnlinkAliases);
      return (
        <Table
          size="small"
          dataSource={[...unlinkData.values()]}
          columns={unlinkCols}
          pagination={false}
          scroll={{y: SCROLL_HEIGHT_UPDATE_CONTRIBUTORS}}
          showSorterTooltip={false}
          data-testid="select-merge-target-table"
        />
      );
    }
    if (data.size > 0) {
      const setLocalRecords = (records) => dispatch({type: actionTypes.UPDATE_LOCAL_RECORDS, payload: records});
      return (
        <Table
          size="small"
          dataSource={[...data.values()]}
          columns={columns}
          rowSelection={{...getRowSelection(data, [localRecords, setLocalRecords])}}
          pagination={false}
          scroll={{y: SCROLL_HEIGHT_UPDATE_CONTRIBUTORS}}
          showSorterTooltip={false}
          data-testid="update-contributors-table"
        />
      );
    } else {
      return null;
    }
  }

  function getTitleText() {
    // unlink flow
    if (isUnlinkFlow) {
      if (unlinkedAliases.length > 0) {
        const contributor = unlinkedAliases.length === 1 ? "contributor" : "contributors";
        return `${unlinkedAliases.length} ${contributor} will be unlinked from ${parentContributorName}`;
      }
      return `Click the toggle on the right to disconnect a contributor as an alias for ${parentContributorName}`;
    }

    // other flows
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
            onChange={() => dispatch({type: actionTypes.UPDATE_EXCLUDE_FROM_ANALYSIS, payload: !excludeFromAnalysis})}
          />
        </div>
        <div className={styles.excludeFromAnalysisSubtitle}>
          Activity and metrics for excluded contributors will not appear in Polaris and you will not be billed for them.
        </div>
      </>
    );
  }

  function handleParentContributorChange(e) {
    dispatch({type: actionTypes.UPDATE_PARENT_CONTRIBUTOR_NAME, payload: e.target.value});
  }

  return (
    <div className={styles.updateContributorLandingPage}>
      <div className={styles.messageNotification}>
        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => dispatch({type: actionTypes.UPDATE_ERROR_MESSAGE, payload: ""})}
          />
        )}
        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            showIcon
            closable
            onClose={() => dispatch({type: actionTypes.UPDATE_SUCCESS_MESSAGE, payload: ""})}
          />
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
      <div className={styles.excludeFromAnalysisWrapper} data-testid="exclude-from-analysis">
        {getExcludeFromAnalysis()}
      </div>
      <div className={styles.updateContributorTitle}>{getTitleText()}</div>
      <div className={styles.updateContributorTable}>{getTable()}</div>
      {renderActionButtons()}
    </div>
  );
}

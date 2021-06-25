import {Alert, Button, Select} from "antd";
import React from "react";
import styles from "./teams.module.css";
import {useUpdateTeams} from "./useUpdateTeams";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {actionTypes} from "./constants";
import {updateTeamsReducer} from "./updateTeamsReducer";
import {getRowSelection, UpdateTeamsTable, useUpdateTeamsColumns} from "./updateTeamsTable";
import {PlusCircleOutlined} from "@ant-design/icons";

const {Option} = Select;

function getTransformedData(selectedRecords, targetTeam) {
  const kvArr = selectedRecords.map((x) => [x.key, {...x, targetTeam: targetTeam.name}]);
  return new Map(kvArr);
}

export function UpdateTeamsPage({
  organizationKey,
  context,
  intl,
  current,
  selectedRecords,
  dispatch: dispatchEvent,
  teamsList,
}) {
  const [defaultTeam = {}] = teamsList;
  const initialState = {
    localRecords: selectedRecords,
    targetTeam: defaultTeam,
    errorMessage: "",
    successMessage: "",
    timeOutExecuting: undefined,
  };

  const [
    {
      localRecords,
      targetTeam,
      errorMessage,
      successMessage,
      timeOutExecuting, // This will remain true till the time timeout is executing.
    },
    dispatch,
  ] = React.useReducer(updateTeamsReducer, initialState);

  // clear timeout to avoid memory leaks
  const timeOutRef = React.useRef();
  React.useEffect(() => {
    return () => clearTimeout(timeOutRef.current);
  }, []);

  // mutation to update contributor
  const [mutate, {loading, client}] = useUpdateTeams({
    onCompleted: ({updateContributorTeamAssignments}) => {
      if (updateContributorTeamAssignments.success) {
        dispatch({type: actionTypes.UPDATE_SUCCESS_MESSAGE, payload: "Updated Successfully."});
        client.resetStore();

        dispatch({type: actionTypes.UPDATE_TIMEOUT_EXECUTING, payload: true});
        timeOutRef.current = setTimeout(() => {
          dispatch({type: actionTypes.UPDATE_TIMEOUT_EXECUTING, payload: false});

          // if successful navigate to select team members page after 1/2 sec
          dispatchEvent({type: actionTypes.NAVIGATE_AFTER_SUCCESS});
        }, 500);
      } else {
        logGraphQlError("UpdateTeamsPage.useUpdateTeams", updateContributorTeamAssignments.errorMessage);
        dispatch({type: actionTypes.UPDATE_ERROR_MESSAGE, payload: updateContributorTeamAssignments.errorMessage});
      }
    },
    onError: (error) => {
      logGraphQlError("UpdateTeamsPage.useUpdateTeams", error);
      dispatch({type: actionTypes.UPDATE_ERROR_MESSAGE, payload: error.message});
    },
  });

  function handleUpdateContributorClick() {
    const payload = localRecords.map((l) => {
      return {
        contributorKey: l.key,
        newTeamKey: targetTeam.key,
      };
    });
    // call mutation on save button click
    mutate({
      variables: {
        organizationKey: organizationKey,
        contributorTeamAssignments: payload,
      },
    });
  }

  const handleBackClick = () => {
    dispatchEvent({type: actionTypes.UPDATE_CURRENT_STEP, payload: current - 1});
  };

  const handleDoneClick = () => {
    context.go("..");
  };

  function isButtonDisabled() {
    // all flows
    if (loading || timeOutExecuting === true || localRecords.length === 0) {
      return true;
    }
  }

  function renderActionButtons() {
    return (
      <>
        <div className={styles.updateTeamsAction}>
          <Button
            type="primary"
            className={styles.contributorsPrimaryButton}
            onClick={handleUpdateContributorClick}
            disabled={isButtonDisabled()}
          >
            Update Team
          </Button>
        </div>
        <div className={styles.updateTeamsBackAction}>
          <Button
            className={styles.contributorsButton}
            style={{backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"}}
            onClick={handleBackClick}
          >
            Back
          </Button>
        </div>
        <div className={styles.updateTeamsDoneAction}>
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

  const columns = useUpdateTeamsColumns();
  const data = getTransformedData(selectedRecords, targetTeam);
  const setLocalRecords = (records) => dispatch({type: actionTypes.UPDATE_LOCAL_RECORDS, payload: records});

  function getTitleText() {
    return "Update Target team for below contributors";
  }

  function selectTeamDropdown() {
    const optionElements = teamsList.map((t, index) => (
      <Option key={t.key} value={index}>
        {index === teamsList.length && <PlusCircleOutlined style={{color: "green"}} />} {t.name}
      </Option>
    ));

    function handleDropdownChange(index) {
      const selectedTeam = teamsList[index];
      dispatch({type: actionTypes.UPDATE_TARGET_TEAM, payload: selectedTeam});
    }

    return (
      <>
        <div className={styles.selectTeamLabel}>Select Team</div>
        <Select
          defaultValue={0}
          style={{width: 200}}
          onChange={handleDropdownChange}
          getPopupContainer={(node) => node.parentNode}
        >
          {optionElements}
        </Select>
      </>
    );
  }

  return (
    <div className={styles.updateTeamsPage}>
      <div className={styles.selectTeam}>{selectTeamDropdown()}</div>
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
      <div className={styles.updateTeamsTitle}>{getTitleText()}</div>
      <div className={styles.updateTeamsTable}>
        <UpdateTeamsTable
          tableData={[...data.values()]}
          columns={columns}
          rowSelection={{...getRowSelection(data, [localRecords, setLocalRecords])}}
          testId="update-teams-table"
        />
      </div>
      {renderActionButtons()}
    </div>
  );
}

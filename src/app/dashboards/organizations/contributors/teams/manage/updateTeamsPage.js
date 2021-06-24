import {Alert, Button} from "antd";
import React from "react";
import styles from "./teams.module.css";
import {useUpdateTeams} from "./useUpdateTeams";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {actionTypes} from "./constants";
import {updateTeamsReducer} from "./updateTeamsReducer";
import {getRowSelection, UpdateTeamsTable, useUpdateTeamsColumns} from "./updateTeamsTable";

function getTransformedData(selectedRecords) {
  const kvArr = selectedRecords.map((x) => [x.key, x]);
  return new Map(kvArr);
}

export function UpdateTeamsPage({organizationKey, context, intl, current, selectedRecords, dispatch: dispatchEvent}) {
  const initialState = {
    localRecords: selectedRecords,
    errorMessage: "",
    successMessage: "",
    timeOutExecuting: undefined,
  };

  const [
    {
      localRecords,
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
    onCompleted: ({updateStatus}) => {
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
    const payload = localRecords.map((l) => {
      return {
        contributorKey: l.key,
        newTeamKey: "newTeamKey",
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
    if (loading || timeOutExecuting === true) {
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
  const data = getTransformedData(selectedRecords);
  const setLocalRecords = (records) => dispatch({type: actionTypes.UPDATE_LOCAL_RECORDS, payload: records});

  function getTitleText() {
    return "Update Target team for below contributors";
  }

  return (
    <div className={styles.updateTeamsPage}>
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

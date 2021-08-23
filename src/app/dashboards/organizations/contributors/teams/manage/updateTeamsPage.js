import {Alert, Select} from "antd";
import React from "react";
import styles from "./teams.module.css";
import {useUpdateTeams} from "./useUpdateTeams";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {actionTypes} from "./constants";
import {updateTeamsReducer} from "./updateTeamsReducer";
import {UpdateTeamsTable, useUpdateTeamsColumns} from "./updateTeamsTable";
import {getRowSelection} from "../utils";
import Button from "../../../../../../components/uielements/button";

const {Option} = Select;

const DEFAULT_TEAM = {key: "choose_team", name: "Choose Target Team"};
const isTargetTeamDefault = (targetTeam) => targetTeam.key === DEFAULT_TEAM.key;

function getTransformedData(selectedRecords, targetTeam) {
  const kvArr = selectedRecords.map((x) => [
    x.key,
    {...x, targetTeam: isTargetTeamDefault(targetTeam) ? x.teamName : targetTeam.name},
  ]);
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
  const getInitialCapacityRecords = () => {
    return selectedRecords.reduce((acc, item) => {
      acc[item.key] = item.capacity != null ? item.capacity : 1;
      return acc;
    }, {});
  };

  const initialState = {
    capacityRecords: getInitialCapacityRecords(),
    localRecords: selectedRecords,
    targetTeam: DEFAULT_TEAM,
    errorMessage: "",
    successMessage: "",
    timeOutExecuting: undefined,
  };

  const [
    {
      capacityRecords,
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

  function handleUpdateTeamClick() {
    const payload = localRecords.map((l) => {
      return {
        contributorKey: l.key,
        newTeamKey: isTargetTeamDefault(targetTeam) ? l.teamKey : targetTeam.key,
        capacity: capacityRecords[l.key],
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

  const handleDoneClick = () => {
    context.go("..", "contributors");
  };

  function isButtonDisabled() {
    const isTargetTeamSet = isTargetTeamDefault(targetTeam) ? localRecords.every((x) => x.teamKey != null) : true;
    // all flows
    if (loading || timeOutExecuting === true || localRecords.length === 0 || !isTargetTeamSet) {
      return true;
    }
  }

  function renderActionButtons() {
    return (
      <div className={styles.updateTeamsActionWrapper}>
        <div className={styles.updateTeamsAction}>
          <Button
            type="primary"
            onClick={handleUpdateTeamClick}
            disabled={isButtonDisabled()}
          >
            Update Team
          </Button>
        </div>
        <div className={styles.updateTeamsDoneAction}>
          <Button
            onClick={handleDoneClick}
            type="secondary"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  const columns = useUpdateTeamsColumns([capacityRecords, dispatch]);
  const data = getTransformedData(selectedRecords, targetTeam);
  const setLocalRecords = (records) => dispatch({type: actionTypes.UPDATE_LOCAL_RECORDS, payload: records});

  function getTitleText() {
    return "Update target team and allocation capacity for below contributors";
  }

  function selectTeamDropdown() {
    const optionElements = [DEFAULT_TEAM, ...teamsList].map((t, index) => (
      <Option key={t.key} value={index}>
        {t.name}
      </Option>
    ));

    function handleDropdownChange(index) {
      const selectedTeam = index === 0 ? DEFAULT_TEAM : teamsList[index - 1];
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
          data-testid="update-teams-select"
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

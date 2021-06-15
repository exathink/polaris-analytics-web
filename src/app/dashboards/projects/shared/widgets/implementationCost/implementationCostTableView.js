import {Alert, Button} from "antd";
import React from "react";
import styles from "./implementationCost.module.css";
import {useUpdateProjectWorkItems} from "./useQueryProjectImplementationCost";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {implementationCostReducer, actionTypes, mode} from "./implementationCostReducer";
import {
  recordMode,
  ImplementationCostTable,
  UncategorizedKey,
  useImplementationCostTableColumns,
} from "./implementationCostTable";

const UncategorizedEpic = {
  id: UncategorizedKey,
  displayId: UncategorizedKey,
  name: UncategorizedKey,
  key: UncategorizedKey,
  workItemType: "epic",
  epicName: UncategorizedKey,
  epicKey: UncategorizedKey,
};
export function ImplementationCostTableView({instanceKey, workItems, loading}) {
  // add UncategorizedEpic
  const newWorkItems = workItems.concat(UncategorizedEpic);
  const initialBudgetRecords = () => {
    const initialState = newWorkItems.reduce((acc, item) => {
      acc[item.key] = {budget: item.budget != null ? item.budget : "", mode: recordMode.INITIAL};
      return acc;
    }, {});
    return initialState;
  };

  const initialState = {
    budgetRecords: initialBudgetRecords(),
    initialBudgetRecords: initialBudgetRecords(),
    mode: mode.INIT,
    errorMessage: "",
    successMessage: "",
  };

  const [state, dispatch] = React.useReducer(implementationCostReducer, initialState);

  React.useEffect(() => {
    // reset state when workItems are changing
    dispatch({type: actionTypes.UPDATE_DEFAULTS, payload: initialBudgetRecords()});
    // eslint-disable-next-line
  }, [workItems]);

  const epicWorkItems = newWorkItems.filter((x) => x.workItemType === "epic");
  const columns = useImplementationCostTableColumns([state.budgetRecords, dispatch], epicWorkItems);

  // mutation to update project analysis periods
  const [mutate, {loading: mutationLoading, client}] = useUpdateProjectWorkItems({
    onCompleted: ({
      updateProjectWorkItems: {
        updateStatus: {success, message},
      },
    }) => {
      if (success) {
        dispatch({type: actionTypes.MUTATION_SUCCESS, payload: "Updated Successfully."});
        client.resetStore();
      } else {
        logGraphQlError("ImplementationCostTableView.useUpdateProjectWorkItems", message);
        dispatch({type: actionTypes.MUTATION_FAILURE, payload: message});
      }
    },
    onError: (error) => {
      logGraphQlError("ImplementationCostTableView.useUpdateProjectWorkItems", error);
      dispatch({type: actionTypes.MUTATION_FAILURE, payload: error.message});
    },
  });

  function handleSaveClick() {
    const workItemsInfoRecords = Object.entries(state.budgetRecords)
      .filter(([key, value]) => key !== UncategorizedKey && value.mode === recordMode.EDIT) // only send edited records for save
      .map(([key, value]) => ({workItemKey: key, budget: value.budget}));

    // call mutation on save button click
    mutate({
      variables: {
        projectKey: instanceKey,
        workItemsInfo: workItemsInfoRecords,
      },
    });
  }

  function handleCancelClick() {
    dispatch({type: actionTypes.RESET});
  }

  function getButtonsAndNotifications() {
    if (mutationLoading) {
      return (
        <Button className={"shiftRight"} type="primary" loading>
          Processing...
        </Button>
      );
    }
    if (state.mode === mode.ERROR) {
      return (
        <Alert
          message={state.errorMessage}
          type="error"
          showIcon
          closable
          onClose={() => dispatch({type: actionTypes.CLOSE_ERROR_MODAL})}
        />
      );
    }

    if (state.mode === mode.SUCCESS) {
      return (
        <Alert
          message={state.successMessage}
          type="success"
          showIcon
          closable
          onClose={() => dispatch({type: actionTypes.CLOSE_SUCCESS_MODAL})}
        />
      );
    }

    if (state.mode === mode.EDITING) {
      return (
        <>
          <Button
            onClick={handleSaveClick}
            className={styles.implementationSave}
            type="primary"
            size="small"
            shape="round"
          >
            Save
          </Button>
          <Button onClick={handleCancelClick} type="default" size="small" shape="round">
            Cancel
          </Button>
        </>
      );
    }
  }

  function getEditRecordsTitle() {
    const editedRecords = Object.entries(state.budgetRecords).filter(
      ([key, value]) => key !== UncategorizedKey && value.mode === recordMode.EDIT
    );

    if (editedRecords.length === 0) {
      return null;
    }
    return <span>Budget Edited for Cards: {editedRecords.length}</span>;
  }

  const getRowClassName = (record, index) => {
    if (state.budgetRecords[record.key] == null) {
      return "";
    }
    return state.budgetRecords[record.key].mode === recordMode.EDIT ? "ant-table-row-selected" : "";
  };

  return (
    <div className={styles.implementationCostTableWrapper}>
      <div className={styles.messageNotification}>{getButtonsAndNotifications()}</div>
      <div className={styles.editRecordsTitle}>{getEditRecordsTitle()}</div>
      <div className={styles.implementationCostTable}>
        <ImplementationCostTable
          columns={columns}
          tableData={newWorkItems}
          loading={loading}
          rowClassName={getRowClassName}
        />
      </div>
    </div>
  );
}

import {Alert} from "antd";
import Button from "../../../../../../components/uielements/button";
import React from "react";
import styles from "./valueBook.module.css";
import {useUpdateProjectWorkItems} from "./useQueryProjectEpicEffort";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {valueBookDetailViewReducer, actionTypes, mode} from "./valueBookDetailViewReducer";
import {
  recordMode,
  EpicEffortTable,
  UncategorizedKey,
  useImplementationCostTableColumns,
} from "./epicEffortTable";
import {WorkItemsEpicEffortChart} from "../../../charts/workItemCharts/workItemsEpicEffortChart";
import {DaysRangeSlider, ONE_YEAR} from "../../../components/daysRangeSlider/daysRangeSlider";
import {Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../../components/workItemScopeSelector/workItemScopeSelector";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../work_items/cardInspector/cardInspectorUtils";
import cn from "classnames";

const UncategorizedEpic = {
  id: UncategorizedKey,
  displayId: UncategorizedKey,
  name: UncategorizedKey,
  key: UncategorizedKey,
  workItemType: "epic",
};
export function ValueBookDetailView({
  instanceKey,
  data,
  loading,
  activeOnly,
  specsOnly,
  days,
  title,
  subtitle,
  view,
  context,
  workItemScope,
  setWorkItemScope,
  setClosedWithinDays,
  epicChartData
}) {
  const workItems = React.useMemo(() => {
    return data ? data.project.workItems.edges.map((edge) => edge.node) : []
  }, [data]);

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

  const [state, dispatch] = React.useReducer(valueBookDetailViewReducer, initialState);
  const [chartPoints, setChartPoints] = React.useState([]);

  React.useEffect(() => {
    // reset state when workItems are changing
    dispatch({type: actionTypes.UPDATE_DEFAULTS, payload: initialBudgetRecords()});
    // reset chart points when workItems are changing
    setChartPoints([]);
    // eslint-disable-next-line
  }, [workItems]);

  const epicWorkItems = newWorkItems.filter((x) => x.workItemType === "epic");

  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  const columns = useImplementationCostTableColumns([state.budgetRecords, dispatch], epicWorkItems, {setShowPanel, setWorkItemKey});

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

  function handleClearClick() {
    dispatch({type: actionTypes.RESET});
    setChartPoints([]);
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
            className={"tw-mr-2"}
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
    return <span>Budget edited for {editedRecords.length} work items.</span>;
  }

  const getRowClassName = (record, index) => {
    if (state.budgetRecords[record.key] == null) {
      return "";
    }
    return state.budgetRecords[record.key].mode === recordMode.EDIT ? "ant-table-row-selected" : "";
  };

  function getTableData() {
    const filteredChartPoints = chartPoints.map(key => workItems.find(x => x.key === key)).filter(Boolean).concat(UncategorizedEpic);
    return chartPoints.length > 0 ? filteredChartPoints : newWorkItems;
  }

  return (
    <div className={styles.implementationCostTableWrapper}>
      <div className={styles.messageNotification}>{getButtonsAndNotifications()}</div>
      <div className={styles.clearButton}>
        {chartPoints.length > 0 && (
          <Button onClick={handleClearClick} type="default" size="small" shape="round">
           Clear selection
          </Button>
        )}
      </div>
      {!activeOnly && (
        <div className={styles.daysRangeSlider}>
          <DaysRangeSlider title={"Days"} initialDays={days} setDaysRange={setClosedWithinDays} range={ONE_YEAR} />
        </div>
      )}
      <div className={styles.scopeSelector}>
        <Flex w={1} justify={"center"}>
          <WorkItemScopeSelector
            display={["Investments", "Work Items"]}
            workItemScope={workItemScope}
            setWorkItemScope={setWorkItemScope}
          />
        </Flex>
      </div>
      <div className={styles.epicEffortChart}>
        <WorkItemsEpicEffortChart
          workItems={epicChartData}
          specsOnly={specsOnly}
          activeOnly={activeOnly}
          days={days}
          title={title}
          subtitle={subtitle}
          view={view}
          context={context}
          setChartPoints={setChartPoints}
        />
      </div>
      <div className={cn(styles.editRecordsTitle, "tw-textXs")}>{getEditRecordsTitle()}</div>
      <div className={styles.implementationCostTable}>
        <EpicEffortTable
          columns={columns}
          tableData={getTableData()}
          loading={loading}
          rowClassName={getRowClassName}
        />
      </div>
      <div className="tw-invisible">
        <CardInspectorWithDrawer
          workItemKey={workItemKey}
          showPanel={showPanel}
          setShowPanel={setShowPanel}
          context={context}
        />
      </div>
    </div>
  );
}

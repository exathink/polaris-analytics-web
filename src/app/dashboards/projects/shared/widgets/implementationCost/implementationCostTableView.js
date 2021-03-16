import {Alert, Button, InputNumber, Table} from "antd";
import React from "react";
import {buildIndex, diff_in_dates} from "../../../../../helpers/utility";
import {formatDateTime} from "../../../../../i18n/utils";
import isEqual from "lodash/isEqual";
import styles from "./implementationCost.module.css";
import {useUpdateProjectWorkItems} from "./useQueryProjectImplementationCost";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {DaysRangeSlider, ONE_YEAR} from "../../../../shared/components/daysRangeSlider/daysRangeSlider";
import {useSearch} from "../../../../../components/tables/hooks";

const mode = {INITIAL: "INITIAL", EDIT: "EDIT"};
const UncategorizedKey = "Uncategorized";
const UncategorizedEpic = {
  id: UncategorizedKey,
  displayId: UncategorizedKey,
  name: UncategorizedKey,
  key: UncategorizedKey,
  workItemType: "epic",
  epicName: UncategorizedKey,
  epicKey: UncategorizedKey,
  effort: null,
  duration: null,
  authorCount: null,
  budget: null,
  startDate: null,
  endDate: null,
  closed: false,
  lastUpdate: null,
  elapsed: null,
};

export function useImplementationCostTableColumns([budgetRecords, setBudgetRecords]) {
  const [nameSearchState, titleSearchState] = [useSearch("name"), useSearch("title")];

  function setValueForBudgetRecord(key, value, initialBudgetValue) {
    setBudgetRecords({
      ...budgetRecords,
      [key]: {budget: value, mode: value !== initialBudgetValue ? mode.EDIT : mode.INITIAL},
    });
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "12%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...nameSearchState,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...titleSearchState,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "5%",
    },
    {
      title: "Cards",
      dataIndex: "cards",
      key: "cards",
      width: "5%",
      sorter: (a, b) => a.cards - b.cards,
    },

    {
      title: "Implementation Cost (Dev-Days)",
      children: [
        {
          title: "Budget",
          dataIndex: "budget",
          key: "budget",
          sorter: (a, b) => a.budget - b.budget,
          width: "10%",
          render: (_text, record) => {
            if (record.key === UncategorizedKey) {
              return null;
            }
            return (
              <InputNumber
                key={record.key}
                min={0}
                max={Infinity}
                value={budgetRecords && budgetRecords[record.key] ? budgetRecords[record.key].budget : ""}
                onChange={(value) => setValueForBudgetRecord(record.key, value, record.budget)}
                type="number"
              />
            );
          },
        },
        {
          title: "Actual",
          dataIndex: "totalEffort",
          key: "totalEffort",
          sorter: (a, b) => a.totalEffort - b.totalEffort,
          width: "7%",
        },
        {
          title: "Contributors",
          dataIndex: "totalContributors",
          key: "totalContributors",
          sorter: (a, b) => a.totalContributors - b.totalContributors,
          width: "9%",
        },
      ],
    },
    {
      title: "Progress",
      children: [
        {
          title: "Started",
          dataIndex: "startDate",
          key: "startDate",
          sorter: (a, b) => diff_in_dates(a.startDate, b.startDate),
        },
        {
          title: "Ended",
          dataIndex: "endDate",
          key: "endDate",
          sorter: (a, b) => diff_in_dates(a.endDate, b.endDate),
        },
        {
          title: "Last Commit",
          dataIndex: "lastUpdate",
          key: "lastUpdate",
          sorter: (a, b) => diff_in_dates(a.lastUpdate, b.lastUpdate),
        },
        {
          title: "Elapsed (Days)",
          dataIndex: "elapsed",
          key: "elapsed",
          sorter: (a, b) => a.elapsed - b.elapsed,
        },
      ],
    },
  ];

  return columns;
}
function getEpicKey(epicKey, epicWorkItemsMap) {
  if (epicKey == null || epicWorkItemsMap.get(epicKey) == null) {
    return null;
  }
  return epicKey;
}

function getEpicWorkItemsMap(epicWorkItems) {
  return new Map(epicWorkItems.map((x) => [x.key, x]));
}

function getTransformedData(epicWorkItemsMap, nonEpicWorkItems, intl) {
  const transformWorkItem = (x) => {
    return {
      key: x.key,
      name: x.displayId,
      title: x.name,
      cards: 1,
      type: x.workItemType,
      budget: x.budget,
      totalEffort: intl.formatNumber(x.effort, {maximumFractionDigits: 2}),
      totalContributors: x.authorCount,
      startDate: x.startDate ? formatDateTime(intl, x.startDate) : "",
      endDate: x.endDate ? formatDateTime(intl, x.endDate) : "",
      lastUpdate: x.lastUpdate ? formatDateTime(intl, x.lastUpdate): "",
      elapsed: intl.formatNumber(x.elapsed, {maximumFractionDigits: 2}),
    };
  };

  const workItemsByEpic = buildIndex(
    nonEpicWorkItems,
    (wi) => getEpicKey(wi.epicKey, epicWorkItemsMap) || UncategorizedKey
  );

  const allEpics = Object.entries(workItemsByEpic).map(([epicKey, epicWorkItems]) => {
    const epicWorkItem = transformWorkItem(epicWorkItemsMap.get(epicKey));
    const epicChildItems = epicWorkItems.map(transformWorkItem);

    return {
      ...epicWorkItem,
      cards: epicChildItems.length,
      children: epicChildItems,
    };
  });

  const UncatEpic = allEpics.filter((x) => x.key === UncategorizedKey);
  const restEpics = allEpics.filter((x) => x.key !== UncategorizedKey);

  return [...UncatEpic, ...restEpics];
}
export function ImplementationCostTableView({
  instanceKey,
  workItems,
  intl,
  commitWithinDays,
  setCommitWithinDays,
  loading,
}) {
  const [epicWorkItems, nonEpicWorkItems] = [
    workItems.filter((x) => x.workItemType === "epic").concat(UncategorizedEpic),
    workItems.filter((x) => x.workItemType !== "epic"),
  ];
  const epicWorkItemsMap = getEpicWorkItemsMap(epicWorkItems);

  const initialBudgetRecords = () => {
    const initialState = workItems.reduce((acc, item) => {
      acc[item.key] = {budget: item.budget || 0, mode: mode.INITIAL};
      return acc;
    }, {});
    return initialState;
  };
  const [budgetRecords, setBudgetRecords] = React.useState(initialBudgetRecords);
  const [[errorMessage, setErrorMessage], [successMessage, setSuccessMessage]] = [
    React.useState(""),
    React.useState(""),
  ];

  React.useEffect(() => {
    // reset state when workItems are changing
    setBudgetRecords(initialBudgetRecords());
  }, [workItems]);

  const columns = useImplementationCostTableColumns([budgetRecords, setBudgetRecords]);
  const dataSource = getTransformedData(epicWorkItemsMap, nonEpicWorkItems, intl);

  // mutation to update project analysis periods
  const [mutate, {loading: mutationLoading, client}] = useUpdateProjectWorkItems({
    onCompleted: ({
      updateProjectWorkItems: {
        updateStatus: {success, message},
      },
    }) => {
      if (success) {
        setSuccessMessage("Updated Successfully.");
        client.resetStore();
      } else {
        logGraphQlError("ImplementationCostTableView.useUpdateProjectWorkItems", message);
        setErrorMessage(message);
      }
    },
    onError: (error) => {
      logGraphQlError("ImplementationCostTableView.useUpdateProjectWorkItems", error);
      setErrorMessage(error);
    },
  });

  function handleSaveClick() {
    const workItemsInfoRecords = Object.entries(budgetRecords)
      .filter(([key, value]) => key !== UncategorizedKey && value.mode === mode.EDIT) // only send edited records for save
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
    setBudgetRecords(initialBudgetRecords());
  }

  function getButtonsAndNotifications() {
    if (mutationLoading) {
      return (
        <Button className={"shiftRight"} type="primary" loading>
          Processing...
        </Button>
      );
    }
    if (errorMessage) {
      return <Alert message={errorMessage} type="error" showIcon closable onClose={() => setErrorMessage("")} />;
    }

    if (successMessage) {
      return <Alert message={successMessage} type="success" showIcon closable onClose={() => setSuccessMessage("")} />;
    }

    const isEditingMode = !isEqual(budgetRecords, initialBudgetRecords());
    if (isEditingMode) {
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

  return (
    <div className={styles.implementationCostTableWrapper}>
      <div className={styles.messageNotification}>{getButtonsAndNotifications()}</div>
      <div className={styles.implementationCostSlider}>
        <div>Active Within</div>
        <div className={styles.rangeSliderWrapper}>
          <DaysRangeSlider
            title=""
            initialDays={commitWithinDays}
            setDaysRange={setCommitWithinDays}
            range={ONE_YEAR}
          />
        </div>
        <div>Days</div>
      </div>
      <div className={styles.implementationCostTable}>
        <Table
          loading={loading}
          size="small"
          pagination={false}
          columns={columns}
          dataSource={dataSource}
          scroll={{y: "60vh"}}
          showSorterTooltip={false}
          data-testid="implementation-cost-table"
          bordered={true}
        />
      </div>
    </div>
  );
}

import {InputNumber, Table} from "antd";
import React from "react";
import {buildIndex} from "../../../../../helpers/utility";
import {formatDateTime} from "../../../../../i18n/utils";
import styles from "./implementationCost.css";

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

export function useImplementationCostTableColumns(workItems) {
  // const [nameSearchState, aliasSearchState] = [useSearch("name"), useSearch("alias")];

  const [budgetRecords, setBudgetRecords] = React.useState(() => {
    const initialState = workItems.reduce((acc, item) => {
      acc[item.key] = item.budget || 0;
      return acc;
    }, {});
    return initialState;
  });
  function setValueForBudgetRecord(key, value) {
    setBudgetRecords({...budgetRecords, [key]: value});
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "12%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
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
    },

    {
      title: "Implementation Cost (Dev-Days)",
      children: [
        {
          title: "Budget",
          dataIndex: "budget",
          key: "budget",
          render: (_text, record) => {
            return (
              <InputNumber
                key={record.key}
                min={0}
                max={Infinity}
                value={budgetRecords[record.key]}
                onChange={(value) => setValueForBudgetRecord(record.key, value)}
                type="number"
              />
            );
          },
        },
        {
          title: "Actual",
          dataIndex: "totalEffort",
          key: "totalEffort",
        },
        {
          title: "Contributors",
          dataIndex: "totalContributors",
          key: "totalContributors",
        },
      ],
    },
    {
      title: "Progress",
      children: [
        {
          title: "Started",
          dataIndex: "startDate",
          key: "started",
        },
        {
          title: "Ended",
          dataIndex: "endDate",
          key: "started",
        },
        {
          title: "Last Update",
          dataIndex: "lastUpdate",
          key: "lastUpdate",
        },
        {
          title: "Elapsed (Days)",
          dataIndex: "elapsed",
          key: "elapsed",
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
      startDate: formatDateTime(intl, x.startDate),
      endDate: formatDateTime(intl, x.endDate),
      lastUpdate: formatDateTime(intl, x.lastUpdate),
      elapsed: intl.formatNumber(x.elapsed, {maximumFractionDigits: 2}),
    };
  };

  const workItemsByEpic = buildIndex(
    nonEpicWorkItems,
    (wi) => getEpicKey(wi.epicKey, epicWorkItemsMap) || UncategorizedKey
  );

  return Object.entries(workItemsByEpic).map(([epicKey, epicWorkItems]) => {
    const epicWorkItem = transformWorkItem(epicWorkItemsMap.get(epicKey));
    const epicChildItems = epicWorkItems.map(transformWorkItem);

    return {
      ...epicWorkItem,
      cards: epicChildItems.length,
      children: epicChildItems,
    };
  });
}
export function ImplementationCostTableView({workItems, days, view, intl, loading}) {
  const [epicWorkItems, nonEpicWorkItems] = [
    workItems.filter((x) => x.workItemType === "epic").concat(UncategorizedEpic),
    workItems.filter((x) => x.workItemType !== "epic"),
  ];
  const epicWorkItemsMap = getEpicWorkItemsMap(epicWorkItems);

  const columns = useImplementationCostTableColumns(workItems.concat(UncategorizedEpic));
  const dataSource = getTransformedData(epicWorkItemsMap, nonEpicWorkItems, intl);

  return (
    <div className={styles.implementationCostTableWrapper}>
      <Table
        loading={loading}
        size="small"
        pagination={false}
        // childrenColumnName="contributorAliasesInfo"
        columns={columns}
        dataSource={dataSource}
        scroll={{y: "60vh"}}
        showSorterTooltip={false}
        data-testid="implementation-cost-table"
        bordered={true}
      />
    </div>
  );
}

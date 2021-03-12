import {Table} from "antd";
import React from "react";
import {buildIndex} from "../../../../../helpers/utility";
import {formatDateTime} from "../../../../../i18n/utils";
import styles from "./implementationCost.css";

export function useImplementationCostTableColumns() {
  // const [nameSearchState, aliasSearchState] = [useSearch("name"), useSearch("alias")];
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "25%",
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

function getTransformedData(workItems, intl) {
  const transformWorkItem = (x) => {
    if (x === undefined) {
      debugger;
    }
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

  const kvArr = workItems
    .map((x) => [x.key, x])
    .concat([
      [
        "Uncategorized",
        {
          id: "Uncategorized",
          displayId: "Uncategorized",
          name: "Uncategorized",
          key: "Uncategorized",
          workItemType: "epic",
          epicName: "Uncategorized",
          epicKey: "Uncategorized",
          effort: null,
          duration: null,
          authorCount: null,
          budget: null,
          startDate: null,
          endDate: null,
          closed: false,
          lastUpdate: null,
          elapsed: null,
        },
      ],
    ]);

  const workItemsData = new Map(kvArr);

  const workItemsByEpic = buildIndex(workItems, (wi) => wi.epicKey || "Uncategorized");

  return Object.entries(workItemsByEpic).map(([epicKey, epicWorkItems]) => {
    const epicWorkItem = transformWorkItem(workItemsData.get(epicKey));

    const epicChildItems = epicWorkItems.map(transformWorkItem);

    return {
      ...epicWorkItem,
      cards: epicChildItems.length,
      children: epicChildItems,
    };
  });
}
export function ImplementationCostTableView({workItems, days, view, intl, loading}) {
  const columns = useImplementationCostTableColumns();
  const dataSource = getTransformedData(workItems, intl);

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

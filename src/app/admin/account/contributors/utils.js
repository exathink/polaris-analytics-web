import {useSearch} from "../../../components/tables/hooks";
import {diff_in_dates} from "../../../helpers/utility";

function getBaseColumns() {
  return {
    name: {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    alias: {
      title: "Alias",
      dataIndex: "alias",
      key: "alias",
    },
    latestCommit: {
      title: "Latest Commit",
      dataIndex: "latestCommit",
      key: "latestCommit",
    },
    commitCount: {
      title: "Total Commits",
      dataIndex: "commitCount",
      key: "commitCount",
      align: "center",
    },
    alias_count: {
      title: "Aliases",
      dataIndex: "alias_count",
      key: "alias_count",
      align: "center",
      defaultSortOrder: "ascend",
    },
  };
}

export function useSelectContributorsTableColumns() {
  const [nameSearchState, aliasSearchState] = [useSearch("name"), useSearch("alias")];
  const baseCols = getBaseColumns();
  const columns = [
    {
      ...baseCols.name,
      width: "25%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...nameSearchState,
    },
    {
      ...baseCols.alias,
      width: "25%",
      sorter: (a, b) => a.alias.localeCompare(b.alias),
      ...aliasSearchState,
    },
    {
      ...baseCols.latestCommit,
      width: "17%",
      sorter: (a, b) => diff_in_dates(a.latestCommit, b.latestCommit),
    },
    {
      ...baseCols.commitCount,
      width: "17%",
      sorter: (a, b) => a.commitCount - b.commitCount,
    },
    {
      ...baseCols.alias_count,
      width: "16%",
      sorter: (a, b) => a.alias_count - b.alias_count,
    },
  ];
  return columns;
}

export function useMergeContributorsTableColumns() {
  const [nameSearchState, aliasSearchState] = [useSearch("name"), useSearch("alias")];
  const baseCols = getBaseColumns();
  const columns = [
    {
      ...baseCols.name,
      width: "25%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...nameSearchState,
    },
    {
      ...baseCols.alias,
      width: "25%",
      sorter: (a, b) => a.alias.localeCompare(b.alias),
      ...aliasSearchState,
    },
    {
      ...baseCols.latestCommit,
      width: "17%",
      sorter: (a, b) => diff_in_dates(a.latestCommit, b.latestCommit),
    },
    {
      ...baseCols.commitCount,
      width: "17%",
      sorter: (a, b) => a.commitCount - b.commitCount,
    },
  ];
  return columns;
}

export function getAccountContributorsTableColumns() {
  const baseCols = getBaseColumns();
  return [
    {
      ...baseCols.name,
      width: "40%",
    },
    {
      ...baseCols.latestCommit,
      width: "40%",
    },
    {
      ...baseCols.alias_count,
      defaultSortOrder: "descend",
      width: "20%",
      sorter: (a, b) => a.alias_count - b.alias_count,
    },
  ];
}

export function getRowSelection(data, [selectedRecords, setSelectedRecords], options = {}) {
  return {
    hideSelectAll: true,
    selectedRowKeys: selectedRecords.map((s) => s.key),
    onSelect: (_record, _selected, selectedRows) => {
      setSelectedRecords(selectedRows.map((x) => data.get(x.key)));
    },
    ...options,
  };
}

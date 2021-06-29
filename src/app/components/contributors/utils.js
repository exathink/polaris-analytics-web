import {useSearch} from "../tables/hooks";
import {diff_in_dates} from "../../helpers/utility";

export const VERTICAL_SCROLL_HEIGHT = "45vh";
export const SCROLL_HEIGHT_UPDATE_CONTRIBUTORS = "40vh";
export const ACTIVE_WITHIN_DAYS = 30;

export function getBaseColumns() {
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
    select_parent_contributor: {
      title: " ",
      dataIndex: "select_parent_contributor",
      key: "select_parent_contributor",
    },
    unlink_alias_switch: {
      title: " ",
      dataIndex: "unlink_alias_switch",
      key: "unlink_alias_switch"
    }
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

export function useUpdateContributorTableColumns() {
  const [nameSearchState, aliasSearchState] = [useSearch("name"), useSearch("alias")];
  const baseCols = getBaseColumns();
  const columns = [
    {
      ...baseCols.name,
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...nameSearchState,
    },
    {
      ...baseCols.alias,
      width: "30%",
      sorter: (a, b) => a.alias.localeCompare(b.alias),
      ...aliasSearchState,
    },
    {
      ...baseCols.latestCommit,
      width: "20%",
      sorter: (a, b) => diff_in_dates(a.latestCommit, b.latestCommit),
    },
    {
      ...baseCols.commitCount,
      width: "20%",
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

export const withNoChildren = (x) => x.contributorAliasesInfo == null;
export const withChildren = (x) => x.contributorAliasesInfo != null;

export const NavigateOnDoneHandlers = (context) => ({
  account: () => context.go(".."),
  organization: () => context.go("..", "contributors")
})
import {useSearch} from "../../../../../components/tables/hooks";
import {StripeTable} from "../../../../../components/tables/tableUtils";
import {diff_in_dates} from "../../../../../helpers/utility";

export const ACTIVE_WITHIN_DAYS = 30;

export function useSelectTeamMembersColumns() {
  const [nameSearchState, teamNameSearchState] = [useSearch("name"), useSearch("teamName")];
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...nameSearchState,
    },
    {
      title: "Current Team",
      dataIndex: "teamName",
      key: "teamName",
      width: "25%",
      sorter: (a, b) => a.teamName.localeCompare(b.teamName),
      ...teamNameSearchState,
    },
    {
      title: "Latest Commit",
      dataIndex: "latestCommit",
      key: "latestCommit",
      width: "20%",
      sorter: (a, b) => diff_in_dates(a.latestCommit, b.latestCommit),
    },
    {
      title: "Total Commits",
      dataIndex: "commitCount",
      key: "commitCount",
      width: "20%",
      sorter: (a, b) => a.commitCount - b.commitCount,
    }
  ];
  return columns;
}
export function SelectTeamMembersTable({tableData, columns, loading, testId, rowSelection}) {
  return <StripeTable dataSource={tableData} columns={columns} loading={loading} testId={testId} height="45vh" rowSelection={rowSelection}/>;
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

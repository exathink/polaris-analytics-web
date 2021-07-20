import {useSearch} from "../../../../../components/tables/hooks";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../../components/tables/tableUtils";

const DEFAULT_TEAM = "Unassigned";

function customTeamNameRender(text, record, searchText) {
  return text ?? DEFAULT_TEAM;
}

export function useSelectTeamMembersColumns() {
  const [nameSearchState, teamNameSearchState] = [
    useSearch("name"),
    useSearch("teamName", {customRender: customTeamNameRender}),
  ];
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a, b) => SORTER.string_compare(a.name, b.name),
      ...nameSearchState,
    },
    {
      title: "Current Team",
      dataIndex: "teamName",
      key: "teamName",
      width: "25%",
      sorter: (a, b) => SORTER.string_compare(a.teamName, b.teamName),
      ...teamNameSearchState,
    },
    {
      title: "Latest Commit",
      dataIndex: "latestCommit",
      key: "latestCommit",
      width: "20%",
      sorter: (a, b) => SORTER.date_compare(a.latestCommit, b.latestCommit),
    },
    {
      title: "Total Commits",
      dataIndex: "commitCount",
      key: "commitCount",
      width: "20%",
      sorter: (a, b) => SORTER.number_compare(a.commitCount, b.commitCount),
    },
  ];
  return columns;
}
export function SelectTeamMembersTable({tableData, columns, loading, testId, rowSelection}) {
  return (
    <StripeTable
      dataSource={tableData}
      columns={columns}
      loading={loading}
      testId={testId}
      height={TABLE_HEIGHTS.FORTY_FIVE}
      rowSelection={rowSelection}
    />
  );
}

import {useSearch} from "../../../../../components/tables/hooks";
import {SORTER, StripeTable} from "../../../../../components/tables/tableUtils";


export function useSelectTeamMembersColumns(filters) {
  const nameSearchState =  useSearch("name");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
      sorter: (a, b) => SORTER.string_compare(a.name, b.name),
      ...nameSearchState,
    },
    {
      title: "Current Team",
      dataIndex: "teamName",
      key: "teamName",
      width: "20%",
      sorter: (a, b) => SORTER.string_compare(a.teamName, b.teamName),
      filters: filters.teams.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.teamName.indexOf(value) === 0,
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
      width: "15%",
      sorter: (a, b) => SORTER.number_compare(a.commitCount, b.commitCount),
    },
    {
      title: "Coding Capacity",
      dataIndex: "capacity",
      key: "capacity",
      width: "20%",
      sorter: (a, b) => SORTER.number_compare(a.capacity, b.capacity),
      render: (text, record) => {
        if (text != null) {
          return <span>{+text * 100}%</span>;
        } else {
          return null;
        }
      },
    },
  ];
  return columns;
}
export function SelectTeamMembersTable({tableData, loading, testId, rowSelection}) {
  const teams = [...new Set(tableData.map((x) => x.teamName))];
  const filters = {teams};
  const columns = useSelectTeamMembersColumns(filters);
  return (
    <StripeTable
      dataSource={tableData}
      columns={columns}
      loading={loading}
      testId={testId}
      rowSelection={rowSelection}
      rowKey={(record) => record.key}
    />
  );
}

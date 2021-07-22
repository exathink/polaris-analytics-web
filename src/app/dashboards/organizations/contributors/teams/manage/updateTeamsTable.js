import {useSearch} from "../../../../../components/tables/hooks";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../../components/tables/tableUtils";

const DEFAULT_TEAM = "Unassigned";

function customTeamNameRender(text, record, searchText) {
  return text ?? DEFAULT_TEAM;
}

export function useUpdateTeamsColumns() {
  const [nameSearchState, teamNameSearchState] = [
    useSearch("name"),
    useSearch("teamName", {customRender: customTeamNameRender}),
  ];
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "40%",
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
      title: "Target Team",
      dataIndex: "targetTeam",
      key: "targetTeam",
      width: "25%",
      render: (text, record) => {
        return text;
      },
    },
  ];
  return columns;
}
export function UpdateTeamsTable({tableData, columns, loading, testId, rowSelection}) {
  return (
    <StripeTable
      dataSource={tableData}
      columns={columns}
      loading={loading}
      testId={testId}
      height={TABLE_HEIGHTS.FORTY_FIVE}
      rowSelection={rowSelection}
      rowKey={record => record.key}
    />
  );
}

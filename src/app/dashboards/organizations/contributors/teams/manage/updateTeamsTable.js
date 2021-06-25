import {useSearch} from "../../../../../components/tables/hooks";
import {StripeTable} from "../../../../../components/tables/tableUtils";

export const ACTIVE_WITHIN_DAYS = 30;
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
      height="45vh"
      rowSelection={rowSelection}
    />
  );
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

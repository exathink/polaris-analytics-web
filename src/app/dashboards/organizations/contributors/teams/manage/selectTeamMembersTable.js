import {Highlighter} from "../../../../../components/misc/highlighter";
import {useSearch} from "../../../../../components/tables/hooks";
import {SORTER, StripeTable} from "../../../../../components/tables/tableUtils";

const DEFAULT_TEAM = "Unassigned";

function customTeamNameRender(text, record, searchText) {
  let customText = text || DEFAULT_TEAM;

  return (
    <Highlighter
      highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
      searchWords={searchText || ""}
      textToHighlight={customText.toString()}
    />
  );
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
export function SelectTeamMembersTable({tableData, columns, loading, testId, rowSelection}) {
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

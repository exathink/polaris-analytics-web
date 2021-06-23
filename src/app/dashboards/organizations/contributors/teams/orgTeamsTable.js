import React from "react";
import {PaginatedTable} from "../../../../components/tables/tableUtils";

export function useOrgTeamsTableColumns() {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "15%",
    },
    {
      title: "Contributors",
      dataIndex: "contributorCount",
      key: "contributorCount",
      width: "10%",
    },
    {
      title: "Last Commit",
      dataIndex: "latestCommit",
      key: "latestCommit",
      width: "15%",
    },
  ];

  return columns;
}

export function OrgTeamsTable({tableData}) {
  const columns = useOrgTeamsTableColumns();

  const paginationOptions = {showTotal: total => `${total} Teams`};
  return <PaginatedTable columns={columns} dataSource={tableData} options={paginationOptions}/>;
}

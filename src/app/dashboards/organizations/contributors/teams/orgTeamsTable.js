import React from "react";
import {useSearch} from "../../../../components/tables/hooks";
import {StripeTable, TABLE_HEIGHTS} from "../../../../components/tables/tableUtils";

export function useOrgTeamsTableColumns() {
  const nameSearchState = useSearch("name");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "15%",
      ...nameSearchState
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

  return <StripeTable columns={columns} dataSource={tableData} height={TABLE_HEIGHTS.FOURTY_FIVE} />;
}

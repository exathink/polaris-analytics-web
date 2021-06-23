import React from "react";
import {BaseTable} from "../../../../components/tables/tableUtils";
import Button from "../../../../../components/uielements/button";

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
      title: "Value Streams",
      dataIndex: "project",
      key: "project",
      width: "10%",
    },
    {
      title: "Last Commit",
      dataIndex: "latestCommit",
      key: "latestCommit",
      width: "15%",
    },
    {
      title: "Last Project Activity",
      dataIndex: "lastProjectActivity",
      key: "lastProjectActivity",
      width: "15%",
    },
    {
      title: "",
      key: "actions",
      width: "10%",
      render: (text, record) => (
        <Button type={"primary"} size={"small"}>
          Select
        </Button>
      ),
    },
  ];

  return columns;
}

export function OrgTeamsTable({tableData}) {
  const columns = useOrgTeamsTableColumns();
  return <BaseTable columns={columns} dataSource={tableData} />;
}

import React from "react";
import {BaseTableView} from "../../../projects/shared/components/baseTableView";

export function useOrgTeamsTableColumns() {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "15%"
    },
    {
      title: "Contributors",
      dataIndex: "contributors",
      key: "contributors",
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
      render: () => <div></div>
    }
  ];

  return columns;
}

export function OrgTeamsTable({tableData}) {

  const columns = useOrgTeamsTableColumns();
  return <BaseTableView columns={columns} dataSource={[]} />;
}

import React from "react";
import {useSearch} from "../../../../components/tables/hooks";
import {StripeTable, TABLE_HEIGHTS} from "../../../../components/tables/tableUtils";
import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import Button from "../../../../../components/uielements/button";
import {CreateNewTeamWidget} from "./createNewTeam";
import {TeamLink} from "../../../shared/navigation/teamLink";
import {fromNow} from "../../../../helpers/utility";

export function useOrgTeamsTableColumns() {
  const nameSearchState = useSearch("name");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "15%",
      ...nameSearchState,
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
      width: "20%",
      render: (name, record) => (
        fromNow(record.latestCommit)
      )
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      width: "4%",
      align: "right",
      render: (name, record) => (
        <ButtonBar>
          <TeamLink teamName={record.name} teamKey={record.key}>
            <Button type={"primary"} size={"small"}>
              Select
            </Button>
          </TeamLink>
        </ButtonBar>
      ),
    },
  ];

  return columns;
}

export function OrgTeamsTable({tableData, organizationKey}) {
  const columns = useOrgTeamsTableColumns();

  const locale = {
    emptyText: () => <CreateNewTeamWidget organizationKey={organizationKey} />,
  };

  return (
    <StripeTable
      columns={columns}
      dataSource={tableData}
      height={TABLE_HEIGHTS.FORTY_FIVE}
      locale={locale}
      rowKey={(record) => record.key}
    />
  );
}

import React from "react";
import {useQueryRepositories} from "./useQueryRepositories";
import {useSearch} from "../../../../components/tables/hooks";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../components/tables/tableUtils";
import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import Button from "../../../../../components/uielements/button";
import {fromNow, human_span} from "../../../../helpers/utility";
import {RepositoryLink} from "../../../shared/navigation/repositoryLink";
import {getActivityLevelFromDate} from "../../../shared/helpers/activityLevel";

export function useRepositoriesTableColumns({statusTypes}) {
  const nameSearchState = useSearch("name");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "15%",
      ...nameSearchState,
      //   render: (name, record) => (
      //     <RepositoryLink repositoryName={record.name} repositoryKey={record.key}>
      //       {name}
      //     </RepositoryLink>
      //   ),
    },
    {
      title: "Commits",
      dataIndex: "commitCount",
      key: "commitCount",
      width: "7%",
      sorter: (a, b) => SORTER.number_compare(a.commitCount, b.commitCount),
    },
    {
      title: "Contributors",
      dataIndex: "contributorCount",
      key: "contributorCount",
      width: "6%",
      sorter: (a, b) => SORTER.number_compare(a.contributorCount, b.contributorCount),
    },
    {
      title: "History",
      dataIndex: "earliestCommit",
      key: "earliestCommit",
      width: "10%",
      render: (_, record) => human_span(record.latestCommit, record.earliestCommit),
    },
    {
      title: "Latest Commit",
      dataIndex: "latestCommit",
      key: "latestCommit",
      width: "8%",
      sorter: (a, b) => SORTER.date_compare(b.latestCommit, a.latestCommit),
      render: (latestCommit) => fromNow(latestCommit),
    },
    {
      title: "Status",
      dataIndex: "latestCommit",
      key: "activityProfile",
      width: "5%",
      filters: statusTypes.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => getActivityLevelFromDate(record.latestCommit).display_name.indexOf(value)===0,
      render: (latestCommit) => getActivityLevelFromDate(latestCommit).display_name,
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      width: "4%",
      align: "right",
      render: (name, record) => (
        <ButtonBar>
          <RepositoryLink repositoryName={record.name} repositoryKey={record.key}>
            <Button type={"primary"} size={"small"}>
              Select
            </Button>
          </RepositoryLink>
        </ButtonBar>
      ),
    },
  ];

  return columns;
}

export function RepositoriesTable({tableData, loading}) {
  const statusTypes = [...new Set(tableData.map((x) => getActivityLevelFromDate(x.latestCommit).display_name))];
  const columns = useRepositoriesTableColumns({statusTypes});

  return <StripeTable columns={columns} dataSource={tableData} loading={loading} height={TABLE_HEIGHTS.FOURTY_FIVE} />;
}

export const RepositoriesTableWidget = ({dimension, instanceKey}) => {
  const {loading, error, data} = useQueryRepositories({dimension, instanceKey});

  if (error) return null;

  const edges = data?.[dimension]?.["repositories"]?.["edges"] ?? [];
  const tableData = edges.map((edge) => edge.node).sort((a, b) => SORTER.date_compare(b.latestCommit, a.latestCommit));

  return <RepositoriesTable tableData={tableData} loading={loading} />;
};

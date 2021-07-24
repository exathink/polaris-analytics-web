import React from "react";
import {ProjectLink} from "../../../shared/navigation/projectLink";
import {fromNow} from "../../../../helpers/utility";
import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import Button from "../../../../../components/uielements/button";
import {useQueryOrganizationProjects} from "./useQueryOrganizationProjects";
import {useSearch} from "../../../../components/tables/hooks";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../components/tables/tableUtils";

export function useOrgProjectsTableColumns() {
  const nameSearchState = useSearch("name");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "15%",
      ...nameSearchState,
      // (name, record) => (
      //   <ProjectLink projectName={record.name} projectKey={record.key}>
      //     {name}
      //   </ProjectLink>
      // )
    },
    {
      title: "Work Streams",
      dataIndex: "subProjectCount",
      key: "subProjectCount",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.subProjectCount, b.subProjectCount),
    },
    {
      title: "Repositories",
      dataIndex: "repositoryCount",
      key: "repositoryCount",
      width: "6%",
      sorter: (a, b) => SORTER.number_compare(a.repositoryCount, b.repositoryCount),
    },
    {
      title: "Last Commit",
      dataIndex: "latestCommit",
      key: "latestCommit",
      width: "8%",
      sorter: (a, b) => SORTER.date_compare(b.latestCommit, a.latestCommit),
      render: (latestCommit) => fromNow(latestCommit),
    },
    {
      title: "Last Project Activity",
      dataIndex: "latestWorkItemEvent",
      key: "latestWorkItemEvent",
      width: "10%",
      sorter: (a, b) => SORTER.date_compare(b.latestWorkItemEvent, a.latestWorkItemEvent),
      render: (latestWorkItemEvent) => fromNow(latestWorkItemEvent),
    },
    {
      title: "",
      key: "actions",
      width: "4%",
      align: "right",
      render: (name, record) => (
        <ButtonBar>
          <ProjectLink projectName={record.name} projectKey={record.key}>
            <Button type={"primary"} size={"small"}>
              Select
            </Button>
          </ProjectLink>
        </ButtonBar>
      ),
    },
  ];

  return columns;
}

export function ProjectsTable({tableData, loading}) {
  const columns = useOrgProjectsTableColumns();

  return (
    <StripeTable
      columns={columns}
      dataSource={tableData}
      loading={loading}
      height={TABLE_HEIGHTS.FOURTY_FIVE}
      rowKey={(record) => record.key}
    />
  );
}

export const ProjectsTableWidget = ({organizationKey}) => {
  const {error, loading, data} = useQueryOrganizationProjects({organizationKey});

  if (error) return null;

  const edges = data?.["organization"]?.["projects"]?.["edges"] ?? [];
  const tableData = edges
    .map((edge) => ({...edge.node, subProjectCount: edge.node.workItemsSources.count}))
    .sort((a, b) => SORTER.date_compare(b.latestWorkItemEvent, a.latestWorkItemEvent));

  return <ProjectsTable tableData={tableData} loading={loading} />;
};

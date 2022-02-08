import React from "react";
import {ProjectLink} from "../../../shared/navigation/projectLink";
import {fromNow, truncateString} from "../../../../helpers/utility";
import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import Button from "../../../../../components/uielements/button";
import {useQueryOrganizationProjects} from "./useQueryOrganizationProjects";
import {useSearch} from "../../../../components/tables/hooks";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../components/tables/tableUtils";
import {Highlighter} from "../../../../components/misc/highlighter";
import {Tag, Tooltip} from "antd";

function customNameRender(text, record, searchText) {
  return (
    text && (
      <ProjectLink projectName={record.name} projectKey={record.key}>
        <span style={{cursor: "pointer"}}>
          <Highlighter
            highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
            searchWords={searchText || ""}
            textToHighlight={text.toString()}
          />
        </span>
      </ProjectLink>
    )
  );
}

const TOOLTIP_COLOR = "#6b7280";
const TAG_COLOR="blue";
function CustomTag({children}) {
  return (
    <div>
      <Tag color={TAG_COLOR} style={{marginTop: "5px"}}>
        {children}
      </Tag>
    </div>
  );
}

function subProjectRender(text, record) {
  const fullNodeWithTooltip = (
    <div>
      {record.subProjectLabels.map((x) => (
        <CustomTag key={x}>
          {truncateString(x, 20, TOOLTIP_COLOR)}
        </CustomTag>
      ))}
    </div>
  );
  const fullNode = (
    <div>
      {record.subProjectLabels.map((x) => (
        <CustomTag key={x}>
          {x}
        </CustomTag>
      ))}
    </div>
  );
  const partialNode = (
    <div>
      {record.subProjectLabels.slice(0, 2).map((x) => (
        <CustomTag key={x}>
          {truncateString(x, 20, TOOLTIP_COLOR)}
        </CustomTag>
      ))}
    </div>
  );
  if (record.subProjectLabels.length > 2) {
    return (
      <div>
        {partialNode}
        <div style={{cursor: "pointer"}}>
          <Tooltip title={fullNode} color={TOOLTIP_COLOR}>
            <span style={{fontSize: "20px", color: TAG_COLOR}}>...</span>
          </Tooltip>
        </div>
      </div>
    );
  }
  return fullNodeWithTooltip;
}

export function useOrgProjectsTableColumns() {
  const nameSearchState = useSearch("name", {customRender: customNameRender});
  const subProjectRenderState = {render: subProjectRender};

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "12%",
      ...nameSearchState,
    },
    {
      title: "Work Streams",
      dataIndex: "subProjectCount",
      key: "subProjectCount",
      width: "8%",
      sorter: (a, b) => SORTER.number_compare(a.subProjectCount, b.subProjectCount),
      ...subProjectRenderState
    },
    {
      title: "Repositories",
      dataIndex: "repositoryCount",
      key: "repositoryCount",
      width: "6%",
      sorter: (a, b) => SORTER.number_compare(a.repositoryCount, b.repositoryCount),
    },
    {
      title: "Contributors",
      dataIndex: "contributorCount",
      key: "contributorCount",
      width: "6%",
      sorter: (a, b) => SORTER.number_compare(a.contributorCount, b.contributorCount),
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
    .map((edge) => ({...edge.node, subProjectCount: edge.node.workItemsSources.count, subProjectLabels: edge.node.workItemsSources.edges.map(edge => edge.node.name)}))
    .sort((a, b) => SORTER.date_compare(b.latestWorkItemEvent, a.latestWorkItemEvent));

  return <ProjectsTable tableData={tableData} loading={loading} />;
};

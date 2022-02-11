import React from "react";
import {ProjectLink} from "../../../shared/navigation/projectLink";
import {fromNow, getNumber, truncateString} from "../../../../helpers/utility";
import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import Button from "../../../../../components/uielements/button";
import {useQueryOrganizationProjects} from "./useQueryOrganizationProjects";
import {useSearch} from "../../../../components/tables/hooks";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../components/tables/tableUtils";
import {Highlighter} from "../../../../components/misc/highlighter";
import {Tag, Tooltip} from "antd";
import { injectIntl } from "react-intl";
import {renderTrendMetric} from "../../../shared/helpers/renderers";
import {TrendIndicator} from "../../../../components/misc/statistic/statistic";

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
const TAG_COLOR="#108ee9";
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

function renderMetric(text) {
  return text === "N/A" ? <span className="textXs">N/A</span> : <span className="textXs">{text}</span>;
}

export function useOrgProjectsTableColumns(measurementWindow) {
  const nameSearchState = useSearch("name", {customRender: customNameRender});
  const subProjectRenderState = {render: subProjectRender};

  const columns = [
    {
      title: "Value Stream",
      dataIndex: "name",
      key: "name",
      width: "10%",
      ...nameSearchState,
    },
    {
      title: "Work Streams",
      dataIndex: "subProjectCount",
      key: "subProjectCount",
      width: "7%",
      sorter: (a, b) => SORTER.number_compare(a.subProjectCount, b.subProjectCount),
      ...subProjectRenderState,
    },
    {
      title: "Repos",
      dataIndex: "repositoryCount",
      key: "repositoryCount",
      width: "4%",
      sorter: (a, b) => SORTER.number_compare(a.repositoryCount, b.repositoryCount),
      render: renderMetric
    },
    {
      title: "Contributors",
      dataIndex: "contributorCount",
      key: "contributorCount",
      width: "6%",
      sorter: (a, b) => SORTER.number_compare(a.contributorCount, b.contributorCount),
      render: renderMetric
    },
    {
      title: (
        <span>
          Response Time <sup>Last {measurementWindow} Days</sup>
        </span>
      ),
      children: [
        {
          title: "Lead Time",
          dataIndex: "leadTime",
          key: "leadTime",
          width: "5%",
          sorter: (a, b) => SORTER.number_compare(a.leadTime, b.leadTime),
          render: renderTrendMetric({metric: "avgLeadTime", good: TrendIndicator.isNegative})
        },
        {
          title: "Cycle Time",
          dataIndex: "cycleTime",
          key: "cycleTime",
          width: "5%",
          sorter: (a, b) => SORTER.number_compare(a.cycleTime, b.cycleTime),
          render: renderTrendMetric({metric: "avgCycleTime", good: TrendIndicator.isNegative})
        },
      ],
    },
    {
      title: (
        <span>
          Throughput <sup>Last {measurementWindow} Days</sup>
        </span>
      ),
      children: [
        {
          title: <span>Specs <sup>PC</sup> </span>,
          dataIndex: "specs",
          key: "specs",
          width: "5%",
          sorter: (a, b) => SORTER.number_compare(a.specs, b.specs),
          render: renderTrendMetric({metric: "specs", good: TrendIndicator.isPositive, uom: ""})
        },
        {
          title: (
            <span>
              Effort
              <sub>
                <em>Out</em>
              </sub>
              <sup>PC</sup>
            </span>
          ),
          dataIndex: "effortOut",
          key: "effortOut",
          width: "6%",
          sorter: (a, b) => SORTER.number_compare(a.effortOut, b.effortOut),
          render: renderTrendMetric({metric: "effortOut", good: TrendIndicator.isPositive, uom: "dev-devs"})
        },
      ],
    },
    {
      title: <span>Latest Activity</span>,
      children: [
        {
          title: "Last Commit",
          dataIndex: "latestCommit",
          key: "latestCommit",
          width: "7%",
          sorter: (a, b) => SORTER.date_compare(b.latestCommit, a.latestCommit),
          render: (latestCommit) => <span className="textXs">{fromNow(latestCommit)}</span>,
        },
        {
          title: "Last Update",
          dataIndex: "latestWorkItemEvent",
          key: "latestWorkItemEvent",
          width: "7%",
          sorter: (a, b) => SORTER.date_compare(b.latestWorkItemEvent, a.latestWorkItemEvent),
          render: (latestWorkItemEvent) => <span className="textXs">{fromNow(latestWorkItemEvent)}</span>,
        },
      ],
    },
    {
      title: "",
      key: "actions",
      width: "5%",
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

function getTransformedData(tableData, intl) {
  return tableData.map((project) => {
    const currentCycleMetrics = project.cycleMetricsTrends[0];
    return currentCycleMetrics != null
      ? {
          ...project,
          leadTime: getNumber(currentCycleMetrics.avgLeadTime, intl),
          cycleTime: getNumber(currentCycleMetrics.avgCycleTime, intl),
          specs: getNumber(currentCycleMetrics.workItemsWithCommits / (project.contributorCount || 1), intl),
          effortOut: getNumber(currentCycleMetrics.totalEffort / (project.contributorCount || 1), intl),
          cycleMetricsTrends: project.cycleMetricsTrends.map((p) => ({
            ...p,
            // calculate volume and effortOut per contributor
            specs: p.workItemsWithCommits / (project.contributorCount || 1),
            effortOut: p.totalEffort / (project.contributorCount || 1),
          })),
        }
      : {
          ...project,
          leadTime: "N/A",
          cycleTime: "N/A",
          specs: "N/A",
          effortOut: "N/A",
        };
  });
}

export const ProjectsTable = injectIntl(({tableData, loading, intl}) => {
  const transformedData = getTransformedData(tableData, intl)
  const columns = useOrgProjectsTableColumns(30);

  return (
    <StripeTable
      columns={columns}
      dataSource={transformedData}
      loading={loading}
      height={TABLE_HEIGHTS.FOURTY_FIVE}
      rowKey={(record) => record.key}
    />
  );
})

export const ProjectsTableWidget = ({organizationKey}) => {
  const {error, loading, data} = useQueryOrganizationProjects({organizationKey});

  if (error) return null;

  const edges = data?.["organization"]?.["projects"]?.["edges"] ?? [];
  const tableData = edges
    .map((edge) => ({...edge.node, subProjectCount: edge.node.workItemsSources.count, subProjectLabels: edge.node.workItemsSources.edges.map(edge => edge.node.name)}))
    .sort((a, b) => SORTER.date_compare(b.latestWorkItemEvent, a.latestWorkItemEvent));

  return <ProjectsTable tableData={tableData} loading={loading} />;
};

import React from "react";
import {ProjectLink} from "../../../shared/navigation/projectLink";
import {fromNow, getNumber, TOOLTIP_COLOR, truncateString} from "../../../../helpers/utility";
import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import Button from "../../../../../components/uielements/button";
import {useQueryOrganizationProjects} from "./useQueryOrganizationProjects";
import {useSearch} from "../../../../components/tables/hooks";
import {SORTER, StripeTable} from "../../../../components/tables/tableUtils";
import {Highlighter} from "../../../../components/misc/highlighter";
import {Tag, Tooltip} from "antd";
import { injectIntl } from "react-intl";
import {AvgCycleTime, AvgLeadTime, EffortOUT, Volume} from "../../../shared/components/flowStatistics/flowStatistics";
import { renderMetric } from "../../../../components/misc/statistic/statistic";
import { AppTerms } from "../../../shared/config";

function customNameRender(text, record, searchText) {
  return (
    text && (
      <ProjectLink projectName={record.name} projectKey={record.key}>
        <span style={{cursor: "pointer"}} className="tw-textSm">
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
          {truncateString(x, 16, TAG_COLOR)}
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
          {truncateString(x, 16, TAG_COLOR)}
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


export function useOrgProjectsTableColumns(samplingFrequency, specsOnly) {
  const nameSearchState = useSearch("name", {customRender: customNameRender});
  const subProjectRenderState = {render: subProjectRender};

  const columns = [
    {
      title: "Value Stream",
      dataIndex: "name",
      key: "name",
      width: "8%",
      className: "value-stream",
      ...nameSearchState,
    },
    {
      title: "Work Streams",
      dataIndex: "subProjectCount",
      key: "subProjectCount",
      width: "8%",
      className: "work-streams",
      sorter: (a, b) => SORTER.number_compare(a.subProjectCount, b.subProjectCount),
      ...subProjectRenderState,
    },
    {
      title: "Repositories",
      dataIndex: "repositoryCount",
      key: "repositoryCount",
      width: "6%",
      className: "repository-count",
      sorter: (a, b) => SORTER.number_compare(a.repositoryCount, b.repositoryCount),
      render: renderMetric,
    },
    {
      title: "Contributors",
      dataIndex: "contributorCount",
      key: "contributorCount",
      width: "5%",
      className: "contributor-count",
      sorter: (a, b) => SORTER.number_compare(a.contributorCount, b.contributorCount),
      render: renderMetric,
    },
    {
      title: (
        <span>
          Flow Time <sup>Last {samplingFrequency} Days</sup>
        </span>
      ),
      children: [
        {
          title: <span>Lead Time <sup>Avg</sup></span>,
          dataIndex: "leadTime",
          key: "leadTime",
          width: "6%",
          className: "lead-time",
          sorter: (a, b) => SORTER.number_compare(a.leadTime, b.leadTime),
          render: (text, record) => {
            return (
              <AvgLeadTime
                displayType="cellrender"
                currentMeasurement={{...record.cycleMetricsTrends?.[0], samplingFrequency}}
                previousMeasurement={record.cycleMetricsTrends?.[1]}
              />
            );
          },
        },
        {
          title: <span>Cycle Time <sup>Avg</sup></span>,
          dataIndex: "cycleTime",
          key: "cycleTime",
          width: "6%",
          className: "cycle-time",
          sorter: (a, b) => SORTER.number_compare(a.cycleTime, b.cycleTime),
          render: (text, record) => {
            return (
              <AvgCycleTime
                displayType="cellrender"
                currentMeasurement={{...record.cycleMetricsTrends?.[0], samplingFrequency}}
                previousMeasurement={record.cycleMetricsTrends?.[1]}
              />
            );
          },
        },
      ],
    },
    {
      title: (
        <span>
          Flow Volume <sup>Last {samplingFrequency} Days</sup>
        </span>
      ),
      children: [
        {
          title: (
            <span>
              {specsOnly ? AppTerms.specs.display : AppTerms.cards.display} <sup>PC</sup>{" "}
            </span>
          ),
          dataIndex: "specs",
          key: "specs",
          width: "5%",
          className: "specs",
          sorter: (a, b) => SORTER.number_compare(a.specs, b.specs),
          render: (text, record) => {
            return (
              <Volume
                displayType="cellrender"
                currentMeasurement={{...record.cycleMetricsTrends?.[0], samplingFrequency}}
                previousMeasurement={record.cycleMetricsTrends?.[1]}
                specsOnly={specsOnly}
                normalized={true}
                contributorCount={record.contributorCount}
              />
            );
          },
        },
        {
          title: (
            <span>
              Effort
              <sub>
                <em>T</em>
              </sub>
              <sup>PC</sup>
            </span>
          ),
          dataIndex: "effortOut",
          key: "effortOut",
          width: "6%",
          className: "effort",
          sorter: (a, b) => SORTER.number_compare(a.effortOut, b.effortOut),
          render: (text, record) => {
            return (
              <EffortOUT
                displayType="cellrender"
                currentMeasurement={{...record.cycleMetricsTrends?.[0], samplingFrequency}}
                previousMeasurement={record.cycleMetricsTrends?.[1]}
                normalized={true}
                contributorCount={record.contributorCount}
              />
            );
          },
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
          width: "6%",
          className: "latest-commit",
          sorter: (a, b) => SORTER.date_compare(b.latestCommit, a.latestCommit),
          render: (latestCommit) => <span className="tw-textSm">{fromNow(latestCommit)}</span>,
        },
        {
          title: "Last Update",
          dataIndex: "latestWorkItemEvent",
          key: "latestWorkItemEvent",
          width: "6%",
          className: "last-update",
          sorter: (a, b) => SORTER.date_compare(b.latestWorkItemEvent, a.latestWorkItemEvent),
          render: (latestWorkItemEvent) => <span className="tw-textSm">{fromNow(latestWorkItemEvent)}</span>,
        },
      ],
    },
    {
      title: "",
      key: "actions",
      width: "5%",
      align: "right",
      className: "select-button",
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
  return tableData.filter(
    (project) => !project.archived
  ).map((project) => {
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

export const ProjectsTable = injectIntl(({tableData, loading, intl, specsOnly}) => {
  const transformedData = getTransformedData(tableData, intl)
  const columns = useOrgProjectsTableColumns(30, specsOnly);

  return (
    <StripeTable
      columns={columns}
      dataSource={transformedData}
      loading={loading}
      rowKey={(record) => record.key}
      testId="project-table"
    />
  );
})

export const ProjectsTableWidget = ({organizationKey, days, measurementWindow, samplingFrequency, specsOnly, includeSubTasks}) => {
  const {error, loading, data} = useQueryOrganizationProjects({
    organizationKey,
    days,
    measurementWindow,
    samplingFrequency,
    specsOnly,
    includeSubTasks,
  });

  if (error) return null;

  const edges = data?.["organization"]?.["projects"]?.["edges"] ?? [];
  const tableData = edges
    .map((edge) => ({...edge.node, subProjectCount: edge.node.workItemsSources.count, subProjectLabels: edge.node.workItemsSources.edges.map(edge => edge.node.name)}))
    .sort((a, b) => SORTER.date_compare(b.latestWorkItemEvent, a.latestWorkItemEvent));

  return <ProjectsTable tableData={tableData} loading={loading} specsOnly={specsOnly} />;
};

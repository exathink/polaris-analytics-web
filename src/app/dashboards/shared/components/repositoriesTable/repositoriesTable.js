import React from "react";
import { useQueryRepositories } from "./useQueryRepositories";
import { useSearch } from "../../../../components/tables/hooks";
import { SORTER, StripeTable, TABLE_HEIGHTS } from "../../../../components/tables/tableUtils";
import { ButtonBar } from "../../../../containers/buttonBar/buttonBar";
import Button from "../../../../../components/uielements/button";
import { fromNow, human_span } from "../../../../helpers/utility";
import { RepositoryLink } from "../../../shared/navigation/repositoryLink";
import { getActivityLevelFromDate } from "../../../shared/helpers/activityLevel";
import { Highlighter } from "../../../../components/misc/highlighter";
import { AvgLeadTime, TotalCommits, Traceability } from "../flowStatistics/flowStatistics";
import { renderMetric, TrendMetric } from "../../../../components/misc/statistic/statistic";

function customNameRender(text, record, searchText) {
  return (
    text && (
      <RepositoryLink repositoryName={record.name} repositoryKey={record.key}>
        <span style={{ cursor: "pointer" }}>
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={searchText || ""}
            textToHighlight={text.toString()}
          />
        </span>
      </RepositoryLink>
    )
  );
}

export function useRepositoriesTableColumns({ statusTypes, days }) {
  const nameSearchState = useSearch("name", { customRender: customNameRender });

  const columns = [
    {
      title: "",
      children: [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          width: "8%",
          ...nameSearchState
        }
      ]
    },
    {
      title: "",
      children: [
        {
          title: "Status",
          dataIndex: "latestCommit",
          key: "activityProfile",
          width: "5%",
          filters: statusTypes.map((b) => ({ text: b, value: b })),
          onFilter: (value, record) => getActivityLevelFromDate(record.latestCommit).display_name.indexOf(value) === 0,
          render: (latestCommit) => getActivityLevelFromDate(latestCommit).display_name
        }
      ]
    },

    {
      title: (
        <span>
          Activity <sup>Last {days} Days</sup>
        </span>
      ),
      children: [
        {
          title: <span>Contributors</span>,
          dataIndex: "contributorCount",
          key: "contributorCount",
          width: "8%",
          render: renderMetric,
          sorter: (a, b) => SORTER.number_compare(a.contributorCount, b.contributorCount)
        },
        {
          title: <span>Commits</span>,
          dataIndex: "traceabilityTrends",
          key: "totalCommits",
          width: "10%",
          sorter: (a, b) => {
            return SORTER.number_compare(b.traceabilityTrends?.[0]?.totalCommits, a.traceabilityTrends?.[0]?.totalCommits);
          },
          render: (text, record) => {
            return (
              <TotalCommits
                current={record.traceabilityTrends?.[0]}
                previous={record.traceabilityTrends?.[1]}
                displayType={"cellrender"}
              />
            );
          }
        },
        {
          title: <span>Traceability</span>,
          dataIndex: "traceabilityTrends",
          key: "traceabilityTrends",
          width: "10%",
          sorter: (a, b) => {
            return SORTER.number_compare(b.traceabilityTrends?.[0]?.traceability, a.traceabilityTrends?.[0]?.traceability);
          },
          render: (text, record) => {
            return (
              <Traceability
                current={record.traceabilityTrends?.[0]}
                previous={record.traceabilityTrends?.[1]}
                displayType={"cellrender"}
              />
            );
          }
        },

        {
          title: "Latest Commit",
          dataIndex: "latestCommit",
          key: "latestCommit",
          width: "8%",
          sorter: (a, b) => SORTER.date_compare(b.latestCommit, a.latestCommit),
          render: (latestCommit) => fromNow(latestCommit)
        }
      ]
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
      )
    }
  ];

  return columns;
}

export function RepositoriesTable({ tableData, days, loading }) {
  const statusTypes = [...new Set(tableData.map((x) => getActivityLevelFromDate(x.latestCommit).display_name))];
  const columns = useRepositoriesTableColumns({ statusTypes, days });

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

export const RepositoriesTableWidget = ({ dimension, instanceKey, days = 30 }) => {
  const { loading, error, data } = useQueryRepositories({ dimension, instanceKey, days });

  if (error) return null;

  const edges = data?.[dimension]?.["repositories"]?.["edges"] ?? [];
  const tableData = edges.map((edge) => edge.node).sort((a, b) => SORTER.date_compare(b.latestCommit, a.latestCommit));

  return <RepositoriesTable tableData={tableData} days={days} loading={loading} />;
};

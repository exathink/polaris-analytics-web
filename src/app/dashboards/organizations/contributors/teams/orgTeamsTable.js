import React from "react";
import {useSearch} from "../../../../components/tables/hooks";
import { SORTER, StripeTable, TABLE_HEIGHTS } from "../../../../components/tables/tableUtils";
import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import Button from "../../../../../components/uielements/button";
import {CreateNewTeamWidget} from "./createNewTeam";
import {TeamLink} from "../../../shared/navigation/teamLink";
import {fromNow, getNumber} from "../../../../helpers/utility";
import {injectIntl} from "react-intl";
import {Highlighter} from "../../../../components/misc/highlighter";
import {renderTrendMetric} from "../../../shared/helpers/renderers";
import {TrendIndicator} from "../../../../components/misc/statistic/statistic";

function customNameRender(text, record, searchText) {
  return (
    text && (
      <TeamLink teamName={record.name} teamKey={record.key}>
        <span style={{cursor: "pointer"}}>
          <Highlighter
            highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
            searchWords={searchText || ""}
            textToHighlight={text.toString()}
          />
        </span>
      </TeamLink>
    )
  );
}

export function useOrgTeamsTableColumns(measurementWindow) {
  const nameSearchState = useSearch("name", {customRender: customNameRender});

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "10%",
      ...nameSearchState
    },
    {
      title: <span>Active Contributors</span>,
      dataIndex: "contributorCount",
      key: "contributorCount",
      width: "8%"
    }
    ,
    {
      title: (
        <span>
          Throughput <sup>Last {measurementWindow} Days</sup>
        </span>
      ),

      children: [
        {
          title: (
            <span>
              Volume<sup>pc</sup><br/><sub>Specs</sub>
            </span>
          ),
          dataIndex: "volume",
          key: "volume",
          width: "6%",
          sorter: (a, b) => SORTER.string_compare(a.volume, b.volume),
          render: renderTrendMetric({metric: "volume", good: TrendIndicator.isPositive, uom: ""})
        },
        {
          title: (
            <span>
              Effort<sub><em>Out</em></sub> <sup>pc</sup><br /><sub>Dev-Days</sub>
            </span>
          ),
          dataIndex: "effortOut",
          key: "effortOut",
          width: "8%",
          sorter: (a, b) => SORTER.string_compare(a.effortOut, b.effortOut),
          render: renderTrendMetric({metric: "effortOut", good: TrendIndicator.isPositive, uom: "dev-days"})
        },
      ],
    },
    {
      title: (
        <span>
          Response Time <sup>Last {measurementWindow} Days</sup>
        </span>
      ),

      children: [
        {
          title: (
            <span>
              Cycle Time <sup>Avg</sup> <br /><sub> Days</sub>
            </span>
          ),
          dataIndex: "cycleTime",
          key: "cycleTime",
          width: "9%",
          sorter: (a, b) => SORTER.string_compare(a.cycleTime, b.cycleTime),
          render: renderTrendMetric({metric: "avgCycleTime", good: TrendIndicator.isNegative})
        },
        {
          title: (
            <span>
              Effort <sup>Avg</sup> <br /><sub> Dev-Days</sub>
            </span>
          ),
          dataIndex: "effort",
          key: "effort",
          width: "8%",
          sorter: (a, b) => SORTER.string_compare(a.effort, b.effort),
          render: renderTrendMetric({metric: "avgEffort", good: TrendIndicator.isNegative, uom: "dev-days"})
        },
        {
          title: (
            <span>
              Coding <sup>Avg</sup> <br /><sub> Days</sub>
            </span>
          ),
          dataIndex: "implementation",
          key: "implementation",
          width: "11%",
          sorter: (a, b) => SORTER.string_compare(a.implementation, b.implementation),
          render: renderTrendMetric({metric: "avgDuration", good: TrendIndicator.isNegative})
        },
        {
          title: (
            <span>
              Delivery <sup>Avg</sup> <br /><sub> Days</sub>
            </span>
          ),
          dataIndex: "delivery",
          key: "delivery",
          width: "8%",
          sorter: (a, b) => SORTER.string_compare(a.delivery, b.delivery),
          render: renderTrendMetric({metric: "avgLatency", good: TrendIndicator.isNegative})
        },
      ],
    },
    {
      title: "Last Commit",

      dataIndex: "latestCommit",
      key: "latestCommit",
      width: "5%",
      render: (name, record) => fromNow(record.latestCommit),
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      width: "5%",
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


function getTransformedData(tableData, intl) {
  return tableData.map(
    team => {
      const currentCycleMetrics = team.cycleMetricsTrends[0];

      return (
        currentCycleMetrics != null ?
        {
          ...team,
          leadTime: getNumber(currentCycleMetrics.avgLeadTime, intl),
          cycleTime:getNumber(currentCycleMetrics.avgCycleTime, intl),
          implementation: getNumber(currentCycleMetrics.avgDuration, intl),
          effort: getNumber(currentCycleMetrics.avgEffort, intl),
          delivery: getNumber(currentCycleMetrics.avgLatency, intl),
          volume: getNumber(currentCycleMetrics.workItemsInScope/(team.contributorCount||1), intl),
          effortOut: getNumber(currentCycleMetrics.totalEffort/(team.contributorCount||1), intl),
          cycleMetricsTrends: team.cycleMetricsTrends.map((t) => ({
            ...t,
            // calculate volume and effortOut per contributor
            volume: getNumber(t.workItemsInScope / (team.contributorCount || 1), intl),
            effortOut: getNumber(t.totalEffort / (team.contributorCount || 1), intl),
          })),
        }
        :
          {
            ...team,
          leadTime: 'N/A',
          cycleTime:'N/A',
          implementation: 'N/A',
          effort: 'N/A',
          delivery: 'N/A',
          volume: 'N/A',
          effortOut: 'N/A'
          }
      )
    }
  )
}


export const OrgTeamsTable = injectIntl(({tableData, days, measurementWindow, organizationKey, intl}) => {
  const transformedData = getTransformedData(tableData, intl)
  const columns = useOrgTeamsTableColumns(measurementWindow);

  const locale = {
    emptyText: () => <CreateNewTeamWidget organizationKey={organizationKey} />,
  };

  return (
    <StripeTable
      columns={columns}
      dataSource={transformedData}
      height={TABLE_HEIGHTS.FORTY_FIVE}
      locale={locale}
      rowKey={(record) => record.key}
    />
  );
})

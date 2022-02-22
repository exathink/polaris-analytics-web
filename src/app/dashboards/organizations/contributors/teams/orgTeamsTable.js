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
import {renderMetric} from "../../../shared/helpers/renderers";
import {AvgCycleTime, AvgDuration, AvgEffort, AvgLatency, EffortOUT, Volume} from "../../../shared/components/flowStatistics/flowStatistics";

function customNameRender(text, record, searchText) {
  return (
    text && (
      <TeamLink teamName={record.name} teamKey={record.key}>
        <span style={{cursor: "pointer"}} className="textSm">
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

export function useOrgTeamsTableColumns(samplingFrequency, specsOnly) {
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
      width: "7%",
      render: renderMetric
    },
    {
      title: (
        <span>
          Response Time <sup>Last {samplingFrequency} Days</sup>
        </span>
      ),

      children: [
        {
          title: (
            <span>
              Cycle Time <sup>Avg</sup>
            </span>
          ),
          dataIndex: "cycleTime",
          key: "cycleTime",
          width: "8%",
          sorter: (a, b) => SORTER.string_compare(a.cycleTime, b.cycleTime),
          render: (text, record) => {
            return <AvgCycleTime
              displayType="cellrender"
              currentMeasurement={{...record.cycleMetricsTrends?.[0], samplingFrequency}}
              previousMeasurement={record.cycleMetricsTrends?.[1]}
            />;
          },
        },
        {
          title: (
            <span>
              Effort <sup>Avg</sup>
            </span>
          ),
          dataIndex: "effort",
          key: "effort",
          width: "8%",
          sorter: (a, b) => SORTER.string_compare(a.effort, b.effort),
          // render: renderTrendMetric({metric: "avgEffort", good: TrendIndicator.isNegative, uom: "dev-days", samplingFrequency})
          render: (text, record) => {
            return (
              <AvgEffort
                displayType="cellrender"
                currentMeasurement={{...record.cycleMetricsTrends?.[0], samplingFrequency}}
                previousMeasurement={record.cycleMetricsTrends?.[1]}
              />
            );
          },
        },
        {
          title: (
            <span>
              Coding <sup>Avg</sup>
            </span>
          ),
          dataIndex: "implementation",
          key: "implementation",
          width: "8%",
          sorter: (a, b) => SORTER.string_compare(a.implementation, b.implementation),
          render: (text, record) => {
            return (
              <AvgDuration
                displayType="cellrender"
                currentMeasurement={{...record.cycleMetricsTrends?.[0], samplingFrequency}}
                previousMeasurement={record.cycleMetricsTrends?.[1]}
              />
            );
          },
        },
        {
          title: (
            <span>
              Delivery <sup>Avg</sup>
            </span>
          ),
          dataIndex: "delivery",
          key: "delivery",
          width: "8%",
          sorter: (a, b) => SORTER.string_compare(a.delivery, b.delivery),
          render: (text, record) => {
            return (
              <AvgLatency
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
          Throughput <sup>Last {samplingFrequency} Days</sup>
        </span>
      ),

      children: [
        {
          title: (
            <span>
              {specsOnly ? "Specs" : "Cards"}<sup>pc</sup>
            </span>
          ),
          dataIndex: "volume",
          key: "volume",
          width: "6%",
          sorter: (a, b) => SORTER.string_compare(a.volume, b.volume),
          render: (text, record) => {
            return (
              <Volume
                displayType="cellrender"
                currentMeasurement={{...record.cycleMetricsTrends?.[0], samplingFrequency}}
                previousMeasurement={record.cycleMetricsTrends?.[1]}
                specsOnly={specsOnly}
              />
            );
          },
        },
        {
          title: (
            <span>
              Effort<sub><em>Out</em></sub> <sup>pc</sup>
            </span>
          ),
          dataIndex: "effortOut",
          key: "effortOut",
          width: "8%",
          sorter: (a, b) => SORTER.string_compare(a.effortOut, b.effortOut),
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
      title: "Last Commit",

      dataIndex: "latestCommit",
      key: "latestCommit",
      width: "7%",
      render: (name, record) => <span className="textXs">{fromNow(record.latestCommit)}</span>,
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
            volume: t.workItemsInScope / (team.contributorCount || 1),
            effortOut: t.totalEffort / (team.contributorCount || 1),
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


export const OrgTeamsTable = injectIntl(({tableData, days, samplingFrequency, organizationKey, intl, specsOnly}) => {
  const transformedData = getTransformedData(tableData, intl)
  const columns = useOrgTeamsTableColumns(samplingFrequency, specsOnly);

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

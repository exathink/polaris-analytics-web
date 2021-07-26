import React from "react";
import {useSearch} from "../../../../components/tables/hooks";
import { SORTER, StripeTable, TABLE_HEIGHTS } from "../../../../components/tables/tableUtils";
import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import Button from "../../../../../components/uielements/button";
import {CreateNewTeamWidget} from "./createNewTeam";
import {TeamLink} from "../../../shared/navigation/teamLink";
import {fromNow, getNumber} from "../../../../helpers/utility";
import {injectIntl} from "react-intl";

export function useOrgTeamsTableColumns() {
  const nameSearchState = useSearch("name");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "15%",
      ...nameSearchState,
      render: (text, record, searchText) => (
        <TeamLink teamName={record.name} teamKey={record.key}>
          {
            record.name
          }
        </TeamLink>
      ),
    },
    {
      title: <span>Contributors<sup> Active</sup></span>,

      dataIndex: "contributorCount",
      key: "contributorCount",
      width: "6%",
    },
    {
      title: (
        <span>
          Throughput <sup>Last 14 Days</sup>
        </span>
      ),

      children: [
        {
          title: (
            <span>
              Volume <sub> Specs</sub>
            </span>
          ),
          dataIndex: "volume",
          key: "volume",
          width: "6%",
          sorter: (a, b) => SORTER.string_compare(a.volume, b.volume),
        },
        {
          title: (
            <span>
              Effort<sup>Out</sup> <sub> Dev-Days</sub>
            </span>
          ),
          dataIndex: "effortOut",
          key: "effortOut",
          width: "8%",
          sorter: (a, b) => SORTER.string_compare(a.effortOut, b.effortOut),
        },
      ],
    },
    {
      title: (
        <span>
          Response Time <sup>Last 14 Days</sup>
        </span>
      ),

      children: [
        {
          title: (
            <span>
              Cycle Time <sup>Avg</sup> <sub> Days</sub>
            </span>
          ),
          dataIndex: "cycleTime",
          key: "cycleTime",
          width: "9%",
          sorter: (a, b) => SORTER.string_compare(a.cycleTime, b.cycleTime),
        },
        {
          title: (
            <span>
              Effort <sup>Avg</sup> <sub> Dev-Days</sub>
            </span>
          ),
          dataIndex: "effort",
          key: "effort",
          width: "8%",
          sorter: (a, b) => SORTER.string_compare(a.effort, b.effort),
        },
        {
          title: (
            <span>
              Implementation <sup>Avg</sup> <sub> Days</sub>
            </span>
          ),
          dataIndex: "implementation",
          key: "implementation",
          width: "11%",
          sorter: (a, b) => SORTER.string_compare(a.implementation, b.implementation),
        },
        {
          title: (
            <span>
              Delivery <sup>Avg</sup> <sub> Days</sub>
            </span>
          ),
          dataIndex: "delivery",
          key: "delivery",
          width: "8%",
          sorter: (a, b) => SORTER.string_compare(a.delivery, b.delivery),
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
        {
          ...team,
          leadTime: getNumber(currentCycleMetrics.avgLeadTime, intl),
          cycleTime:getNumber(currentCycleMetrics.avgCycleTime, intl),
          implementation: getNumber(currentCycleMetrics.avgDuration, intl),
          effort: getNumber(currentCycleMetrics.avgEffort, intl),
          delivery: getNumber(currentCycleMetrics.avgLatency, intl),
          volume: currentCycleMetrics.workItemsInScope,
          effortOut: getNumber(currentCycleMetrics.totalEffort, intl)
        }
      )
    }
  )
}


export const OrgTeamsTable = injectIntl(({tableData, organizationKey, intl}) => {
  const transformedData = getTransformedData(tableData, intl)
  const columns = useOrgTeamsTableColumns();

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

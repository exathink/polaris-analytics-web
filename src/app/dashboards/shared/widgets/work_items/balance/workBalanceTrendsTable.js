import React from "react";
import {injectIntl} from "react-intl";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../../components/tables/tableUtils";
import {formatDateTime} from "../../../../../i18n";

export function useWorkBalanceTrendsTableColumns() {
  const columns = [
    {
      title: "Measurement Date",
      dataIndex: "measurementDate",
      key: "measurementDate",
      width: "5%",
      render: (text) => <span className="tw-textXs">{text}</span>,
    },
    {
      title: "Effort",
      dataIndex: "totalEffort",
      key: "effort",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.totalEffort, b.totalEffort),
      render: (text) => <span className="tw-textXs">{text} dev-days</span>,
    },
  ];

  return columns;
}

function getTransformedData(tableData, intl) {
  return tableData.map((item) => {
    return {
      ...item,
      measurementDate: formatDateTime(intl, item.measurementDate),
    };
  });
}

export const WorkBalanceTrendsTable = injectIntl(({tableData, intl}) => {
  const transformedData = getTransformedData(tableData, intl);
  const columns = useWorkBalanceTrendsTableColumns();

  return (
    <StripeTable
      columns={columns}
      dataSource={transformedData}
      height={TABLE_HEIGHTS.FORTY_FIVE}
      rowKey={(record) => record.key}
    />
  );
});

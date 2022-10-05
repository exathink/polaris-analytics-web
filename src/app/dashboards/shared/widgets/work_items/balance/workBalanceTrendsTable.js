import React from "react";
import {injectIntl} from "react-intl";
import {SORTER, StripeTable} from "../../../../../components/tables/tableUtils";
import {i18nNumber} from "../../../../../helpers/utility";
import {formatDateTime} from "../../../../../i18n";

export function useWorkBalanceTrendsTableColumns(intl) {
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
      render: (text) => <span className="tw-textXs">{i18nNumber(intl, text, 2)} FTE Days</span>,
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
  const columns = useWorkBalanceTrendsTableColumns(intl);

  return (
    <StripeTable
      columns={columns}
      dataSource={transformedData}
      rowKey={(record) => record.key}
    />
  );
});

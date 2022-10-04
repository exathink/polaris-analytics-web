import React from "react";
import {injectIntl} from "react-intl";
import {SORTER, StripeTable} from "../../../../../../components/tables/tableUtils";
import {formatDateTime} from "../../../../../../i18n";

export function useVolumeTrendsTableColumns() {
  const columns = [
    {
      title: "Measurement Date",
      dataIndex: "measurementDate",
      key: "measurementDate",
      width: "5%",
      render: (text) => <span className="tw-textXs">{text}</span>,
    },
    {
      title: "Cards Closed",
      dataIndex: "workItemsInScope",
      key: "cards",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.workItemsInScope, b.workItemsInScope),
      render: (text) => <span className="tw-textXs">{text}</span>,
    },
    {
      title: "Specs Closed",
      dataIndex: "workItemsWithCommits",
      key: "specs",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.workItemsWithCommits, b.workItemsWithCommits),
      render: (text) => <span className="tw-textXs">{text}</span>,
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

export const VolumeTrendsTable = injectIntl(({tableData, intl}) => {
  const transformedData = getTransformedData(tableData, intl);
  const columns = useVolumeTrendsTableColumns();

  return (
    <StripeTable
      columns={columns}
      dataSource={transformedData}
      rowKey={(record) => record.key}
    />
  );
});

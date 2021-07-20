import React from "react";
import {Table} from "antd";
import styles from "./tableUtils.module.css";
import {diff_in_dates} from "../../helpers/utility";

const DEFAULTS = {
  PAGE_SIZE: 7,
};

export const TABLE_HEIGHTS = {
  FORTY_FIVE: "45vh",
  SIXTY: "60vh",
  NINETY: "90vh"
}

export function StripeTable({columns, dataSource, height, testId, loading, onChange, ...tableProps}) {
  return (
    <Table
      rowClassName={(record, index) => (index % 2 === 0 ? styles.tableRowLight : styles.tableRowDark)}
      size="small"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{y: height ?? TABLE_HEIGHTS.SIXTY}}
      showSorterTooltip={false}
      loading={loading}
      data-testid={testId}
      bordered={true}
      onChange={onChange}
      {...tableProps}
    />
  );
}

export function BaseTable({columns, dataSource, height, testId, loading, onChange, ...tableProps}) {
  return (
    <Table
      size="small"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{y: height ?? TABLE_HEIGHTS.SIXTY}}
      showSorterTooltip={false}
      loading={loading}
      data-testid={testId}
      onChange={onChange}
      {...tableProps}
    />
  );
}

export function PaginatedTable({columns, dataSource, height, testId, loading, onChange, options = {}, ...tableProps}) {
  const {showTotal, pageSize} = options;

  return (
    <Table
      size="small"
      pagination={{
        total: dataSource.length,
        defaultPageSize: pageSize ?? DEFAULTS.PAGE_SIZE,
        hideOnSinglePage: true,
        showTotal: showTotal,
      }}
      columns={columns}
      dataSource={dataSource}
      scroll={{y: height ?? TABLE_HEIGHTS.SIXTY}}
      showSorterTooltip={false}
      loading={loading}
      data-testid={testId}
      onChange={onChange}
      {...tableProps}
    />
  );
}

// sorting utilities to be used for table columns
export const SORTER = {
  number_compare: (numa, numb) => {
    return numa - numb;
  },
  string_compare: (stra, strb) => {
    return stra.localeCompare(strb);
  },
  date_compare: (date_a, date_b) => {
    const span = diff_in_dates(date_a, date_b);
    return span["_milliseconds"];
  },
};

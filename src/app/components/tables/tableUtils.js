import React from "react";
import {Table} from "antd";
import styles from "./tableUtils.module.css";

const DEFAULTS = {
  PAGE_SIZE: 7
};

export function StripeTable({columns, dataSource, height, testId, loading, onChange}) {
  return (
    <Table
      rowClassName={(record, index) => (index % 2 === 0 ? styles.tableRowLight : styles.tableRowDark)}
      size="small"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{y: height ?? "60vh"}}
      showSorterTooltip={false}
      loading={loading}
      data-testid={testId}
      bordered={true}
      onChange={onChange}
    />
  );
}

export function BaseTable({columns, dataSource, height, testId, loading, onChange}) {
  return (
    <Table
      size="small"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{y: height ?? "60vh"}}
      showSorterTooltip={false}
      loading={loading}
      data-testid={testId}
      onChange={onChange}
    />
  );
}

export function PaginatedTable({columns, dataSource, height, testId, loading, onChange, options={}}) {
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
      scroll={{y: height ?? "60vh"}}
      showSorterTooltip={false}
      loading={loading}
      data-testid={testId}
      onChange={onChange}
    />
  );
}

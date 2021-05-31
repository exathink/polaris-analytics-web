import React from "react";
import {Table} from "antd";
import styles from "./baseTableView.module.css";

export function BaseTableView({columns, dataSource, height, testId, loading}) {
  return (
    <Table
      rowClassName={(record, index) => (index % 2 === 0 ? styles.tableRowLight : styles.tableRowDark)}
      size="small"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{y: height??"60vh"}}
      showSorterTooltip={false}
      loading={loading}
      data-testid={testId}
      bordered={true}
    />
  );
}

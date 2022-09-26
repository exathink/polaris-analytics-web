import React from "react";
import {Table} from "antd";
import styles from "./tableUtils.module.css";
import {diff_in_dates} from "../../helpers/utility";
import {LabelValue} from "../../helpers/components";

const DEFAULTS = {
  PAGE_SIZE: 7,
};

export const TABLE_HEIGHTS = {
  FIFTEEN: "15vh",
  TWENTY_FIVE: "25vh",
  THIRTY: "30vh",
  FORTY_FIVE: "45vh",
  SIXTY: "60vh",
  SEVENTY: "70vh",
  SEVENTY_FIVE: "75vh",
  EIGHTY: "80vh",
  NINETY: "90vh"
}

export function StripeTable({columns, dataSource, height, testId, loading, onChange, ...tableProps}) {
  return (
    <div className="tw-bg-white tw-p-1">
      <Table
        rowClassName={(record, index) => styles.tableRow}
        size="small"
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        scroll={{y: height ?? TABLE_HEIGHTS.THIRTY}}
        showSorterTooltip={false}
        loading={loading}
        data-testid={testId}
        className={styles.tableStyle}
        onChange={onChange}
        summary={(pageData) => {
          return (
            <Table.Summary fixed="bottom">
              <Table.Summary.Row className="tw-bg-gray-100">
                {tableProps?.renderTableSummary?.(pageData) ?? (
                  <Table.Summary.Cell index={0} align="left">
                    <LabelValue label="Records" value={pageData.length} />
                  </Table.Summary.Cell>
                )}

                {/* This dummy cell is to fill remaining space of summary stats row */}
                <Table.Summary.Cell index={100} colSpan="50" align="left"></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
        {...tableProps}
      />
    </div>
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


function edgeCaseHandle(firstVal, secondVal) {
  if (firstVal == null && secondVal == null) {
    return 0;
  }

  if (firstVal == null && secondVal != null) {
    return -1;
  }

  if (firstVal != null && secondVal == null) {
    return 1;
  }

  return null;
}

// sorting utilities to be used for table columns
export const SORTER = {
  number_compare: (numa, numb) => {
    const compareRes = edgeCaseHandle(numa, numb);
    if (compareRes !== null) {
      return compareRes;
    }

    return numa - numb;
  },
  string_compare: (stra, strb) => {
    const compareRes = edgeCaseHandle(stra, strb);
    if (compareRes !== null) {
      return compareRes;
    }

    return stra.localeCompare(strb);
  },
  date_compare: (date_a, date_b) => {
    const compareRes = edgeCaseHandle(date_a, date_b);
    if (compareRes !== null) {
      return compareRes;
    }

    const span = diff_in_dates(date_a, date_b);
    return span["_milliseconds"];
  },
};

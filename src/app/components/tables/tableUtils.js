import React from "react";
import {Table} from "antd";
import styles from "./tableUtils.module.css";
import {diff_in_dates} from "../../helpers/utility";
import {LabelValue} from "../../helpers/components";

import {useVirtualizer} from "@tanstack/react-virtual";
import classNames from "classnames";

export const DEFAULT_PAGE_SIZE = 200;
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

export function getRecordsCount(pageData, paginationOptions) {
  if (paginationOptions?.count) {
    return <span>{pageData?.length} of {paginationOptions?.count}</span>
  }
  return pageData?.length;
}

export function useLoadNextPageOnScroll({fetchMore, hasNextPage, endCursor, updateQuery}) {
  // way to detect bottom of the table
  React.useEffect(() => {
    if (endCursor) {
      const node = window.document.querySelector(".ant-table .ant-table-body");
      const handleScroll = () => {
        const {scrollTop, scrollHeight, clientHeight} = node;
        if (scrollTop + clientHeight >= scrollHeight && hasNextPage) {
          // Scrolling has reached bottom, load more data...
          fetchMore?.({variables: {after: endCursor}, updateQuery});
        }
      };

      node.addEventListener("scroll", handleScroll);

      return () => node.removeEventListener("scroll", handleScroll);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endCursor]);
}

export function StripeTable({columns, dataSource, height, testId, loading, onChange, paginationOptions={}, ...tableProps}) {

  useLoadNextPageOnScroll(paginationOptions)

  return (
    <div className="tw-h-full tw-w-full tw-p-1">
      <Table
        rowClassName={(record, index) => styles.tableRow}
        size="small"
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        scroll={{y: "100%", scrollToFirstRowOnChange: false}}
        showSorterTooltip={false}
        loading={loading}
        data-testid={testId}
        className={styles.tableStyle}
        onChange={onChange}
        summary={(pageData) => {
          return (
            <Table.Summary fixed="bottom">
              <Table.Summary.Row className="tw-bg-gray-100">
                <Table.Summary.Cell index={0} align="left" colSpan="20">
                  <div className="tw-flex tw-space-x-6">
                    {tableProps?.renderTableSummary?.(pageData) ?? (
                      <LabelValue label="Records" value={getRecordsCount(pageData, paginationOptions)} />
                    )}
                  </div>
                </Table.Summary.Cell>

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

export function VirtualStripeTable({
  columns,
  dataSource,
  height,
  testId,
  loading,
  onChange,
  paginationOptions = {},
  ...tableProps
}) {
  const parentRef = React.useRef();

  const rowVirtualizer = useVirtualizer({
    count: dataSource.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70,
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <Table
      rowClassName={(record, index) => styles.tableRow}
      size="small"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{y: "100%", scrollToFirstRowOnChange: false}}
      showSorterTooltip={false}
      loading={loading}
      data-testid={testId}
      className={classNames(styles.tableStyle)}
      onChange={onChange}
      components={{
        table: "table",
        header: {
          wrapper: "thead",
          row: "tr",
          cell: "th",
        },
        body: (rawData, options) => {
          let tableSize = rowVirtualizer.getTotalSize() || 150;
          return (
            <div
              className="ant-table-body tw-h-full tw-w-full tw-overflow-auto tw-p-1"
              ref={parentRef}
              style={{
                height: `${tableSize}px`,
                width: "100%",
                position: "relative",
              }}
            >
              <table style={{tableLayout: "fixed"}}>
                <tbody
                  style={{position: "relative", height: `${tableSize}px`, width: "100%"}}
                  className="ant-table-tbody"
                >
                  {virtualRows.map((virtualRow) => {
                    const row = rawData[virtualRow.index];
                    const keys = columns.map((x) => x.dataIndex);
                    const columnsRender = columns.map((x) => x.render);
                    const columnsWidth = columns.map((x) => x.width);
                    return (
                      <tr
                        key={row.key}
                        data-row-key={row.key}
                        className={classNames(`ant-table-row-level-0 ant-table-row`, styles.tableRow)}
                        style={{
                          position: "absolute",
                          top: 35,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {keys.map((key, index) => (
                          <td className="ant-table-cell" key={key} style={{width: columnsWidth[index]}}>
                            {columnsRender[index](row[key], row)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        },
      }}
      summary={(pageData) => {
        return (
          <Table.Summary fixed="bottom">
            <Table.Summary.Row className="tw-bg-gray-100">
              <Table.Summary.Cell index={0} align="left" colSpan="20">
                <div className="tw-flex tw-space-x-6">
                  {tableProps?.renderTableSummary?.(pageData) ?? (
                    <LabelValue label="Records" value={getRecordsCount(pageData, paginationOptions)} />
                  )}
                </div>
              </Table.Summary.Cell>

              {/* This dummy cell is to fill remaining space of summary stats row */}
              <Table.Summary.Cell index={100} colSpan="50" align="left"></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
      {...tableProps}
    />
  );
}

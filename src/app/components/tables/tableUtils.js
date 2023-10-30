import React from "react";
import {Empty, Table, Tooltip} from "antd";
import styles from "./tableUtils.module.css";
import {TOOLTIP_COLOR, diff_in_dates, truncateString} from "../../helpers/utility";
import {CustomTag, LabelValue} from "../../helpers/components";

import {useVirtualizer} from "@tanstack/react-virtual";
import classNames from "classnames";

import { AgGridReact, AgGridReactProps } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import "ag-grid-enterprise";
import {LicenseManager} from "ag-grid-enterprise";
import {getFilteredRowCountValue} from "../../dashboards/shared/widgets/work_items/wip/cycleTimeLatency/agGridUtils";
import { useIntl } from "react-intl";
// enter your license key here to suppress license message in the console and watermark
LicenseManager.setLicenseKey("Using_this_AG_Grid_Enterprise_key_( AG-045772 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( Exathink, LLC )_is_granted_a_( Single Application )_Developer_License_for_the_application_( Polaris Flow )_only_for_( 1 )_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_( Polaris Flow )_need_to_be_licensed___( Polaris Flow )_has_been_granted_a_Deployment_License_Add-on_for_( 1 )_Production_Environment___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 26 August 2024 )____[v2]_MTcyNDYyNjgwMDAwMA==0060e77c7f9ed4497edee3f4f9864373");

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
  no_sort: () => 0
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
            >
              <table>
                <tbody
                  style={{position: "relative", height: `${tableSize}px`, width: "100%"}}
                  className="ant-table-tbody"
                >
                  {virtualRows.map((virtualRow) => {
                    const row = virtualRow.index in rawData ? rawData[virtualRow.index] : null;
                    if (row == null) {
                      return null;
                    }
                    const keys = columns.map((x) => x.dataIndex);
                    const columnsRender = columns.map((x) => x.render);
                     // const columnsWidth = columns.map((x) => x.width);
                    // hack to fix column width issue
                    const columnsWidth = ["4%", "16%", "10%", "10%", "10%", "10%", "10%"];
                    return (
                      <tr
                        key={row.key}
                        data-row-key={row.key}
                        className={classNames(`ant-table-row-level-0 ant-table-row`, styles.tableRow)}
                        style={{
                          position: "absolute",
                          top: 0,
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

const getNumber = (num, intl) => {
  return intl.formatNumber(num, {maximumFractionDigits: 2});
};

/**
 * Some Common cellRenderer
 */
export function TextWithUom(props) {
  const intl = useIntl();

  if (props.value==null) {
    return <span></span>
  }
  
  const uom = props.uom ?? "days";

  const value = getNumber(props.value, intl);
  return (
    <span className="tw-textXs">
      {value} {uom}
    </span>
  );
}

export function TextWithStyle({value}) {
  return (
    <span className="tw-textXs">
      {value}
    </span>
  );
}

const TAG_COLOR = "#108ee9";
export function renderTags(tag_list) {
  const classes = "tw-flex tw-flex-col tw-items-start";
  const fullNodeWithTooltip = (
    <div className={classes}>
      {tag_list.map((x) => (
        <CustomTag key={x}>{truncateString(x, 16, TAG_COLOR)}</CustomTag>
      ))}
    </div>
  );
  const fullNode = (
    <div className={classes}>
      {tag_list.map((x) => (
        <CustomTag key={x}>{x}</CustomTag>
      ))}
    </div>
  );

  const partialNode = tag_list
    .slice(0, 2)
    .map((x) => <CustomTag key={x}>{truncateString(x, 16, TAG_COLOR)}</CustomTag>);

  if (tag_list.length > 2) {
    return (
      <div className={classes}>
        {partialNode}

        <div className="tw-cursor-pointer tw-leading-none">
          <Tooltip title={fullNode} color={TOOLTIP_COLOR}>
            <span style={{fontSize: "20px", color: TAG_COLOR}}>...</span>
          </Tooltip>
        </div>
      </div>
    );
  }
  return fullNodeWithTooltip;
}

/**
 * 
 * @param {string} tagSource 
 */
export function parseTags(tagSource = "") {
  const result = {
    component: [],
    custom_type: [],
    custom_tag: [],
    tags: [],
  };

  // split the tagSource by the ;; separator
  const parts = tagSource.split(";;");

  // init a var to hold the current prefix
  let currentPrefix = "tags";

  for (let part of parts) {
    part = part.trim(); // Remove leading and trailing whitespaces
    if (!part) continue; // Skip blank strings

    // check if part starts with a known prefix
    if (part.startsWith("component:")) {
      result.component.push(part.slice("component:".length));
      currentPrefix = "component";
    } else if (part.startsWith("custom_type:")) {
      result.custom_type.push(part.slice("custom_type:".length));
      currentPrefix = "custom_type";
    } else if (part.startsWith("custom_tag:")) {
      result.custom_tag.push(part.slice("custom_tag:".length));
      currentPrefix = "custom_tag";
    } else {
      // If part doesn't start with a known prefix, add it to the currentPrefix array
      result[currentPrefix].push(part);
    }
  }

  return result;
}

export function CustomComponentCol({value}) {
  return renderTags(value);
}


export function CustomTypeCol({value}) {
  let val = value.join(", ");
  return (
    <span>
      {val}
    </span>
  );
}

export function TagsCol({value}) {
  return renderTags(value);
}


export function ArrayCol({value}) {
  const classes = "tw-flex tw-flex-col tw-items-start";

  return (
    value && (
      <div className={classes}>
        {value.map((x) => (
          <span className="tw-textXs">{x}</span>
        ))}
      </div>
    )
  );
}

export const getHandleColumnVisible = (hidden_cols, setHiddenCols) => (params) => {
  if (params.column != null && params.column.getUserProvidedColDef().hide != null) {
    const colId = params.column.getColId();
    if (params.visible) {
      if (!hidden_cols.includes(colId)) {
        setHiddenCols([...hidden_cols, colId]);
      }
    } else {
      const remainingCols = hidden_cols.filter((x) => x !== colId);
      setHiddenCols(remainingCols);
    }
  }

  // if we check off all-checkbox
  if (params.column == null && params.source === "columnMenu" && params.visible === false) {
    setHiddenCols([]);
  }
  // if we check on all-checkbox
  if (params.column == null && params.source === "columnMenu" && params.visible === true) {
    setHiddenCols(
      params.columnApi
        .getColumns()
        .filter((c) => c.getUserProvidedColDef().hide != null)
        .map((c) => c.getColId())
    );
  }
};

  /**
   * columns for which we need to show aggregation component
   * @param {string[]} ColsToAggregate
   */
  export const getOnSortChanged = (ColsToAggregate) => (params) => {
    const sortState = params.columnApi.getColumnState().find((x) => x.sort);
    if (sortState?.sort && ColsToAggregate.includes(sortState.colId)) {
      // clear prev range selection before applying new range selection
      params.api.clearRangeSelection();

      const filteredCount = getFilteredRowCountValue(params.api);
      params.api.addCellRange({
        rowStartIndex: 0,
        rowEndIndex: filteredCount - 1,
        columns: [sortState.colId],
      });
    } else {
      params.api.clearRangeSelection();
    }
  }

export function defaultOnGridReady(params) {
  params.api.sizeColumnsToFit();
}

export function useDefaultColDef() {
  const defaultColDef = React.useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      menuTabs: [],
      useValueFormatterForExport: true,
      cellClass: "tw-flex tw-items-center",
      headerClass: "tw-uppercase tw-text-xs tw-font-medium",
      filterParams: {
        defaultToNothingSelected: true,
        valueFormatter: (params) => {
          if (params.value == null || params.value === "") {
            return "Unassigned"
          }
          return params.value;
        }
      },
    };
  }, []);

  return defaultColDef;
}

/**
 * @type {React.ForwardRefRenderFunction<AgGridReact, AgGridReactProps>}
 */
export const AgGridStripeTable = React.forwardRef(function AgGridReactTable(props, gridRef) {
  // These properties are applied across all the columns of all the tables using this component. we can override this by passing this from props
  const defaultColDef = useDefaultColDef();

  // On div wrapping Grid
  // a) specify theme CSS Class Class
  // b) sets Grid size
  return (
    <div className="ag-theme-alpine tw-h-full">
      <AgGridReact
        ref={gridRef}
        noRowsOverlayComponent={Empty}
        onGridReady={defaultOnGridReady}
        suppressMenuHide={true}
        animateRows={true}
        defaultColDef={defaultColDef}
        {...props}
      />
    </div>
  );
});

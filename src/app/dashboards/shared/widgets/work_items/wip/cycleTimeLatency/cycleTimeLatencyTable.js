import React from "react";
import {useIntl} from "react-intl";
import {AgGridStripeTable, SORTER, TextWithUom, getHandleColumnVisible, getOnSortChanged, parseTags} from "../../../../../../components/tables/tableUtils";
import {WorkItemStateTypeDisplayName} from "../../../../config";
import {categories, doesPairWiseFilterPass, getQuadrant, QuadrantColors, QuadrantNames, Quadrants} from "./cycleTimeLatencyUtils";
import {InfoCircleFilled} from "@ant-design/icons";
import {joinTeams} from "../../../../helpers/teamUtils";
import {
  CardCol,
  StateTypeCol,
} from "../../../../../projects/shared/helper/renderers";
import {isObjectEmpty} from "../../../../../projects/shared/helper/utils";
import {CustomTotalAndFilteredRowCount, MultiCheckboxFilter} from "./agGridUtils";
import {getRemoteBrowseUrl} from "../../../../../work_items/activity/views/workItemRemoteLink";
import { HIDDEN_COLUMNS_KEY, useOptionalColumnsForWorkItems } from "../../../../../../components/tables/tableCols";
import { useLocalStorage } from "../../../../../../helpers/hooksUtil";


function getTransformedData(data, intl, {cycleTimeTarget, latencyTarget}) {
  return data.map((item) => {
    return {
      ...item,
      stateType: WorkItemStateTypeDisplayName[item.stateType],
      stateTypeInternal: item.stateType,
      latestTransitionDate: item.workItemStateDetails.currentStateTransition.eventDate,
      quadrant: getQuadrant(item.cycleTime, item.latency, cycleTimeTarget, latencyTarget),
      teams: joinTeams(item),
      url: getRemoteBrowseUrl(item)
    };
  });
}
function getQuadrantIcon(quadrant) {
  if (quadrant === Quadrants.ok) {
    return (
      <InfoCircleFilled color={QuadrantColors[quadrant]} title={QuadrantNames[quadrant]} style={{fontSize: "10px"}} />
    );
  }
  if (quadrant === Quadrants.latency) {
    return (
      <InfoCircleFilled color={QuadrantColors[quadrant]} title={QuadrantNames[quadrant]} style={{fontSize: "10px"}} />
    );
  }
  if (quadrant === Quadrants.age) {
    return (
      <InfoCircleFilled color={QuadrantColors[quadrant]} title={QuadrantNames[quadrant]} style={{fontSize: "10px"}} />
    );
  }
  if (quadrant === Quadrants.critical) {
    return (
      <InfoCircleFilled color={QuadrantColors[quadrant]} title={QuadrantNames[quadrant]} style={{fontSize: "10px"}} />
    );
  }
}



function quadrantFormatter(params) {
  return QuadrantNames[params.value] ?? params.value;
}

function QuadrantCol(params) {
  return (
    <span
      style={{
        color: QuadrantColors[params.value],
        cursor: "pointer",
        fontSize: "0.75rem",
        lineHeight: "1rem",
        fontWeight: 500,
      }}
    >
      {getQuadrantIcon(params.value)}
      &nbsp;
      {quadrantFormatter(params)}
    </span>
  );
}

const valueAccessor = {
  cycleTime: (data) => data.values,
  quadrant: (data) => data.values,
  name: (data) => [data.filter],
  latency: ({filter, filterTo, type}) => [filter, filterTo, type],
  effort: ({filter, filterTo, type}) => [filter, filterTo, type],
};

function getFilterValue(key, value) {
  return valueAccessor[key](value);
}

const MenuTabs = ["filterMenuTab",  "generalMenuTab"];
export function useCycleTimeLatencyTableColumns({filters, workTrackingIntegrationType}) {
  const optionalColumns = useOptionalColumnsForWorkItems({filters, workTrackingIntegrationType});
  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }

  const columnDefs = React.useMemo(
    () => [
      ...optionalColumns,
      {
        field: "name",
        headerName: "Work Item",
        pinned: 'left',
        cellRenderer: React.memo(CardCol),
        width: 320,
        filter: "agTextColumnFilter",
        filterParams: {
          filterOptions: ["contains", "startsWith"],
          buttons: ["reset"],
          maxNumConditions: 1,
        },
        filterValueGetter: (params) => {
          return `${params.getValue("name")} ${params.getValue("displayId")} ${params.getValue("epicName")}`;
        },
        comparator: (_valA, _valB, nodeA, nodeB) => SORTER.string_compare(nodeA.data.displayId, nodeB.data.displayId),
        menuTabs: [...MenuTabs, 'columnsMenuTab'],
      },
      {
        field: "state",
        headerName: "State",
        cellRenderer: StateTypeCol,
        autoHeight: true,
        comparator: (_valA, _valB, nodeA, nodeB) => {
          return SORTER.string_compare(nodeA.data.state, nodeB.data.state);
        },
        menuTabs: MenuTabs,
      },
      {
        field: "quadrant",
        headerName: "Status",
        cellRenderer: QuadrantCol,
        filter: "agSetColumnFilter",
        filterParams: {
          cellRenderer: QuadrantCol,
        },
        menuTabs: MenuTabs,
        valueFormatter: quadrantFormatter,
      },

      {
        field: "cycleTime",
        headerName: "Age",
        cellRenderer: TextWithUom,
        comparator: SORTER.number_compare,
        filter: MultiCheckboxFilter,
        filterParams: {
          values: categories.map((b) => ({text: b, value: b})),
          onFilter: ({value, record}) => {     
            return doesPairWiseFilterPass({value, record, metric: "cycleTime"});
          },
        },
        menuTabs: MenuTabs,
      },
      {
        field: "latency",
        headerName: "Last Moved",
        cellRenderer: TextWithUom,
        comparator: SORTER.number_compare,
        filter: "agNumberColumnFilter",
        filterParams: {
          maxNumConditions: 1,
          filterOptions: ["inRange", "lessThanOrEqual", "greaterThanOrEqual"],
          buttons: ["reset"],
          inRangeInclusive: true
        },
        menuTabs: MenuTabs,
      },
      {
        field: "effort",
        headerName: "Effort",
        cellRenderer: TextWithUom,
        filter: "agNumberColumnFilter",
        filterParams: {
          maxNumConditions: 1,
          filterOptions: ["inRange", "lessThanOrEqual", "greaterThanOrEqual"],
          buttons: ["reset"],
          inRangeInclusive: true
        },
        cellRendererParams: {
          uom: "FTE Days",
        },
        comparator: SORTER.number_compare,
        menuTabs: MenuTabs,
      },
      {
        field: "latestCommitDisplay",
        headerName: "Latest Commit",
        cellRenderer: TextWithStyle,
        cellRendererParams: {
          uom: "",
        },
        comparator: (_valA, _valB, nodeA, nodeB) => {
          return SORTER.date_compare(
            nodeA.data.workItemStateDetails.latestCommit,
            nodeB.data.workItemStateDetails.latestCommit
          );
        },
        menuTabs: MenuTabs,
      },
    ],
    []
  );

  return columnDefs;
}

function getUniqueItems(data) {
  const [workItemTypes, stateTypes, teams] = [new Set(), new Set(), new Set()];

  data.forEach((item) => {
    workItemTypes.add(item.workItemType);
    stateTypes.add(WorkItemStateTypeDisplayName[item.stateType]);
    item.teamNodeRefs.map((t) => t.teamName).forEach((tn) => teams.add(tn));
  });

  return {
    workItemTypes: [...workItemTypes],
    stateTypes: [...stateTypes],
    teams: [...teams],
  };
}


export const CycleTimeLatencyTable = React.forwardRef(
  ({tableData, callBacks, cycleTimeTarget, latencyTarget, specsOnly}, gridRef) => {
    const intl = useIntl();
    const [hidden_cols, setHiddenCols] = useLocalStorage(HIDDEN_COLUMNS_KEY, []);

    // get unique workItem types
    const {workItemTypes, stateTypes, teams} = getUniqueItems(tableData);
    const workItemStreams = [...new Set(tableData.map((x) => x.workItemsSourceName))];
    const componentTags = [...new Set(tableData.flatMap((x) => parseTags(x.tags).component))];
    const customTypeTags = [...new Set(tableData.flatMap((x) => parseTags(x.tags).custom_type))];
    const tags = [...new Set(tableData.flatMap((x) => parseTags(x.tags).tags))];
    const workTrackingIntegrationType = tableData[0]?.["workTrackingIntegrationType"];

    const categories = getHistogramCategories(COL_WIDTH_BOUNDARIES, "days");
    const allPairsData = allPairs(COL_WIDTH_BOUNDARIES);
    const dataSource = React.useMemo(
      () => getTransformedData(tableData, intl, {cycleTimeTarget, latencyTarget}),
      [tableData, cycleTimeTarget, latencyTarget, intl]
    );
    const quadrants = [...new Set(dataSource.map((x) => x.quadrant))];
    const columnDefs = useCycleTimeLatencyTableColumns({
      filters: {workItemTypes, stateTypes, quadrants, teams, workItemStreams, componentTags, customTypeTags, tags, categories, allPairsData},
      workTrackingIntegrationType
    });

    const statusBar = React.useMemo(() => {
      return {
        statusPanels: [
          {
            statusPanel: CustomTotalAndFilteredRowCount,
            statusPanelParams: {
              label: "Work Items",
            },
            align: "left",
          },
          {
            statusPanel: "agAggregationComponent",
            statusPanelParams: {
              aggFuncs: ["avg", "min", "max"],
            },
          },
        ],
      };
    }, []);

    const handleFilterOpen = React.useCallback(
      params => {
        if (params.source==="COLUMN_MENU") {
          callBacks.setEventSource("table");
        }
      },
      [callBacks]
    );

    const handleFilterChange = React.useCallback(
      (params) => {
        const filterModel = params.api.getFilterModel();

        if (isObjectEmpty(filterModel)) {
          callBacks.setAppliedFilters((prev) => {
            for (const [key, val] of prev) {
              if (val.source === "table") {
                prev.delete(key);
              }
            }

            return new Map(prev);
          });
        } else {
          // remove keys which have null values (eg: {filterKey1: null})
          const cleanFilters = Object.entries(filterModel)
            .filter(([_itemKey, itemVal]) => itemVal != null)
            .reduce((acc, [itemKey, itemVal]) => {
              acc[itemKey] = {value: getFilterValue(itemKey, itemVal), source: "table"};
              return acc;
            }, {});

          const filtersMap = new Map(Object.entries(cleanFilters));
          callBacks.setAppliedFilters((prev) => {
            // delete all table related filters here
            // as they are applied from filterModel
            for (const [key, val] of prev) {
              if (val.source === "table") {
                prev.delete(key);
              }
            }

            return new Map([...prev, ...filtersMap]);
          });
        }
      },
      [callBacks]
    );

    return (
      <AgGridStripeTable
        ref={gridRef}
        columnDefs={columnDefs}
        rowData={dataSource}
        statusBar={statusBar}
        onSortChanged={getOnSortChanged(["cycleTime", "latency", "effort"])}
        enableRangeSelection={true}
        defaultExcelExportParams={{
          fileName: "Work_In_Progress",
          autoConvertFormulas: true,
          processCellCallback: params => {
              const field = params.column.getColDef().field;
              return field === 'url' ? `=HYPERLINK("${params.value}")` : params.formatValue ? params.formatValue(params.value): params.value;
          }
        }}
        excelStyles={[
          {
              id: 'hyperlinks',
              font: {
                  underline: 'Single',
                  color: '#358ccb'
              }
          }
        ]}
        onCellClicked={(e) => {
          if (["quadrant", "name", "state", "latestCommitDisplay"].includes(e.colDef.field)) {
            const record = e.data;
            callBacks.setPlacement("top");
            callBacks.setShowPanel(true);
            callBacks.setWorkItemKey(record.key);
          }
        }}
        onFilterChanged={handleFilterChange}
        onColumnVisible={getHandleColumnVisible(hidden_cols, setHiddenCols)}
      />
    );
  }
);

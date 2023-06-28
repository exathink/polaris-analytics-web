import React from "react";
import {injectIntl} from "react-intl";
import {AgGridStripeTable, SORTER, TextWithUom, getOnSortChanged} from "../../../../../../components/tables/tableUtils";
import {WorkItemStateTypeDisplayName} from "../../../../config";
import {getQuadrant, QuadrantColors, QuadrantNames, Quadrants} from "./cycleTimeLatencyUtils";
import {InfoCircleFilled} from "@ant-design/icons";
import {joinTeams} from "../../../../helpers/teamUtils";
import {
  CardCol,
  StateTypeCol,
} from "../../../../../projects/shared/helper/renderers";
import {allPairs, getHistogramCategories} from "../../../../../projects/shared/helper/utils";
import {COL_WIDTH_BOUNDARIES, FILTERS} from "./cycleTimeLatencyUtils";
import {CustomTotalAndFilteredRowCount, MultiCheckboxFilter} from "./agGridUtils";
import {getRemoteBrowseUrl} from "../../../../../work_items/activity/views/workItemRemoteLink";

const getNumber = (num, intl) => {
  return intl.formatNumber(num, {maximumFractionDigits: 2});
};

function getTransformedData(data, intl, {cycleTimeTarget, latencyTarget}) {
  return data.map((item) => {
    return {
      ...item,
      cycleTime: getNumber(item.cycleTime, intl),
      latency: getNumber(item.latency, intl),
      duration: getNumber(item.duration, intl),
      effort: getNumber(item.effort, intl),
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

const MenuTabs = ["filterMenuTab",  "generalMenuTab"];
export function useCycleTimeLatencyTableColumns({filters, appliedFilters}) {

  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }

  const columns = React.useMemo(
    () => [
      {field: "displayId", headerName: "ID", hide: true},
      {field: "epicName", headerName: "Epic", hide: true},
      {field: 'workItemsSourceName', headerName: "WorkStream", hide: true},
      {field: 'teams', headerName: 'Teams', hide: "true"},
      {field: 'url', headerName: 'URL', hide: "true", cellClass: 'hyperlinks'},
      {
        field: "name",
        headerName: "Work Item",
        pinned: 'left',
        cellRenderer: CardCol,
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
          values: filters.categories.map((b) => ({text: b, value: b})),
          onFilter: ({value, record}) => {     
            return testMetric(value, record, "cycleTime");
          },
        },
        menuTabs: MenuTabs,
      },
      {
        field: "latency",
        headerName: "Latency",
        cellRenderer: TextWithUom,
        comparator: SORTER.number_compare,
        filter: "agNumberColumnFilter",
        filterParams: {
          maxNumConditions: 1,
          filterOptions: ["inRange", "lessThanOrEqual", "greaterThanOrEqual"],
          buttons: ["reset"],
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
        cellRenderer: TextWithUom,
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

  return {columnDefs: columns};
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

export const CycleTimeLatencyTable = injectIntl(
  ({tableData, intl, callBacks, appliedFilters, cycleTimeTarget, latencyTarget, specsOnly}) => {

    // get unique workItem types
    const {workItemTypes, stateTypes, teams} = getUniqueItems(tableData);
    const categories = getHistogramCategories(COL_WIDTH_BOUNDARIES, "days");
    const allPairsData = allPairs(COL_WIDTH_BOUNDARIES);

    const dataSource = React.useMemo(
      () => getTransformedData(tableData, intl, {cycleTimeTarget, latencyTarget}),
      [tableData, cycleTimeTarget, latencyTarget, intl]
    );
    const quadrants = [...new Set(dataSource.map((x) => x.quadrant))];
    const {columnDefs} = useCycleTimeLatencyTableColumns({
      filters: {workItemTypes, stateTypes, quadrants, teams, categories, allPairsData},
      appliedFilters,
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

    return (
      <AgGridStripeTable
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
        onFilterChanged={(params) => {
          const filterModel = params.api.getFilterModel();
          // if(filterModel["cycleTime"]){
          //   appliedFilters.set(FILTERS.CURRENT_INTERACTION, ["cycleTime"]);
          // }
        }}
      />
    );
  }
);

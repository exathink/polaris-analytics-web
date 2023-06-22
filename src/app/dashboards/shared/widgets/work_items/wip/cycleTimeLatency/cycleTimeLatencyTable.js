import React from "react";
import {injectIntl} from "react-intl";
import {AgGridStripeTable, TextWithUom} from "../../../../../../components/tables/tableUtils";
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
import {CustomHeader, MultiCheckboxFilter} from "./agGridUtils";

const QuadrantSort = {
  ok: 0,
  latency: 1,
  age: 2,
  critical: 3,
};

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

function QuadrantCol(params) {
  return (
    <span
      style={{
        color: QuadrantColors[params.data.quadrant],
        marginLeft: "9px",
        cursor: "pointer",
        fontSize: "0.75rem",
        lineHeight: "1rem",
        fontWeight: 500,
      }}
    >
      {getQuadrantIcon(params.data.quadrant)}
      &nbsp;
      {QuadrantNames[params.data.quadrant]}
    </span>
  );
}

export function useCycleTimeLatencyTableColumns({filters, appliedFilters}) {

  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }

  const columns = [
    {field: "displayId", hide: true},
    {field: "epicName", hide: true},
    {
      field: "quadrant",
      headerName: "Status",
      cellRenderer: QuadrantCol,
      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.quadrants
          .sort((a, b) => QuadrantSort[a] - QuadrantSort[b])
          .map((b) => ({
            text: (
              <span style={{color: QuadrantColors[b]}}>
                {getQuadrantIcon(b)}&nbsp;{QuadrantNames[b]}
              </span>
            ),
            value: b,
          })),
        onFilter: ({value, record}) => {
          appliedFilters.set(FILTERS.CURRENT_INTERACTION, ["quadrant"]);
          return value.includes(record.quadrant);
        },
      },
      menuTabs: ["filterMenuTab", "columnsMenuTab", "generalMenuTab"],
    },
    {
      field: "name",
      headerName: "Card",
      cellRenderer: CardCol,
      autoHeight: true,
      width: 320,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "startsWith"],
        buttons: ['reset'],
        maxNumConditions: 1,
      },
      filterValueGetter: (params) => {
        return `${params.getValue("name")} ${params.getValue("displayId")} ${params.getValue("epicName")}`;
      },
      menuTabs: ["filterMenuTab"],
    },
    {field: "state", headerName: "State", cellRenderer: StateTypeCol, autoHeight: true},
    {
      field: "cycleTime",
      headerName: "Age",
      cellRenderer: TextWithUom,
      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.categories.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => {
          appliedFilters.set(FILTERS.CURRENT_INTERACTION, ["cycleTime"]);
          return testMetric(value, record, "cycleTime");
        },
      },
      menuTabs: ["filterMenuTab", "columnsMenuTab", "generalMenuTab"],
    },
    {
      field: "latency",
      headerName: "Latency",
      cellRenderer: TextWithUom,
      filter: "agNumberColumnFilter",
      filterParams: {
        maxNumConditions: 1,
        filterOptions: ["inRange", "lessThanOrEqual", "greaterThanOrEqual"],
        buttons: ['reset'],
        closeOnApply: true,
      },
      menuTabs: ["filterMenuTab"],
    },
    {
      field: "effort",
      headerName: "Effort",
      cellRenderer: TextWithUom,
      cellRendererParams: {
        uom: "FTE Days",
      },
    },
    {
      field: "latestCommitDisplay",
      headerName: "Latest Commit",
      cellRenderer: TextWithUom,
      cellRendererParams: {
        uom: "",
      },
    },
  ];

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


    return (
      <AgGridStripeTable
        columnDefs={columnDefs}
        rowData={dataSource}
        onRowClicked={(e) => {
          const record = e.data;
          callBacks.setPlacement("top");
          callBacks.setShowPanel(true);
          callBacks.setWorkItemKey(record.key);
        }}
      />
    );
  }
);

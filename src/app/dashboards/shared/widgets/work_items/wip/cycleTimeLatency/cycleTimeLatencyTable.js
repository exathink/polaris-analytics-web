import React from "react";
import {injectIntl} from "react-intl";
import {AgGridStripeTable} from "../../../../../../components/tables/tableUtils";
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
import FilterComp from "./agGridFilterUtils";
import { CustomHeader } from "./agGridUtils";

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


export function useCycleTimeLatencyTableColumns({filters, appliedFilters, callBacks}) {

  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }

  const defaultColDef = React.useMemo(() => {
    return {sortable: true, resizable: true, headerComponent: CustomHeader};
  }, []);

  const columns = [
    {
      field: "quadrant",
      headerName: "Status",
      cellRenderer: QuadrantCol,
      filter: FilterComp,
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
    },
    {field: "name",  headerName: "Card", cellRenderer: CardCol, autoHeight: true, width: 320},
    {field: "state",  headerName: "State", cellRenderer: StateTypeCol},
    {
      field: "cycleTime",
      headerName: "Age",
      cellRenderer: (params) => {
        const record = params.data;
        return <span className="tw-textXs">{record.cycleTime} days</span>;
      },
      filter: FilterComp,
      filterParams: {
        values: filters.categories.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => {
          appliedFilters.set(FILTERS.CURRENT_INTERACTION, ["cycleTime"]);
          return testMetric(value, record, "cycleTime");
        },
      },
    },
    {
      field: "latency",
      headerName: "Latency",
      cellRenderer: (params) => {
        const record = params.data;
        return <span className="tw-textXs">{record.latency} days</span>;
      },
    },
    {
      field: "effort",
      headerName: "Effort",
      cellRenderer: (params) => {
        const record = params.data;
        return <span className="tw-textXs">{record.effort} FTE Days</span>;
      },
    },
    {
      field: "latestCommitDisplay",
      headerName: "Latest Commit",
      cellRenderer: (params) => {
        const record = params.data;
        return <span className="tw-textXs">{record.latestCommitDisplay}</span>;
      },
    },
  ];

  return {columnDefs: columns, defaultColDef: defaultColDef};
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

    const dataSource = getTransformedData(tableData, intl, {cycleTimeTarget, latencyTarget});
    const quadrants = [...new Set(dataSource.map((x) => x.quadrant))];
    const {columnDefs, defaultColDef} = useCycleTimeLatencyTableColumns({
      filters: {workItemTypes, stateTypes, quadrants, teams, categories, allPairsData},
      appliedFilters,
      callBacks,
    });


    return (
      <AgGridStripeTable
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowData={dataSource}
        suppressMenuHide={true}
      />
    );
  }
);

import React from "react";
import {useSearchMultiCol} from "../../../../../../components/tables/hooks";
import {injectIntl} from "react-intl";
import {SORTER, StripeTable} from "../../../../../../components/tables/tableUtils";
import {WorkItemStateTypeDisplayName} from "../../../../config";
import {getQuadrantColor} from "./cycleTimeLatencyUtils";
import {InfoCircleFilled} from "@ant-design/icons";
import {joinTeams} from "../../../../helpers/teamUtils";
import {comboColumnStateTypeRender, comboColumnTitleRender, customColumnRender} from "../../../../../projects/shared/helper/renderers";

const QuadrantColors = {
  green: "#2f9a32",
  yellow: "#d4ae10",
  orange: "#d08535",
  red: "#b5111a",
};

const QuadrantNames = {
  green: "Ok",
  yellow: "High Idle Time",
  orange: "High Age",
  red: "High Age and Idle Time",
};

const QuadrantSort = {
  green: 0,
  yellow: 1,
  orange: 2,
  red: 3,
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
      quadrant: getQuadrantColor({cycleTime: item.cycleTime, latency: item.latency, cycleTimeTarget, latencyTarget}),
      teams: joinTeams(item),
    };
  });
}
function getQuadrantIcon(quadrant) {
  if (quadrant === "green") {
    return (
      <InfoCircleFilled color={QuadrantColors[quadrant]} title={QuadrantNames[quadrant]} style={{fontSize: "10px"}} />
    );
  }
  if (quadrant === "yellow") {
    return (
      <InfoCircleFilled color={QuadrantColors[quadrant]} title={QuadrantNames[quadrant]} style={{fontSize: "10px"}} />
    );
  }
  if (quadrant === "orange") {
    return (
      <InfoCircleFilled color={QuadrantColors[quadrant]} title={QuadrantNames[quadrant]} style={{fontSize: "10px"}} />
    );
  }
  if (quadrant === "red") {
    return (
      <InfoCircleFilled color={QuadrantColors[quadrant]} title={QuadrantNames[quadrant]} style={{fontSize: "10px"}} />
    );
  }
}


function renderQuadrantCol({setShowPanel, setWorkItemKey, setPlacement}) {
  return (text, record, searchText) => (
    <span
      onClick={() => {
        setPlacement("top");
        setShowPanel(true);
        setWorkItemKey(record.key);
      }}
      style={{
        color: QuadrantColors[record.quadrant],
        marginLeft: "9px",
        cursor: "pointer",
        fontSize: "0.75rem",
        lineHeight: "1rem",
        fontWeight: 500,
      }}
    >
      {getQuadrantIcon(record.quadrant)}
      &nbsp;
      {QuadrantNames[record.quadrant]}
    </span>
  );
}

function renderTeamsCall({setShowPanel, setWorkItemKey, setPlacement}) {
  return (text, record, searchText) => {
    return (
      text && (
        <span
          onClick={() => {
            setPlacement("top");
            setShowPanel(true);
            setWorkItemKey(record.key);
          }}
          style={{cursor: "pointer"}}
        >
          {record.teamNodeRefs.length > 1 ? "multiple" : text}
        </span>
      )
    );
  };
}

export function useCycleTimeLatencyTableColumns({filters, appliedFilters, callBacks}) {
  const titleSearchState = useSearchMultiCol(["name", "displayId", "epicName"], {customRender: comboColumnTitleRender(callBacks.setShowPanel, callBacks.setWorkItemKey, callBacks.setPlacement)});
  const stateTypeRenderState = {render: comboColumnStateTypeRender(callBacks.setShowPanel, callBacks.setWorkItemKey, callBacks.setPlacement)};
  const metricRenderState = {render: customColumnRender({...callBacks,colRender: text => <>{text} days</>, className: "tw-textXs"})}
  const effortRenderState = {render: customColumnRender({...callBacks,colRender: text => <>{text} FTE Days</>, className: "tw-textXs"})}
  const renderState = {render: customColumnRender({...callBacks, className: "tw-textXs"})}
  const renderQuadrantState = {render: renderQuadrantCol(callBacks)};
  const renderTeamsCol = {render: renderTeamsCall(callBacks)};

  const columns = [
    // {
    //   title: "Name",
    //   dataIndex: "displayId",
    //   key: "displayId",
    //   width: "5%",
    //   filteredValue: appliedFilters.displayId || null,
    //   sorter: (a, b) => SORTER.string_compare(a.displayId, b.displayId),
    //   ...nameSearchState,
    // },
    {
      title: "Team",
      dataIndex: "teams",
      key: "teams",
      filteredValue: appliedFilters.teams || null,
      filters: filters.teams.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.teams.match(new RegExp(value, "i")),
      width: "4%",
      ...renderTeamsCol,
    },
    {
      title: "Quadrant",
      dataIndex: "quadrant",
      key: "quadrant",
      width: "5%",
      filteredValue: appliedFilters.quadrant || null,
      filters: filters.quadrants
        .sort((a, b) => QuadrantSort[a] - QuadrantSort[b])
        .map((b) => ({
          text: (
            <span style={{color: QuadrantColors[b]}}>
              {getQuadrantIcon(b)}&nbsp;{QuadrantNames[b]}
            </span>
          ),
          value: b,
        })),
      onFilter: (value, record) => record.quadrant.indexOf(value) === 0,
      ...renderQuadrantState,
    },
    {
      title: "Card",
      dataIndex: "name",
      key: "name",
      width: "12%",
      filteredValue: appliedFilters.name || null,
      sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
      ...titleSearchState,
    },
    // {
    //   title: "Type",
    //   dataIndex: "workItemType",
    //   key: "workItemType",
    //   sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
    //   filteredValue: appliedFilters.workItemType || null,
    //   filters: filters.workItemTypes.map((b) => ({text: b, value: b})),
    //   onFilter: (value, record) => record.workItemType.indexOf(value) === 0,
    //   width: "5%",
    //   ...renderState,
    // },
    // {
    //   title: "Phase",
    //   dataIndex: "stateType",
    //   key: "stateType",
    //   sorter: (a, b) => SORTER.string_compare(a.stateType, b.stateType),
    //   filteredValue: appliedFilters.stateType || null,
    //   filters: filters.stateTypes.map((b) => ({text: b, value: b})),
    //   onFilter: (value, record) => record.stateType.indexOf(value) === 0,
    //   width: "5%",
    //   ...renderState,
    // },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: "7%",
      sorter: (a, b) => SORTER.date_compare(a.latestTransitionDate, b.latestTransitionDate),
      filteredValue: appliedFilters.state || null,
      filters: filters.states.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.state.indexOf(value) === 0,
      ...stateTypeRenderState,
    },
    // {
    //   title: "Entered",
    //   dataIndex: "timeInStateDisplay",
    //   key: "timeInStateDisplay",
    //   width: "5%",
    //   sorter: (a, b) => SORTER.date_compare(a.latestTransitionDate, b.latestTransitionDate),
    //   ...renderState,
    // },
    {
      title: "Age",
      dataIndex: "cycleTime",
      key: "cycleTime",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.cycleTime, b.cycleTime),
      ...metricRenderState,
    },
    {
      title: "Idle Time",
      dataIndex: "latency",
      key: "latency",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.latency, b.latency),
      ...metricRenderState,
    },
    // {
    //   title: 'Implem...',
    //   dataIndex: "duration",
    //   key: "duration",
    //   width: "4%",
    //   sorter: (a, b) => SORTER.number_compare(a.duration, b.duration),
    //   ...renderState,
    // },
    {
      title: "Effort",
      dataIndex: "effort",
      key: "effort",
      width: "4%",
      sorter: (a, b) => SORTER.number_compare(a.effort, b.effort),
      ...effortRenderState,
    },
    {
      title: "Latest Commit",
      dataIndex: "latestCommitDisplay",
      key: "latestCommitDisplay",
      width: "5%",
      sorter: (a, b) => SORTER.date_compare(a.workItemStateDetails.latestCommit, b.workItemStateDetails.latestCommit),
      ...renderState,
    },
  ];

  return columns;
}

export const CycleTimeLatencyTable = injectIntl(
  ({tableData, intl, callBacks, appliedFilters, cycleTimeTarget, latencyTarget}) => {
    // get unique workItem types
    const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
    const stateTypes = [...new Set(tableData.map((x) => WorkItemStateTypeDisplayName[x.stateType]))];
    const states = [...new Set(tableData.map((x) => x.state))];
    const teams = [...new Set(tableData.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];

    const dataSource = getTransformedData(tableData, intl, {cycleTimeTarget, latencyTarget});
    const quadrants = [...new Set(dataSource.map((x) => x.quadrant))];
    const columns = useCycleTimeLatencyTableColumns({
      filters: {workItemTypes, stateTypes, states, quadrants, teams},
      appliedFilters,
      callBacks,
    });

    const handleChange = (pagination, filters, sorter) => {
      callBacks.setAppliedFilters(filters);
    };

    return (
      <StripeTable
        columns={columns}
        dataSource={dataSource}
        testId="cycle-time-latency-table"
        height="40vh"
        onChange={handleChange}
        rowKey={record => record.key}
      />
    );
  }
);

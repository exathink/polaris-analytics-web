import React from "react";
import {Link} from "react-router-dom";
import WorkItems from "../../../../../work_items/context";
import {Highlighter} from "../../../../../../components/misc/highlighter";
import {useSearch} from "../../../../../../components/tables/hooks";
import {url_for_instance} from "../../../../../../framework/navigation/context/helpers";
import {injectIntl} from "react-intl";
import {SORTER, StripeTable} from "../../../../../../components/tables/tableUtils";
import {WorkItemStateTypeDisplayName} from "../../../../config";
import {getQuadrantColor} from "./cycleTimeLatencyUtils";
import {InfoCircleFilled} from "@ant-design/icons";
import {joinTeams} from "../../../../helpers/teamUtils";

const QuadrantColors = {
  green: "#2f9a32",
  yellow: "#d4ae10",
  orange: "#d08535",
  red: "#b5111a",
};

const QuadrantNames = {
  green: "Ok",
  yellow: "Latency",
  orange: "Cycle time",
  red: "Critical",
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
      stateType: WorkItemStateTypeDisplayName[item.stateType],
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

function customRender(text, record, searchText) {
  return (
    text && (
      <Link
        to={`${url_for_instance(WorkItems, record.displayId, record.key)}`}
        style={{color: QuadrantColors[record.quadrant]}}
      >
        <Highlighter
          highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
          searchWords={searchText || ""}
          textToHighlight={text.toString()}
        />
      </Link>
    )
  );
}

function customTitleRender({setShowPanel, setWorkItemKey, setPlacement}) {
  return (text, record, searchText) =>
    text && (
      <span
        onClick={() => {
          setPlacement("top");
          setShowPanel(true);
          setWorkItemKey(record.key);
        }}
        style={{cursor: "pointer"}}
      >
        <Highlighter
          highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
          searchWords={searchText || ""}
          textToHighlight={text.toString()}
        />
      </span>
    );
}

function customColRender({setShowPanel, setWorkItemKey, setPlacement}) {
  return (text, record, searchText) =>
    text && (
      <span
        onClick={() => {
          setPlacement("top");
          setShowPanel(true);
          setWorkItemKey(record.key);
        }}
        style={{cursor: "pointer"}}
      >
        {text}
      </span>
    );
}

function renderQuadrantCol({setShowPanel, setWorkItemKey, setPlacement}) {
  return (text, record, searchText) => (
    <span
      onClick={() => {
        setPlacement("top");
        setShowPanel(true);
        setWorkItemKey(record.key);
      }}
      style={{color: QuadrantColors[record.quadrant], marginLeft: "9px", cursor: "pointer"}}
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
  const nameSearchState = useSearch("displayId", {customRender});
  const titleSearchState = useSearch("name", {customRender: customTitleRender(callBacks)});
  const renderState = {render: customColRender(callBacks)};
  const renderQuadrantState = {render: renderQuadrantCol(callBacks)};
  const renderTeamsCol = {render: renderTeamsCall(callBacks)};

  const columns = [
    {
      title: "Name",
      dataIndex: "displayId",
      key: "displayId",
      width: "5%",
      filteredValue: appliedFilters.displayId || null,
      sorter: (a, b) => SORTER.string_compare(a.displayId, b.displayId),
      ...nameSearchState,
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
      title: "Title",
      dataIndex: "name",
      key: "name",
      width: "12%",
      filteredValue: appliedFilters.name || null,
      sorter: (a, b) => SORTER.string_compare(a.name, b.name),
      ...titleSearchState,
    },
    {
      title: "Type",
      dataIndex: "workItemType",
      key: "workItemType",
      sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
      filteredValue: appliedFilters.workItemType || null,
      filters: filters.workItemTypes.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.workItemType.indexOf(value) === 0,
      width: "5%",
      ...renderState,
    },
    {
      title: "Team",
      dataIndex: "teams",
      key: "teams",
      filteredValue: appliedFilters.teams || null,
      filters: filters.teams.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.teams.match(new RegExp(value, "i")),
      width: "5%",
      ...renderTeamsCol,
    },
    {
      title: "Phase",
      dataIndex: "stateType",
      key: "stateType",
      sorter: (a, b) => SORTER.string_compare(a.stateType, b.stateType),
      filteredValue: appliedFilters.stateType || null,
      filters: filters.stateTypes.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.stateType.indexOf(value) === 0,
      width: "5%",
      ...renderState,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: "5%",
      sorter: (a, b) => SORTER.string_compare(a.state, b.state),
      filteredValue: appliedFilters.state || null,
      filters: filters.states.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.state.indexOf(value) === 0,
      ...renderState,
    },
    {
      title: "Entered",
      dataIndex: "timeInStateDisplay",
      key: "timeInStateDisplay",
      width: "5%",
      sorter: (a, b) => SORTER.date_compare(a.latestTransitionDate, b.latestTransitionDate),
      ...renderState,
    },
    {
      title: "Cycle Time",
      dataIndex: "cycleTime",
      key: "cycleTime",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.cycleTime, b.cycleTime),
      ...renderState,
    },
    {
      title: "Latency",
      dataIndex: "latency",
      key: "latency",
      width: "4%",
      sorter: (a, b) => SORTER.number_compare(a.latency, b.latency),
      ...renderState,
    },
    {
      title: "Commits",
      dataIndex: "commitCount",
      key: "commitCount",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.commitCount, b.commitCount),
      ...renderState,
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
      />
    );
  }
);

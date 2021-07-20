import React from "react";
import {Link} from "react-router-dom";
import WorkItems from "../../../../work_items/context";
import {Highlighter} from "../../../../../components/misc/highlighter";
import {useSearch} from "../../../../../components/tables/hooks";
import {url_for_instance} from "../../../../../framework/navigation/context/helpers";
import {injectIntl} from "react-intl";
import {WorkItemStateTypeDisplayName} from "../../../config";
import {joinTeams} from "../../../helpers/teamUtils";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../../components/tables/tableUtils";

const getNumber = (num, intl) => {
  return intl.formatNumber(num, {maximumFractionDigits: 2});
};

function getTransformedData(data, intl) {
  return data.map((item) => {
    return {
      ...item,
      cycleTime: getNumber(item.cycleTime, intl),
      latency: getNumber(item.latency, intl),
      stateType: WorkItemStateTypeDisplayName[item.stateType],
      latestTransitionDate: item.workItemStateDetails.currentStateTransition.eventDate,
      teams: joinTeams(item),
    };
  });
}

function customRender(text, record, searchText) {
  return (
    text && (
      <Link to={`${url_for_instance(WorkItems, record.displayId, record.key)}`}>
        <Highlighter
          highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
          searchWords={searchText || ""}
          textToHighlight={text.toString()}
        />
      </Link>
    )
  );
}

function customTitleRender({setShowPanel, setWorkItemKey}) {
  return (text, record, searchText) =>
    text && (
      <span
        onClick={() => {
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

function customColRender({setShowPanel, setWorkItemKey}) {
  return (text, record, searchText) =>
    text && (
      <span
        onClick={() => {
          setShowPanel(true);
          setWorkItemKey(record.key);
        }}
        style={{cursor: "pointer"}}
      >
        {text}
      </span>
    );
}

function numberColRender({intl, setShowPanel, setWorkItemKey}) {
  return (text, record, searchText) =>
    text && (
      <span
        onClick={() => {
          setShowPanel(true);
          setWorkItemKey(record.key);
        }}
        style={{cursor: "pointer"}}
      >
        {intl.formatNumber(text)}
      </span>
    );
}

function renderTeamsCall({setShowPanel, setWorkItemKey}) {
  return (text, record, searchText) => {
    return (
      text && (
        <span
          onClick={() => {
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

export function useValueStreamPhaseDetailTableColumns({filters, callBacks, intl}) {
  const nameSearchState = useSearch("displayId", {customRender});
  const titleSearchState = useSearch("name", {customRender: customTitleRender(callBacks)});
  const renderState = {render: customColRender(callBacks)};
  const renderTeamsCol = {render: renderTeamsCall(callBacks)};
  const renderNumberCol = {render: numberColRender({intl, ...callBacks})}

  const columns = [
    {
      title: "Name",
      dataIndex: "displayId",
      key: "displayId",
      width: "5%",
      sorter: (a, b) => SORTER.string_compare(a.displayId, b.displayId),
      ...nameSearchState,
    },
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      width: "12%",
      sorter: (a, b) => SORTER.string_compare(a.name, b.name),
      ...titleSearchState,
    },
    {
      title: "Type",
      dataIndex: "workItemType",
      key: "workItemType",
      sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
      filters: filters.workItemTypes.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.workItemType.indexOf(value) === 0,
      width: "5%",
      ...renderState,
    },
    {
      title: "Team",
      dataIndex: "teams",
      key: "teams",
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
      title: "Age",
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
      title: "Effort",
      dataIndex: "effort",
      key: "effort",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.commitCount, b.commitCount),
      ...renderNumberCol
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

export const ValueStreamPhaseDetailTable = injectIntl(({view, tableData, intl, setShowPanel, setWorkItemKey}) => {
  // get unique workItem types
  const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
  const stateTypes = [...new Set(tableData.map((x) => WorkItemStateTypeDisplayName[x.stateType]))];
  const states = [...new Set(tableData.map((x) => x.state))];
  const teams = [...new Set(tableData.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];

  const dataSource = getTransformedData(tableData, intl);
  const columns = useValueStreamPhaseDetailTableColumns({
    intl,
    filters: {workItemTypes, stateTypes, states, teams},
    callBacks: {setShowPanel, setWorkItemKey},
  });

  return (
    <StripeTable
      columns={columns}
      dataSource={dataSource}
      testId="value-stream-phase-detail-table"
      height={view === 'primary' ? TABLE_HEIGHTS.FORTY_FIVE : TABLE_HEIGHTS.NINETY}
    />
  );
});

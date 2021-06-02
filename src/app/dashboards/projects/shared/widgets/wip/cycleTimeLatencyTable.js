import React from "react";
import {Link} from "react-router-dom";
import WorkItems from "../../../../work_items/context";
import {Highlighter} from "../../../../../components/misc/highlighter";
import {useSearch} from "../../../../../components/tables/hooks";
import {url_for_instance} from "../../../../../framework/navigation/context/helpers";
import {injectIntl} from "react-intl";
import {BaseTableView} from "../../components/baseTableView";
import {WorkItemStateTypeDisplayName} from "../../../../shared/config";
import {SORTER} from "../../helper/utils";

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

function customTitleRender({setShowPanel, setWorkItemKey, setPlacement}) {
  return (text, record, searchText) => (
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
  return (text, record, searchText) => (
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

export function useCycleTimeLatencyTableColumns({filters, appliedFilters, callBacks}) {
  const nameSearchState = useSearch("displayId", {customRender});
  const titleSearchState = useSearch("name", {customRender: customTitleRender(callBacks)});
  const renderState = {render: customColRender(callBacks)}

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
      filteredValue: appliedFilters.workItemType || null,
      filters: filters.workItemTypes.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.workItemType.indexOf(value) === 0,
      width: "5%",
      ...renderState
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
      ...renderState
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
      ...renderState
    },
    {
      title: "Entered",
      dataIndex: "timeInStateDisplay",
      key: "timeInStateDisplay",
      width: "5%",
      sorter: (a, b) => SORTER.date_compare(a.latestTransitionDate, b.latestTransitionDate),
      ...renderState
    },
    {
      title: "Cycle Time",
      dataIndex: "cycleTime",
      key: "cycleTime",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.cycleTime, b.cycleTime),
      ...renderState
    },
    {
      title: "Latency",
      dataIndex: "latency",
      key: "latency",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.latency, b.latency),
      ...renderState
    },
    {
      title: "Commits",
      dataIndex: "commitCount",
      key: "commitCount",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.commitCount, b.commitCount),
      ...renderState
    },
    {
      title: "Latest Commit",
      dataIndex: "latestCommitDisplay",
      key: "latestCommitDisplay",
      width: "5%",
      sorter: (a, b) => SORTER.date_compare(a.workItemStateDetails.latestCommit, b.workItemStateDetails.latestCommit),
      ...renderState
    },
  ];

  return columns;
}

export const CycleTimeLatencyTable = injectIntl(({tableData, intl, callBacks, appliedFilters}) => {
  // get unique workItem types
  const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
  const stateTypes = [...new Set(tableData.map((x) => WorkItemStateTypeDisplayName[x.stateType]))];
  const states = [...new Set(tableData.map((x) => x.state))];

  const columns = useCycleTimeLatencyTableColumns({filters: {workItemTypes, stateTypes, states}, appliedFilters, callBacks});
  const dataSource = getTransformedData(tableData, intl);

  const handleChange = (pagination, filters, sorter) => {
    callBacks.setAppliedFilters(filters);
  };


  return <BaseTableView columns={columns} dataSource={dataSource} testId="cycle-time-latency-table" height="40vh" onChange={handleChange} />;
});

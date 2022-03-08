import React from "react";
import {useSearchMultiCol} from "../../../../../components/tables/hooks";
import {injectIntl} from "react-intl";
import {WorkItemStateTypeDisplayName, WorkItemStateTypes} from "../../../config";
import {joinTeams} from "../../../helpers/teamUtils";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../../components/tables/tableUtils";
import {getNumber} from "../../../../../helpers/utility";
import {comboColumnStateTypeRender, comboColumnTitleRender, customColumnRender} from "../../../../projects/shared/helper/renderers";
import {allPairs, getHistogramCategories} from "../../../../projects/shared/helper/utils";

function getLeadTimeOrAge(item, intl) {
  return item.stateType === WorkItemStateTypes.closed
    ? getNumber(item.leadTime, intl)
    : getNumber(item.cycleTime, intl);
}

function getCycleTimeOrLatency(item, intl) {
  return item.stateType === WorkItemStateTypes.closed ?
    getNumber(item.cycleTime, intl)
    :
    getNumber(item.latency, intl)
}

function getTransformedData(data, intl) {
  const now = new Date().getTime();

  return data.map((item, index) => {

    return {
      ...item,
      leadTimeOrAge: getLeadTimeOrAge(item, intl),
      cycleTimeOrLatency: getCycleTimeOrLatency(item, intl),
      effort: getNumber(item.effort, intl),
      duration: getNumber(item.duration, intl),
      stateType: WorkItemStateTypeDisplayName[item.stateType],
      stateTypeInternal: item.stateType,
      latestTransitionDate: item.workItemStateDetails.currentStateTransition.eventDate,
      teams: joinTeams(item),
      rowKey: `${now}.${index}`
    };
  });
}

function customTeamsColRender({setShowPanel, setWorkItemKey}) {
  return (text, record, searchText) => {
    return (
      text && (
        <span
          onClick={() => {
            setShowPanel(true);
            setWorkItemKey(record.key);
          }}
          style={{cursor: "pointer", fontWeight: 500}}
        >
          {record.teamNodeRefs.length > 1 ? "multiple" : text}
        </span>
      )
    );
  };
}



export function useValueStreamPhaseDetailTableColumns({stateType, filters, callBacks, intl}) {
  // const nameSearchState = useSearch("displayId", {customRender});
  const titleSearchState = useSearchMultiCol(["name", "displayId", "epicName"], {customRender: comboColumnTitleRender(callBacks.setShowPanel, callBacks.setWorkItemKey)});
  const stateTypeRenderState = {render: comboColumnStateTypeRender(callBacks.setShowPanel, callBacks.setWorkItemKey)}
  const metricRenderState = {render: customColumnRender({...callBacks,colRender: text => <>{text} days</>, className: "tw-textXs"})}
  const effortRenderState = {render: customColumnRender({...callBacks,colRender: text => <>{text} dev-days</>, className: "tw-textXs"})}
  const renderState = {render: customColumnRender({...callBacks, className: "tw-textXs"})};
  const renderTeamsCol = {render: customTeamsColRender(callBacks)};

  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }

  const columns = [
    {
      title: "Team",
      dataIndex: "teams",
      key: "teams",
      filters: filters.teams.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.teams.match(new RegExp(value, "i")),
      width: "4%",
      ...renderTeamsCol,
    },
    // {
    //   title: "Name",
    //   dataIndex: "displayId",
    //   key: "displayId",
    //   width: "5%",
    //   sorter: (a, b) => SORTER.string_compare(a.displayId, b.displayId),
    //   ...nameSearchState,
    // },
    {
      title: "CARD",
      dataIndex: "name",
      key: "name",
      filters: filters.epicNames.map(b => ({text: b, value: b})),
      width: "12%",
      sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
      ...titleSearchState,
    },
    // {
    //   title: "Type",
    //   dataIndex: "workItemType",
    //   key: "workItemType",
    //   sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
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
      // TODO: this little hack to pad the title is to work around
      // a jitter on the table that appears to be because the column titles have
      // different widths between the two renders. It does not fix it perfectly
      // but makes it less noticeable. There is a bigger underlying issue
      // here which is possible because we are returning these columns in a hook,
      // but I dont know for sure and did not have the time to investigate it well
      // enough. Something to look at.
      title: stateType === WorkItemStateTypes.closed ? 'Lead Time' : 'Age      ',
      dataIndex: "leadTimeOrAge",
      key: "leadTime",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "leadTimeOrAge"),
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.leadTimeOrAge, b.leadTimeOrAge),
      ...metricRenderState
    },
    {
      title: stateType === WorkItemStateTypes.closed ? 'Cycle Time' : 'Latency       ',
      dataIndex: "cycleTimeOrLatency",
      key: "cycleTime",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "cycleTimeOrLatency"),
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.cycleTimeOrLatency, b.cycleTimeOrLatency),
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
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.effort, b.effort),
      ...effortRenderState
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

export const ValueStreamPhaseDetailTable = injectIntl(({view, stateType, tableData, intl, setShowPanel, setWorkItemKey, colWidthBoundaries}) => {
  // get unique workItem types
  const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
  const stateTypes = [...new Set(tableData.map((x) => WorkItemStateTypeDisplayName[x.stateType]))];
  const states = [...new Set(tableData.map((x) => x.state))];
  const teams = [...new Set(tableData.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];
  const categories = getHistogramCategories(colWidthBoundaries);
  const allPairsData = allPairs(colWidthBoundaries);
  const epicNames = [...new Set(tableData.map((x) => x.epicNames))];

  const dataSource = getTransformedData(tableData, intl);
  const columns = useValueStreamPhaseDetailTableColumns({
    stateType,
    filters: {workItemTypes, stateTypes, states, teams, epicNames, categories, allPairsData},
    callBacks: {setShowPanel, setWorkItemKey},
    intl,
  });

  return (
    <StripeTable
      columns={columns}
      dataSource={dataSource}
      testId="value-stream-phase-detail-table"
      height={view === 'primary' ? TABLE_HEIGHTS.FORTY_FIVE : TABLE_HEIGHTS.NINETY}
      rowKey={record => record.rowKey}
    />
  );
});

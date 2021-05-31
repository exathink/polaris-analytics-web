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
      latestTransitionDate: item.workItemStateDetails.currentStateTransition.eventDate
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

export function useCycleTimeLatencyTableColumns({filters}) {
  const nameSearchState = useSearch("displayId", {customRender});
  const titleSearchState = useSearch("name");

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
    },
    {
      title: "Phase",
      dataIndex: "stateType",
      key: "stateType",
      sorter: (a, b) => SORTER.string_compare(a.stateType, b.stateType),
      filters: filters.stateTypes.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.stateType.indexOf(value) === 0,
      width: "5%",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: "5%",
      sorter: (a, b) => SORTER.string_compare(a.state, b.state),
      filters: filters.states.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.state.indexOf(value) === 0,
    },
    {
      title: "Entered",
      dataIndex: "timeInStateDisplay",
      key: "timeInStateDisplay",
      width: "5%",
      sorter: (a, b) => SORTER.date_compare(a.latestTransitionDate, b.latestTransitionDate),
    },
    {
      title: "Cycle Time",
      dataIndex: "cycleTime",
      key: "cycleTime",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.cycleTime, b.cycleTime),
    },
    {
      title: "Latency",
      dataIndex: "latency",
      key: "latency",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.latency, b.latency),
    },
    {
      title: "Commits",
      dataIndex: "commitCount",
      key: "commitCount",
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.commitCount, b.commitCount),
    },
    {
      title: "Latest Commit",
      dataIndex: "latestCommitDisplay",
      key: "latestCommitDisplay",
      width: "5%",
      sorter: (a, b) => SORTER.date_compare(a.workItemStateDetails.latestCommit, b.workItemStateDetails.latestCommit),
    },
  ];

  return columns;
}

export const CycleTimeLatencyTable = injectIntl(({tableData, intl}) => {
  // get unique workItem types
  const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
  const stateTypes = [...new Set(tableData.map((x) => WorkItemStateTypeDisplayName[x.stateType]))];
  const states = [...new Set(tableData.map((x) => x.state))];

  const columns = useCycleTimeLatencyTableColumns({filters: {workItemTypes, stateTypes, states}});
  const dataSource = getTransformedData(tableData, intl);

  return <BaseTableView columns={columns} dataSource={dataSource} testId="cycle-time-latency-table" height="40vh" />;
});

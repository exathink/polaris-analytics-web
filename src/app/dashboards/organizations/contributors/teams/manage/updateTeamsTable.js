import {useSearch} from "../../../../../components/tables/hooks";
import {SORTER, StripeTable} from "../../../../../components/tables/tableUtils";
import {PercentageRangeSlider} from "../../../../shared/components/daysRangeSlider/percentageRangeSlider";
import {actionTypes} from "./constants";

const DEFAULT_TEAM = "Unassigned";

function customTeamNameRender(text, record, searchText) {
  return text ?? DEFAULT_TEAM;
}

export function useUpdateTeamsColumns([capacityRecords, dispatch]) {
  const [nameSearchState, teamNameSearchState] = [
    useSearch("name"),
    useSearch("teamName", {customRender: customTeamNameRender}),
  ];

  function setValueForCapacityRecord(key, value) {
    dispatch({
      type: actionTypes.UPDATE_CAPACITY_RECORDS,
      payload: {
        ...capacityRecords,
        [key]: value,
      },
    });
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
      sorter: (a, b) => SORTER.string_compare(a.name, b.name),
      ...nameSearchState,
    },
    {
      title: "Current Team",
      dataIndex: "teamName",
      key: "teamName",
      width: "20%",
      sorter: (a, b) => SORTER.string_compare(a.teamName, b.teamName),
      ...teamNameSearchState,
    },
    {
      title: "Target Team",
      dataIndex: "targetTeam",
      key: "targetTeam",
      width: "20%",
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "Coding Capacity",
      dataIndex: "capacity",
      key: "capacity",
      sorter: (a, b) => SORTER.number_compare(a.capacity, b.capacity),
      width: "35%",
      render: (_text, record) => {
        return (
          <PercentageRangeSlider
            value={capacityRecords[record.key]}
            setValue={(value) => setValueForCapacityRecord(record.key, value)}
            range={[0, 50, 100]}
          />
        );
      },
    },
  ];
  return columns;
}
export function UpdateTeamsTable({tableData, columns, loading, testId, rowSelection}) {
  return (
    <StripeTable
      dataSource={tableData}
      columns={columns}
      loading={loading}
      testId={testId}
      rowSelection={rowSelection}
      rowKey={(record) => record.key}
    />
  );
}

import React from "react";
import {StripeTable} from "../../../../../components/tables/tableUtils";
import { SelectDropdown2 } from "../../../../shared/components/select/selectDropdown";
import {WorkItemStateTypeColorClass, WorkItemStateTypeDisplayName} from "../../../../shared/config";
import { actionTypes } from "./constants";

const typeItems = [
  {value: "unassigned", label: "Unassigned"},
  {value: "active", label: "Active"},
  {value: "waiting", label: "Waiting"}
]


export function useWorkItemStateTypeMapColumns({dispatch, flowTypeRecords, currentWorkItemSource}) {
  function handleDropdownChange(state, flowTypeVal) {
    const keyValuePair = {};
    keyValuePair[state] = flowTypeVal;
    dispatch({type: actionTypes.UPDATE_FLOW_TYPE, payload: {keyValuePair}});
  }

  React.useEffect(() => {
    dispatch({type: actionTypes.RESET_FLOW_TYPE_RECORDS, payload: currentWorkItemSource})
  }, [dispatch, currentWorkItemSource]);

  const columns = [
    {
      title: "Phase",
      dataIndex: "stateType",
      key: "stateType",
      width: "20%",
      render: (text, record) => <span className="tw-font-semibold">{WorkItemStateTypeDisplayName[text]}</span>,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: "40%",
      render: (text, record) => text,
    },
    {
      title: "Flow Type",
      dataIndex: "flowType",
      key: "flowType",
      width: "40%",
      render: (text, record) => {
        return (
            <SelectDropdown2
              value={typeItems.find(y => {
                return y.value === (flowTypeRecords[record.state] ?? "unassigned");
                })}
              uniqueItems={typeItems}
              handleChange={(flowTypeVal) => handleDropdownChange(record.state, flowTypeVal)}
            />
        );
      },
    },
  ];
  return columns;
}

export function WorkItemStateTypeMapTable({tableData, columns, loading, testId}) {
  return (
    <StripeTable
      dataSource={tableData}
      columns={columns}
      loading={loading}
      testId={testId}
      rowKey={(record) => record.key}
      rowClassName={(record) => WorkItemStateTypeColorClass[record.stateType]}
    />
  );
}

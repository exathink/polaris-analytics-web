import React from "react";
import {StripeTable} from "../../../../../components/tables/tableUtils";
import { SelectDropdown2 } from "../../../../shared/components/select/selectDropdown";
import {FlowTypeStates, WorkItemStateTypeColorClass, WorkItemStateTypeDisplayName} from "../../../../shared/config";
import { actionTypes } from "./constants";
import { LabelValue } from "../../../../../helpers/components";

const typeItems = [
  {value: FlowTypeStates.UNASSIGNED, label: "Unassigned"},
  {value: FlowTypeStates.ACTIVE, label: "Active"},
  {value: FlowTypeStates.WAITING, label: "Waiting"}
]


export function useWorkItemStateTypeMapColumns({dispatch, flowTypeRecords}) {
  function handleDropdownChange(state, flowTypeVal) {
    const keyValuePair = {};
    keyValuePair[state] = flowTypeVal;
    dispatch({type: actionTypes.UPDATE_FLOW_TYPE, payload: {keyValuePair}});
  }

  const columns = [
    {
      title: "Phase",
      dataIndex: "stateType",
      key: "stateType",
      width: "20%",
      render: (text, record) => <span className="tw-font-semibold">{WorkItemStateTypeDisplayName[text]}</span>,
    },
    {
      title: "Workflow State",
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
      renderTableSummary={(pageData) => {
       return <LabelValue label="Workflow States" value={pageData?.length} />;
    }}
    />
  );
}

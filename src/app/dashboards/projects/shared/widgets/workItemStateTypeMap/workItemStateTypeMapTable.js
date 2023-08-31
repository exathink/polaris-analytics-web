import React from "react";
import {StripeTable} from "../../../../../components/tables/tableUtils";
import { SelectDropdown2 } from "../../../../shared/components/select/selectDropdown";
import {FlowTypeStates, ReleaseStatus, WorkItemStateTypeColorClass, WorkItemStateTypeDisplayName} from "../../../../shared/config";
import { actionTypes } from "./constants";
import { LabelValue } from "../../../../../helpers/components";
import {useCustomPhaseMapping} from "../../../../../helpers/hooksUtil";

const typeItems = [
  {value: FlowTypeStates.UNASSIGNED, label: "Unassigned"},
  {value: FlowTypeStates.ACTIVE, label: "Active"},
  {value: FlowTypeStates.WAITING, label: "Waiting"}
]

const releaseItems = [
  {value: ReleaseStatus.UNASSIGNED, label: "Unassigned"},
  {value: ReleaseStatus.DEFERRED, label: "Deferred"},
  {value: ReleaseStatus.DEPLOYABLE, label: "Deployable"},
  {value: ReleaseStatus.DEPLOYED, label: "Deployed"},
  {value: ReleaseStatus.RELEASABLE, label: "Releasable"},
  {value: ReleaseStatus.RELEASED, label: "Released"},
  {value: ReleaseStatus.ABANDONED, label: "Abandoned"}
]

export function useWorkItemStateTypeMapColumns({dispatch, flowTypeRecords, releaseStatusRecords}) {
  function handleFlowTypeDropdownChange(state, flowTypeVal) {
    const keyValuePair = {};
    keyValuePair[state] = flowTypeVal;
    dispatch({type: actionTypes.UPDATE_FLOW_TYPE, payload: {keyValuePair}});
  }

  function handleReleaseStatusDropdownChange(state, releaseStatusVal) {
    const keyValuePair = {};
    keyValuePair[state] = releaseStatusVal;
    dispatch({type: actionTypes.UPDATE_RELEASE_STATUS, payload: {keyValuePair}});
  }
  const WorkItemStateTypeDisplayName = useCustomPhaseMapping();
  const columns = [
    {
      title: "Phase",
      dataIndex: "stateType",
      key: "stateType",
      width: "15%",
      render: (text, record) => <span className="tw-font-semibold">{WorkItemStateTypeDisplayName[text]}</span>,
    },
    {
      title: "Workflow State",
      dataIndex: "state",
      key: "state",
      width: "30%",
      render: (text, record) => text,
    },
    {
      title: "Flow Type",
      dataIndex: "flowType",
      key: "flowType",
      width: "30%",
      render: (text, record) => {
        return (
            <SelectDropdown2
              value={typeItems.find(y => {
                return y.value === (flowTypeRecords[record.state] ?? "unassigned");
                })}
              uniqueItems={typeItems}
              handleChange={(flowTypeVal) => handleFlowTypeDropdownChange(record.state, flowTypeVal)}
              testId={`flow-type-select-${record.state}`}
            />
        );
      },
    },
    {
      title: "Release Status",
      dataIndex: "releaseStatus",
      key: "releaseStatus",
      width: "25%",
      render: (text, record) => {
        return (
            <SelectDropdown2
              value={releaseItems.find(y => {
                return y.value === (releaseStatusRecords?.[record.state] ?? "unassigned");
                })}
              uniqueItems={releaseItems}
              handleChange={(releaseStatusVal) => handleReleaseStatusDropdownChange(record.state, releaseStatusVal)}
              testId={`release-status-select-${record.state}`}
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

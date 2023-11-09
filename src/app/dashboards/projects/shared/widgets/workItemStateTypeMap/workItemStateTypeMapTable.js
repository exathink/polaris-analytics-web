import React from "react";
import {StripeTable} from "../../../../../components/tables/tableUtils";
import { SelectDropdown2 } from "../../../../shared/components/select/selectDropdown";
import {
  FlowTypeStates,
  ReleaseStatus,
  ReleaseStatusDisplayName,
  WorkItemStateTypeColorClass
} from "../../../../shared/config";
import { actionTypes } from "./constants";
import { LabelValue } from "../../../../../helpers/components";
import {useCustomPhaseMapping} from "../../../projectDashboard";

const typeItems = [
  {value: FlowTypeStates.UNASSIGNED, label: "Unassigned"},
  {value: FlowTypeStates.ACTIVE, label: "Active"},
  {value: FlowTypeStates.WAITING, label: "Waiting"},
  {value: FlowTypeStates.TERMINAL, label: "Terminal"}
]

const releaseStatusItems = [
  {stateTypes: ['backlog', 'open', 'wip', 'complete', 'closed'], value: ReleaseStatus.UNASSIGNED, label: ReleaseStatusDisplayName[ReleaseStatus.UNASSIGNED]},
  {stateTypes: ['backlog', 'closed'], value: ReleaseStatus.DEFERRED, label: ReleaseStatusDisplayName[ReleaseStatus.DEFERRED]},
  {stateTypes: ['backlog'], value: ReleaseStatus.ROADMAP, label: ReleaseStatusDisplayName[ReleaseStatus.ROADMAP]},
  {stateTypes: ['backlog'], value: ReleaseStatus.COMMITTED, label: ReleaseStatusDisplayName[ReleaseStatus.COMMITTED]},
  {stateTypes: ['open', 'wip'], value: ReleaseStatus.IMPLEMENTATION, label: ReleaseStatusDisplayName[ReleaseStatus.IMPLEMENTATION]},
  {stateTypes: ['wip', 'complete'], value: ReleaseStatus.CODE_REVIEW, label: ReleaseStatusDisplayName[ReleaseStatus.CODE_REVIEW]},
  {stateTypes: ['wip', 'complete'], value: ReleaseStatus.TESTING, label: ReleaseStatusDisplayName[ReleaseStatus.TESTING]},
  {stateTypes: ['wip', 'complete'],value: ReleaseStatus.INTEGRATION, label: ReleaseStatusDisplayName[ReleaseStatus.INTEGRATION]},
  {stateTypes: ['backlog', 'open', 'wip', 'complete'], value: ReleaseStatus.APPROVAL, label: ReleaseStatusDisplayName[ReleaseStatus.APPROVAL]},
  {stateTypes: ['complete', 'closed'], value: ReleaseStatus.DEPLOYABLE, label: ReleaseStatusDisplayName[ReleaseStatus.DEPLOYABLE]},
  {stateTypes: ['complete', 'closed'], value: ReleaseStatus.DEPLOYED, label: ReleaseStatusDisplayName[ReleaseStatus.DEPLOYED]},
  {stateTypes: ['complete', 'closed'], value: ReleaseStatus.RELEASABLE, label: ReleaseStatusDisplayName[ReleaseStatus.RELEASABLE]},
  {stateTypes: ['closed'],value: ReleaseStatus.RELEASED, label: ReleaseStatusDisplayName[ReleaseStatus.RELEASED]},
  {stateTypes: ['closed'], value: ReleaseStatus.VALIDATED, label: ReleaseStatusDisplayName[ReleaseStatus.VALIDATED]},
  {stateTypes: ['closed'], value: ReleaseStatus.ABANDONED, label: ReleaseStatusDisplayName[ReleaseStatus.ABANDONED]},
  {stateTypes: ['closed'], value: ReleaseStatus.TERMINAL, label: ReleaseStatusDisplayName[ReleaseStatus.TERMINAL]}
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
      title: "Workflow State",
      dataIndex: "state",
      key: "state",
      width: "30%",
      render: (text, record) => text,
    },
    {
      title: "Phase",
      dataIndex: "stateType",
      key: "stateType",
      width: "15%",
      render: (text, record) => <span className="tw-font-semibold">{WorkItemStateTypeDisplayName[text]}</span>,
    },
    {
      title: "SDLC Stage",
      dataIndex: "releaseStatus",
      key: "releaseStatus",
      width: "25%",
      render: (text, record) => {
        return (
            <SelectDropdown2
              value={releaseStatusItems.find(y => {
                return y.value === (releaseStatusRecords?.[record.state] ?? "unassigned");
                })}
              uniqueItems={releaseStatusItems.filter(y => y.stateTypes.includes(record.stateType))}
              handleChange={(releaseStatusVal) => handleReleaseStatusDropdownChange(record.state, releaseStatusVal)}
              testId={`release-status-select-${record.state}`}
            />
        );
      },
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
    }
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

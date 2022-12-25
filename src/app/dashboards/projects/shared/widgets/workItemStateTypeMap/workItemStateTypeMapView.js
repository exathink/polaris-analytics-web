import React from "react";
import {WorkItemStateTypeMapChart} from "./workItemStateTypeMapChart";
import {Alert, Select} from "antd";
import Button from "../../../../../../components/uielements/button";
import {useUpdateProjectWorkItemSourceStateMaps} from "../../hooks/useQueryProjectWorkItemsSourceStateMappings";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {workItemReducer} from "./workItemReducer";
import {actionTypes, mode} from "./constants";
import {useResetComponentState} from "../../helper/hooks";
import {useWorkItemStateTypeMapColumns, WorkItemStateTypeMapTable} from "./workItemStateTypeMapTable";
import {sanitizeStateMappings, WorkItemStateTypeDisplayName} from "../../../../shared/config";

/**
 * Initial mapping for the records
 * @param {any} workItemSource 
 * @param {'flowType' | 'releaseStatus'} type 
 * @returns 
 */
export function getInitialMapping(workItemSource, type) {
  const workItemStateMappings = workItemSource?.workItemStateMappings??[];
  const stateMappings = sanitizeStateMappings(workItemStateMappings);
  return stateMappings.reduce((acc, item) => {
      acc[item.state] = item[type];
      return acc;
  }, {});
}
const {Option} = Select;

export function WorkItemStateTypeMapView({workItemSources, instanceKey, view, context, enableEdits, showMeLinkVisible}) {
  // set first workitemsource as default
  // handling empty workItemSources case by defaulting it to blank object
  const [workItemSource = {}] = workItemSources;
  const [state, dispatch] = React.useReducer(workItemReducer, {
    ...workItemSource,
    flowTypeRecords: getInitialMapping(workItemSource, "flowType"),
    releaseStatusRecords: getInitialMapping(workItemSource, "releaseStatus"),
    mode: mode.INIT,
    errorMessage: "",
    workItemSources
  });

  const [mutate, {loading, client}] = useUpdateProjectWorkItemSourceStateMaps({
    onCompleted: ({updateProjectStateMaps: {success, errorMessage}}) => {
      if (success) {
        dispatch({type: actionTypes.MUTATION_SUCCESS});
        client.resetStore();
      } else {
        logGraphQlError("WorkItemStateTypeMapView.useUpdateProjectWorkItemSourceStateMaps", errorMessage);
        dispatch({type: actionTypes.MUTATION_FAILURE, payload: errorMessage});
      }
    },
    onError: (error) => {
      logGraphQlError("WorkItemStateTypeMapView.useUpdateProjectWorkItemSourceStateMaps", error);
      dispatch({type: actionTypes.MUTATION_FAILURE, payload: error.message});
    },
  });

  function handleSaveClick(e) {
    const {workItemStateMappings, flowTypeRecords, releaseStatusRecords, key} = state;
    // show error if we have stateType values as null
    const isAnyStateTypeUnmapped = workItemStateMappings.some((x) => x.stateType === null);
    if (isAnyStateTypeUnmapped) {
      dispatch({type: actionTypes.SHOW_UNMAPPED_ERROR});

      // if we have error here, don't proceed further.
      return;
    }

    const getFlowTypeRecord = (mapping) => {
      if (flowTypeRecords[mapping.state] === "unassigned" || flowTypeRecords[mapping.state] == null) {
        return {flowType: null};
      } else {
        return {flowType: flowTypeRecords[mapping.state]}
      }
    };

    const getReleaseStatusRecord = (mapping) => {
      if (releaseStatusRecords[mapping.state] === "unassigned" || releaseStatusRecords[mapping.state] == null) {
        return {releaseStatus: null};
      } else {
        return {releaseStatus: releaseStatusRecords[mapping.state]}
      }
    };

    // call the mutation function to update data from here
    const payload = [
      {
        workItemsSourceKey: key,
        stateMaps: workItemStateMappings.map((mapping) => ({
          state: mapping.state,
          stateType: mapping.stateType,
          ...getFlowTypeRecord(mapping),
          ...getReleaseStatusRecord(mapping)
        })),
      },
    ];

    // call mutation here
    mutate({variables: {projectKey: instanceKey, workItemsSourceStateMaps: payload}});
  }

  // utilizing this trick to reset component (changing the key will remount the chart component with same props)
  const [resetComponentStateKey, resetState] = useResetComponentState();

  // Reset state on cancel
  function handleCancelClick(e) {
    dispatch({type: actionTypes.CANCEL_EDIT_MODE});
    resetState();
  }

  // currently not maintaining state when dropdown value for workItemSource change
  function handleChange(index) {
    const workItemSource = workItemSources[index];
    dispatch({type: actionTypes.RESET_FLOW_TYPE_RECORDS, payload: workItemSource})
    dispatch({type: actionTypes.REPLACE_WORKITEM_SOURCE, payload: {...workItemSource, mode: mode.INIT}});
  }

  function selectDropdown() {
    return workItemSources.length > 1 ? (
      <div>
        <Select
          defaultValue={0}
          style={{width: 200}}
          onChange={handleChange}
          getPopupContainer={(node) => node.parentNode}
        >
          {workItemSources.map((source, index) => (
            <Option key={source.key} value={index}>
              {source.name}
            </Option>
          ))}
        </Select>
      </div>
    ) : null;
  }

  function getEmptyAlert() {
    if (state.mode === mode.INIT && workItemSources.length === 0) {
      return (
        <Alert
          message="There are no work streams in this value stream"
          type="warning"
          showIcon
          closable
          className="tw-left-[30%] tw-mt-[10%]"
        />
      );
    }
  }

  function getButtonElements() {
    // when mutation is executing
    if (loading) {
      return (
        <Button className="tw-ml-auto tw-mr-[90px]" type="primary" loading>
          Processing...
        </Button>
      );
    }

    if (state.mode === mode.EDITING) {
      return (
        <>
          <Button onClick={handleSaveClick} className="tw-ml-auto" type="primary" size="small" shape="round">
            Save
          </Button>
          <Button onClick={handleCancelClick} className="tw-mr-24 tw-ml-2" type="default" size="small" shape="round">
            Cancel
          </Button>
        </>
      );
    }

    if (state.mode === mode.UNMAPPED_ERROR) {
      return (
        <Alert
          message="Before saving your changes, please map all the states from unmapped stateType."
          type="error"
          showIcon
          closable
          className="tw-ml-auto tw-mr-[90px]"
        />
      );
    }

    if (state.mode === mode.FAILURE) {
      return <Alert message={state.errorMessage} type="error" showIcon closable  className="tw-ml-auto tw-mr-[90px]" onClose={() => resetState()}/>;
    }

    if (state.mode === mode.SUCCESS) {
      return <Alert message="Mapping updated successfully." type="success" showIcon closable  className="tw-ml-auto tw-mr-[90px]" />;
    }
  }



  const currentWorkItemSource = workItemSources.length > 0 ? workItemSources.find((x) => x.key === state.key) : null;
  const columns = useWorkItemStateTypeMapColumns({
    dispatch,
    flowTypeRecords: state.flowTypeRecords,
    releaseStatusRecords: state.releaseStatusRecords,
  });

  const stateMappings = sanitizeStateMappings(state?.workItemStateMappings??[]);

  return (
    <div data-testid="state-type-map-view" className="tw-relative tw-h-full tw-w-full" id="state-type-mapping-wrapper">
      <div className="tw-absolute tw-top-2 tw-left-4 tw-z-10 tw-mt-[1px] tw-mb-[10px] tw-flex tw-w-full tw-items-center">
        {getEmptyAlert()}
        {selectDropdown()}
        {getButtonElements()}
      </div>

      <div className="tw-h-full tw-w-full">
        <div className="tw-h-1/2">
          <WorkItemStateTypeMapChart
            key={resetComponentStateKey}
            workItemSource={currentWorkItemSource}
            updateDraftState={dispatch}
            view={view}
            context={context}
            enableEdits={enableEdits}
            title={" "}
          />
        </div>
        <div className="tw-mt-2 tw-h-1/2">
          <WorkItemStateTypeMapTable
            testId="workitem-state-type-table"
            key={currentWorkItemSource?.key}
            tableData={stateMappings.sort(
              (a, b) =>
                Object.keys(WorkItemStateTypeDisplayName).indexOf(a.stateType) -
                Object.keys(WorkItemStateTypeDisplayName).indexOf(b.stateType)
            )}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
}

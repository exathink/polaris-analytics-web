import React from "react";
import {WorkItemStateTypeMapChart} from "./workItemStateTypeMapChart";
import {Alert, Button, Select} from "antd";
import "./workItemStateType.css";
import {useUpdateProjectWorkItemSourceStateMaps} from "../../hooks/useQueryProjectWorkItemsSourceStateMappings";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {workItemReducer} from "./workItemReducer";
import {actionTypes, mode} from "./constants";

const {Option} = Select;

export function WorkItemStateTypeMapView({workItemSources, instanceKey, view, context, enableEdits}) {
  // set first workitemsource as default
  // handling empty workItemSources case by defaulting it to blank object
  const [workItemSource = {}] = workItemSources;
  const [state, dispatch] = React.useReducer(workItemReducer, {...workItemSource, mode: mode.INIT, errorMessage: ""});

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
    const {workItemStateMappings, key} = state;
    // show error if we have stateType values as null
    const isAnyStateTypeUnmapped = workItemStateMappings.some((x) => x.stateType === null);
    if (isAnyStateTypeUnmapped) {
      dispatch({type: actionTypes.SHOW_UNMAPPED_ERROR});

      // if we have error here, don't proceed further.
      return;
    }

    // call the mutation function to update data from here
    const payload = [
      {
        workItemsSourceKey: key,
        stateMaps: workItemStateMappings.map((mapping) => ({state: mapping.state, stateType: mapping.stateType})),
      },
    ];

    // call mutation here
    mutate({variables: {projectKey: instanceKey, workItemsSourceStateMaps: payload}});
  }

  // utilizing this trick to reset component (changing the key will remount the chart component with same props)
  const [resetComponentStateKey, setKey] = React.useState(1);

  function resetState() {
    const newKey = resetComponentStateKey === 1 ? 2 : 1;
    setKey(newKey);
  }
  // Reset state on cancel
  function handleCancelClick(e) {
    dispatch({type: actionTypes.CANCEL_EDIT_MODE});
    resetState();
  }

  // currently not maintaining state when dropdown value for workItemSource change
  function handleChange(index) {
    const workItemSource = workItemSources[index];
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
          className="noWorkItemResources"
        />
      );
    }
  }

  function getButtonElements() {
    // when mutation is executing
    if (loading) {
      return (
        <Button className={"shiftRight"} type="primary" loading>
          Processing...
        </Button>
      );
    }

    if (state.mode === mode.EDITING) {
      return (
        <>
          <Button onClick={handleSaveClick} className={"workItemSave"} type="primary" size="small" shape="round">
            Save
          </Button>
          <Button onClick={handleCancelClick} className={"workItemCancel"} type="default" size="small" shape="round">
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
          className="shiftRight"
        />
      );
    }

    if (state.mode === mode.FAILURE) {
      return <Alert message={state.errorMessage} type="error" showIcon closable className="shiftRight" onClose={() => resetState()}/>;
    }

    if (state.mode === mode.SUCCESS) {
      return <Alert message="Mapping updated successfully." type="success" showIcon closable className="shiftRight" />;
    }
  }

  const currentWorkItemSource = workItemSources.length > 0 ? workItemSources.find((x) => x.key === state.key) : null;
  return (
    <div data-testid="state-type-map-view" className="stateTypeWrapper">
      <div className={"controlsWrapper"}>
        {getEmptyAlert()}
        {selectDropdown()}
        {getButtonElements()}
      </div>

      <div className={"chartWrapper"}>
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
    </div>
  );
}

import React from "react";
import {WorkItemStateTypeMapChart} from "./workItemStateTypeMapChart";
import {Alert, Button, Select} from "antd";
import "./workItemStateType.css";
import {updateProjectWorkItemSourceStateMaps} from "../../hooks/useQueryProjectWorkItemsSourceStateMappings";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {workItemReducer} from "./workItemReducer";
import {mode, actionTypes} from "./constants";

const {Option} = Select;

export function WorkItemStateTypeMapView({workItemSources, instanceKey, view, context, viewerContext, organizationKey}) {
  const [mutate, {loading, error, client}] = updateProjectWorkItemSourceStateMaps({
    onCompleted: ({updateProjectStateMaps: {success, errorMessage}}) => {
      if (success) {
        dispatch({type: actionTypes.MUTATION_SUCCESS});
        client.resetStore();
      }
    },
  });


  const [state, dispatch] = React.useReducer(workItemReducer, {
    workItemSources: workItemSources,
    selectedIndex: workItemSources.length > 0 ? 0 : null,
    mode: mode.INIT,
  });

  function handleSaveClick(e) {
    const {workItemStateMappings, key} = state.currentWorkItemSource || state.workItemSources[state.selectedIndex];
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
  // Reset state on cancel
  function handleCancelClick(e) {
    dispatch({type: actionTypes.CANCEL_EDIT_MODE});
    const newKey = resetComponentStateKey === 1 ? 2 : 1;
    setKey(newKey);
  }

  // currently not maintaining state when dropdown value for workItemSource change
  function handleChange(selectedIndex) {
    dispatch({type: actionTypes.REPLACE_WORKITEM_SOURCE, payload: {selectedIndex: selectedIndex, mode: mode.INIT}});
  }

  function selectDropdown() {
    return workItemSources.length > 1 ? (
      <div>
        <Select defaultValue={0} style={{width: 200}} onChange={handleChange}>
          {workItemSources.map((source, index) => (
            <Option key={index} value={index}>
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

    if (state.mode === mode.SUCCESS) {
      return <Alert message="Mapping updated successfully." type="success" showIcon closable className="shiftRight" />;
    }
  }

  if (error) {
    logGraphQlError("updateProjectWorkItemSourceStateMaps", error);
    return null;
  }

  const currentWorkItemSource = workItemSources.length > 0 ? workItemSources[state.selectedIndex] : null;
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
          viewerContext={viewerContext}
          organizationKey={organizationKey}
          title={" "}
        />
      </div>
    </div>
  );
}

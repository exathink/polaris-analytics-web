import React from "react";
import {WorkItemStateTypeMapChart} from "./workItemStateTypeMapChart";
import {Alert, Button, Select} from "antd";
import "./workItemStateType.css";
import {updateProjectWorkItemSourceStateMaps} from "../../hooks/useQueryProjectWorkItemsSourceStateMappings";
import {logGraphQlError} from "../../../../../components/graphql/utils";

const {Option} = Select;

export const actionTypes = {
  REPLACE_WORKITEM_SOURCE: "REPLACE_WORKITEM_SOURCE",
  UPDATE_WORKITEM_SOURCE: "UPDATE_WORKITEM_SOURCE",
  CANCEL_EDIT_MODE: "CANCEL_EDIT_MODE",
  MUTATION_SUCCESS: "MUTATION_SUCCESS",
  SHOW_UNMAPPED_ERROR: "SHOW_UNMAPPED_ERROR"
};

// mini state machine to handle states for button and alert controls
const mode = {
  INIT: "INIT",
  EDITING: "EDITING",
  SUCCESS: "SUCCESS",
  UNMAPPED_ERROR: "UNMAPPED_ERROR"
};

function workItemReducer(state, action) {
  switch (action.type) {
    case actionTypes.REPLACE_WORKITEM_SOURCE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case actionTypes.CANCEL_EDIT_MODE: {
      return {
        ...state,
        mode: mode.INIT,
      };
    }
    case actionTypes.MUTATION_SUCCESS: {
      return {
        ...state,
        mode: mode.SUCCESS
      }
    }
    case actionTypes.SHOW_UNMAPPED_ERROR: {
      return {
        ...state,
        mode: mode.UNMAPPED_ERROR
      }
    }
    case actionTypes.UPDATE_WORKITEM_SOURCE: {
      const [[key, value]] = Object.entries(action.payload.keyValuePair);
      return {
        ...state,
        workItemStateMappings: state.workItemStateMappings.map((item) => {
          if (item.state === key) {
            return {...item, stateType: value};
          }
          return item;
        }),
        mode: mode.EDITING,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const WorkItemStateTypeMapView = ({workItemSources, instanceKey, view, context}) => {
  const [mutate, {loading, error}] = updateProjectWorkItemSourceStateMaps({
    onCompleted: ({updateProjectStateMaps: {success, errorMessage}}) => {
      console.log(`Completed: success: ${success}`);
      dispatch({type: actionTypes.MUTATION_SUCCESS});
      // use this to call a 'refresh callback from the parent so that the parent widget re-renders from the server
      // and reloads the updated state map from the server.
    },
  });

  // set first workitemsource as default
  const [workItemSource] = workItemSources;
  const [state, dispatch] = React.useReducer(workItemReducer, {...workItemSource, mode: mode.INIT});

  function handleSaveClick(e) {
    // show error if we have stateType values as null
    const isAnyStateTypeUnmapped = state.workItemStateMappings.some(x => x.stateType === null)
    if(isAnyStateTypeUnmapped){
      dispatch({type: actionTypes.SHOW_UNMAPPED_ERROR})
      
      // if we have error here, don't proceed further. 
      return;
    }

    // call the mutation function to update data from here
    const payload = [
      {
        workItemsSourceKey: state.key,
        stateMaps: state.workItemStateMappings.map((mapping) => ({state: mapping.state, stateType: mapping.stateType})),
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
  function handleChange(key) {
    const workItemSource = workItemSources.find((x) => x.key === key);
    dispatch({type: actionTypes.REPLACE_WORKITEM_SOURCE, payload: {...workItemSource, mode: mode.INIT}});
  }

  function selectDropdown() {
    return (
      <div>
        <div className="workItemSourceLabel">Select WorkItems Source</div>
        <Select defaultValue={state.name} style={{width: 200}} onChange={handleChange}>
          {workItemSources.map((source) => (
            <Option key={source.key} value={source.key}>
              {source.name}
            </Option>
          ))}
        </Select>
      </div>
    );
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
          <Button onClick={handleSaveClick} className={"workItemSave"} type="primary">
            Save
          </Button>
          <Button onClick={handleCancelClick} className={"workItemCancel"} type="danger">
            Cancel
          </Button>
        </>
      );
    }

    if(state.mode === mode.UNMAPPED_ERROR){
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
      return (
        <Alert
          message="StateType Mappings Done Successfully."
          type="success"
          showIcon
          closable
          className="shiftRight"
        />
      );
    }
  }

  if (error) {
    logGraphQlError(".", error);
    return null;
  }

  return (
    <div className="stateTypeWrapper">
      <div className={"controlsWrapper"}>
        {selectDropdown()}
        {getButtonElements()}
      </div>

      <div className={"chartWrapper"}>
        <WorkItemStateTypeMapChart
          key={resetComponentStateKey}
          workItemSources={workItemSources}
          workItemSourceKey={state.key}
          updateDraftState={dispatch}
          view={view}
          context={context}
          title={" "}
        />
      </div>
    </div>
  );
};

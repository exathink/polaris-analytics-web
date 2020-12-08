import React from "react";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {WorkItemStateTypeMapChart} from "./workItemStateTypeMapChart";
import {Button, Select} from "antd";
import "./workItemStateType.css";
import {updateProjectWorkItemSourceStateMaps} from "../../hooks/useQueryProjectWorkItemsSourceStateMappings";

const {Option} = Select;

export const actionTypes = {
  REPLACE_WORKITEM_SOURCE: "REPLACE_WORKITEM_SOURCE",
  UPDATE_WORKITEM_SOURCE: "UPDATE_WORKITEM_SOURCE",
};

function workItemReducer(state, action) {
  switch (action.type) {
    case actionTypes.REPLACE_WORKITEM_SOURCE: {
      return {
        ...action.payload,
      };
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
      // use this to call a 'refresh callback from the parent so that the parent widget re-renders from the server
      // and reloads the updated state map from the server.
    },
  });

  // set first workitemsource as default
  const [workItemSource] = workItemSources;
  const [state, dispatch] = React.useReducer(workItemReducer, workItemSource);

  function handleSaveClick(e) {
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

  // utilizing this trick to reset component (changing the key will remount the component with same props)
  const [key, setKey] = React.useState(1);
  // Reset state on cancel
  function handleCancelClick(e) {
    const newKey = key === 1 ? 2 : 1;
    setKey(newKey);
  }

  // currently not maintaining state when dropdown value for workItemSource change
  function handleChange(key) {
    const workItemSource = workItemSources.find((x) => x.key === key);
    dispatch({type: actionTypes.REPLACE_WORKITEM_SOURCE, payload: workItemSource});
  }

  function selectDropdown() {
    return (
      <div>
        <div className="workItemSourceLabel">Select WorkItems Source</div>
        <Select defaultValue={state.name} style={{width: 220}} onChange={handleChange}>
          {workItemSources.map((source) => (
            <Option key={source.key} value={source.key}>
              {source.name}
            </Option>
          ))}
        </Select>
      </div>
    );
  }

  if (loading) {
    // use this to render a loading widget in the view
  }

  if (error) {
    // use this to render an error widget in the view.
  }
  return (
    <VizRow h={"100%"}>
      <VizItem w={1}>
        <div style={{width: "100%", height: "100%"}}>
          <div className="workItemFlex spacex12 my12">
            {selectDropdown()}
            <Button onClick={handleSaveClick} className={"workItemSave"} type="primary">
              Save
            </Button>
            <Button onClick={handleCancelClick} className={"workItemCancel"}>
              Cancel
            </Button>
          </div>

          <WorkItemStateTypeMapChart
            key={key}
            workItemSources={workItemSources}
            workItemSourceKey={state.key}
            updateDraftState={dispatch}
            view={view}
            context={context}
            title={" "}
          />
        </div>
      </VizItem>
    </VizRow>
  );
};

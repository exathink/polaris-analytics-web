import React from "react";
import {VizItem, VizRow} from "../../containers/layout";
import {WorkItemStateTypeMapChart} from "./workItemStateTypeMapChart";
import {Button, Select} from "antd";
import "./workItemStateType.css";
import {updateProjectWorkItemSourceStateMaps} from "../../../projects/shared/hooks/useQueryProjectWorkItemsSourceStateMappings";
const {Option} = Select;

export const actionTypes = {
  REPLACE_WORKITEM_SOURCE: "REPLACE_WORKITEM_SOURCE",
  UPDATE_WORKITEM_SOURCE: "UPDATE_WORKITEM_SOURCE"
}

function workItemReducer(state, action) {
  switch (action.type) {
    case actionTypes.REPLACE_WORKITEM_SOURCE: {
      return {
        ...action.payload,
      };
    }
    case actionTypes.UPDATE_WORKITEM_SOURCE: {
      // mutating in-place, as we don't want to rerender
      const [[key, value]] = Object.entries(action.payload.keyValuePair);
      state.workItemStateMappings.forEach((item) => {
        if (item.state === key) {
          item.stateType = value;
        }
      });

      return state;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const WorkItemStateTypeMapView = ({workItemSources, instanceKey, view, context}) => {
  const [mutate] = updateProjectWorkItemSourceStateMaps();
  
  function getFreshWorkItemSources() {
    // as we are not modifying original workItemSources, get fresh copy every time
    return JSON.parse(JSON.stringify(workItemSources));
  }

  // set first workitemsource as default
  const [workItemSource] = getFreshWorkItemSources();
  const [state, dispatch] = React.useReducer(workItemReducer, workItemSource);

  function handleSaveClick(e) {
    // call the mutation function to update data from here
    const payload = [
      {
        workItemsSourceKey: state.key,
        stateMaps: state.workItemStateMappings,
      },
    ];

    // call mutation here
    mutate({variables: {projectKey: instanceKey, workItemsSourceStateMaps: payload}});
  }

  // Reset state on cancel
  function handleCancelClick(e) {
    const workItemSource = getFreshWorkItemSources().find((x) => x.key === state.key);
    dispatch({type: actionTypes.REPLACE_WORKITEM_SOURCE, payload: workItemSource});
  }

  // currently not maintaining state when dropdown value for workItemSource change
  function handleChange(key) {
    const workItemSource = getFreshWorkItemSources().find((x) => x.key === key);
    dispatch({type: actionTypes.REPLACE_WORKITEM_SOURCE, payload: workItemSource});
  }

  function selectDropdown() {
    return (
      <div>
        <div className="workItemSourceLabel">Select WorkItems Source</div>
        <Select defaultValue={state.name} style={{width: 220}} onChange={handleChange}>
          {workItemSources.map((source) => (
            <Option value={source.key}>{source.name}</Option>
          ))}
        </Select>
      </div>
    );
  }

  return (
    <VizRow h={"100%"}>
      <VizItem w={1}>
        <div style={{width: "100%", height: "100%"}}>
          <div className="workItemFlex spacex12 my12">
            {selectDropdown()}
            <Button onClick={handleSaveClick} className={"workItemSave"}>
              Save
            </Button>
            <Button onClick={handleCancelClick} className={"workItemCancel"}>
              Cancel
            </Button>
          </div>
          <WorkItemStateTypeMapChart
            workItemStateMappings={state.workItemStateMappings}
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

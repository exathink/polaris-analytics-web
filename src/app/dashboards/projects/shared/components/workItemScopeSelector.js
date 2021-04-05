import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import React from "react";

export const WorkItemScopeSelector = (
  {
    workItemScope,
    setWorkItemScope,
    display
  }) => (
  <GroupingSelector
    label={'Show'}
    groupings={
      [

        {
          key: 'specs',
          display: display ? display[0] : 'Specs'
        },
        {
          key: 'all',
          display: display ? display[1] : 'All'
        },
      ]
    }
    initialValue={workItemScope}
    onGroupingChanged={(selected) => setWorkItemScope(selected)}
  />
);
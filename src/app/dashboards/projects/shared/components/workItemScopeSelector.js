import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import React from "react";

export const WorkItemScopeSelector = (
  {
    workItemScope,
    setWorkItemScope
  }) => (
  <GroupingSelector
    label={'Show'}
    groupings={
      [

        {
          key: 'specs',
          display: 'Specs'
        },
        {
          key: 'all',
          display: 'All'
        },
      ]
    }
    initialValue={workItemScope}
    onGroupingChanged={(selected) => setWorkItemScope(selected)}
  />
);
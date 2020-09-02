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
          key: 'all',
          display: 'All'
        },
        {
          key: 'specs',
          display: 'Specs'
        },
      ]
    }
    initialValue={workItemScope}
    onGroupingChanged={(selected) => setWorkItemScope(selected)}
  />
);
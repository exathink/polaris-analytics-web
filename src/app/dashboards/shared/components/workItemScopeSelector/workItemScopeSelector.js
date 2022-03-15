import {GroupingSelector} from "../groupingSelector/groupingSelector";
import React from "react";

export const WorkItemScopeSelector = (
  {
    label,
    workItemScope,
    setWorkItemScope,
    display,
    className,
    layout="row"
  }) => (
  <GroupingSelector
    label={label || 'Show'}
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
    className={className}
    layout={layout}
  />
);
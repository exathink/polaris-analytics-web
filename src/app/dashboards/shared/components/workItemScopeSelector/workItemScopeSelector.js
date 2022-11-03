import {GroupingSelector} from "../groupingSelector/groupingSelector";
import React from "react";
import { AppTerms } from "../../config";

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
          display: display ? display[0] : AppTerms.specs.display
        },
        {
          key: 'all',
          display: display ? display[1] : AppTerms.cards.display
        },
      ]
    }
    initialValue={workItemScope}
    value={workItemScope}
    onGroupingChanged={(selected) => setWorkItemScope(selected)}
    className={className}
    layout={layout}
  />
);
import React, {useState} from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {PipelineStateDistributionChart} from "./pipelineStateDistributionChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemStateTypeDisplayName, WorkItemStateTypeSortOrder} from "../../../shared/config";
import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";

const PipelineStateDetailsView = (
  {
    workItems,
    projectCycleMetrics,
    view
  }) => {

    const workItemsByStateType = workItems.reduce(
      (workItemsByStateType, workItem) => {
        if (workItemsByStateType[workItem.stateType] != null) {
          workItemsByStateType[workItem.stateType].push(workItem)
        } else {
          workItemsByStateType[workItem.stateType] = [workItem]
        }
        return workItemsByStateType
      },
      {}
    );
    const groupings = Object.keys(workItemsByStateType).sort(
      (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
    )

    const [selectedStateType, setSelectedStateType] = useState(groupings[0]);

    if (selectedStateType != null) {
      return (
        <VizRow h={1}>
          <VizItem w={1}>
          <GroupingSelector
            label={"Phase"}
            groupings={
              groupings.map(
                grouping => ({
                  key: grouping,
                  display: WorkItemStateTypeDisplayName[grouping]
                })
              )
            }
            initialValue={selectedStateType}
            onGroupingChanged={setSelectedStateType}
          />
          < PipelineStateDistributionChart
            workItems={workItemsByStateType[selectedStateType]}
            projectCycleMetrics={projectCycleMetrics}
          />
          </VizItem>
        </VizRow>
      )
    }
  }
;


export const ProjectPipelineStateDetailsView = withNavigationContext(PipelineStateDetailsView);


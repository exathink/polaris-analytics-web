import React, {useState} from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {WorkItemsDurationsByPhaseChart} from "../../../shared/charts/workItemsDurationsByPhaseChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemStateTypeColor, WorkItemStateTypeDisplayName, WorkItemStateTypeSortOrder} from "../../../shared/config";
import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import {Flex} from 'reflexbox';
import {capitalizeFirstLetter} from "../../../../helpers/utility";
import WorkItems from "../../../work_items/context"
const PipelineStateDetailsView = (
  {
    workItems,
    projectCycleMetrics,
    view,
    context
  }) => {
    if (workItems.length > 0) {
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
      const stateTypes = Object.keys(workItemsByStateType).sort(
        (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
      )

      const [selectedStateType, setSelectedStateType] = useState(
        /* priority order to select the default open tab when we first render this component */
        ['wip','deliver','complete','open','closed','backlog'].find(
          stateType => workItemsByStateType[stateType].length > 0
        ) || stateTypes[0]
      );
      const [selectedGrouping, setSelectedGrouping] = useState('state');

      if (selectedStateType != null) {
        return (
          <VizRow h={1}>
            <VizItem w={1}>
              <Flex w={0.95} justify='space-between'>
                <GroupingSelector
                  label={"Phase"}
                  groupings={
                    stateTypes.map(
                      stateType => ({
                        key: stateType,
                        display: WorkItemStateTypeDisplayName[stateType],
                        style: {
                          backgroundColor: WorkItemStateTypeColor[stateType],
                          color: stateType === selectedStateType ? "#ffffff" : "#d4d4d4"
                        }
                      })
                    )
                  }
                  initialValue={selectedStateType}
                  onGroupingChanged={setSelectedStateType}
                />
                <GroupingSelector
                  label={"Group Work Items By"}
                  groupings={
                    ['state', 'type'].map(
                      grouping => ({
                        key: grouping,
                        display: capitalizeFirstLetter(grouping)
                      })
                    )
                  }
                  initialValue={selectedGrouping}
                  onGroupingChanged={setSelectedGrouping}
                />
              </Flex>
              < WorkItemsDurationsByPhaseChart
                stateType={selectedStateType}
                groupBy={selectedGrouping}
                workItems={workItemsByStateType[selectedStateType]}
                projectCycleMetrics={projectCycleMetrics}
                onSelectionChange={
                  (workItems) => {
                    console.log('Selection changed: workItems.length')
                    if (workItems.length === 1) {
                      context.navigate(WorkItems, workItems[0].displayId, workItems[0].key)
                    }
                  }
                }
              />
            </VizItem>
          </VizRow>
        )
      }
    } else {
      return null;
    }
  }
;


export const ProjectPipelineStateDetailsView = withNavigationContext(PipelineStateDetailsView);


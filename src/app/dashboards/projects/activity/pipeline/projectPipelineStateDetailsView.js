import React, {useState} from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {WorkItemsDurationsByPhaseChart} from "../../../shared/charts/workItemsDurationsByPhaseChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemStateTypeColor, WorkItemStateTypeDisplayName, WorkItemStateTypeSortOrder} from "../../../shared/config";
import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import {Flex} from 'reflexbox';
import {Checkbox} from 'antd';

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
      /* Index the candidates by state type. These will be used to populate each tab */
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
        ['wip', 'complete', 'open', 'closed', 'backlog'].find(
          stateType => workItemsByStateType[stateType] && workItemsByStateType[stateType].length > 0
        ) || stateTypes[0]
      );
      const [showEpics, setShowEpics] = useState(false);
      const [selectedGrouping, setSelectedGrouping] = useState('state');

      if (selectedStateType != null) {
        /* if showEpics is false (the default) we filter out epics before rendering
        *  otherwise we show all the work items*/
        const candidateWorkItems = showEpics ? workItemsByStateType[selectedStateType] :
          workItemsByStateType[selectedStateType].filter(
            workItem => workItem.workItemType !== 'epic'
          )
        const epicsFiltered = candidateWorkItems.length !== workItemsByStateType[selectedStateType].length;

        return (
          <VizRow h={1}>
            <VizItem w={1}>
              <Flex w={0.95} justify='space-between'>
                <GroupingSelector
                  label={"Queue"}
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
                <Checkbox
                  /* if there are no epics filtered out we should not enable the checkbox*/
                  disabled={!showEpics && !epicsFiltered}
                  checked={showEpics}
                  onChange={
                    e => setShowEpics(e.target.checked)
                  }
                >
                  Show Epics
                </Checkbox>
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
                workItems={candidateWorkItems}
                title={`Work Queue:  ${WorkItemStateTypeDisplayName[selectedStateType]}`}
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


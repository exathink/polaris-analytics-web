import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {buildIndex, pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {getWorkItemDurations} from "./shared";

import {
  Colors,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemStateTypeSortOrder,
  WorkItemTypeDisplayName,
} from "../../config";


function getSeriesByStateType(workItems, intl) {
  // We group the work items into series by state type.
  const workItemsByStateType = buildIndex(workItems, workItem => workItem.stateType);

  return Object.keys(workItemsByStateType).sort(
    (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
  ).map(
    stateType => (
      {
        type: 'packedbubble',
        key: `${stateType}`,
        id: `${stateType}`,
        name: `${WorkItemStateTypeDisplayName[stateType]}`,
        color: `${WorkItemStateTypeColor[stateType]}`,
        allowPointSelect: true,
        data: workItemsByStateType[stateType].map(
          workItem => (
            {
              value: workItem.effort,
              name: `elide(${WorkItemTypeDisplayName[workItem.workItemType]}: ${workItem.displayId}<br/>${workItem.name}, 7)`,
              color: WorkItemStateTypeColor[stateType],
              workItem: workItem
            }
          )
        ),
        layoutAlgorithm: {
          parentNodeOptions: {
            marker: {
              fillColor: '#b8c3c3',
              fillOpacity: 0.3
            }
          }
        }
      }
    )
  );
}


function getTitle(workItems, stageName, specsOnly) {
  const count = workItems.length;
  const countDisplay = `${count} ${count === 1 ? specsOnly ? 'Spec' : 'Work Item' : specsOnly ? 'Specs' : 'Work Items'}`;
  return stageName ? `${countDisplay} in ${stageName}` : countDisplay;
}


export const WorkItemsEffortChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'workItems', 'stateTypes', 'specsOnly')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point.workItem),

  getConfig: ({workItems, stateTypes, specsOnly, intl, view}) => {

    const workItemsWithAggregateDurations = getWorkItemDurations(workItems).filter(
      workItem => stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true
    );

    const workItemEffortSeries = getSeriesByStateType(workItemsWithAggregateDurations, intl);

    return {
      chart: {

        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy',

      },
      title: {
        text: 'Effort by Phase',
        align: 'left',
      },
      subtitle: {
        text: `In Developer Days: ${intl.formatDate(Date.now(), {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        })} `,
        align: 'left',
      },


      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          const {displayId, workItemType, name, state, stateType, timeInStateDisplay, latestCommitDisplay, cycleTime, duration, latency, effort, workItemStateDetails} = this.point.workItem;

          return tooltipHtml({
            header: `${WorkItemTypeDisplayName[workItemType]}: ${displayId}<br/>${name}`,
            body: [
              effort != null ? [`Effort`, `${intl.formatNumber(effort)} dev-days`] : ['', ''],
              [`-----------------`, ``],
              duration != null ? [`Duration`, `${intl.formatNumber(duration)} days`] : ['', ''],
              latestCommitDisplay != null ? [`Latest Commit`, `${latestCommitDisplay}`] : ['', ''],
              [`-----------------`, ``],
              [`Current State:`, `${state}`],
              [`Entered:`, `${timeInStateDisplay}`],


            ]
          })
        }
      },
      series: [
        ...workItemEffortSeries
      ],
      plotOptions: {
        packedbubble: {
          layoutAlgorithm: {
            enableSimulation: false,
            parentNodeLimit: true,

            splitSeries: true,
            seriesInteraction: false
          },
          dataLabels: {
            enabled: true,
            align: 'center',
            inside: true,
            color: '#100808',
            format: "{point.value:.1f}",
            parentNodeFormat: '{point.series.name}',
            verticalAlign: 'middle',
            overflow: false,
            crop: true
          }
        }
      },
      legend: {
        title: {
          text: 'Phase',
          style: {
            fontStyle: 'italic'
          }
        },
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle',
        itemMarginBottom: 3,


      },
    }
  }
});
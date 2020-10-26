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


function getSpecSeries(workItems, intl) {
  // We group the work items for specs. These will always have non-zero effort.
  const workItemsByStateType = buildIndex(workItems.filter(workItem => workItem.commitCount > 0), workItem => workItem.stateType);

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

function getNonSpecSeries(workItems, intl) {
  // All nospecs will be put into a single series.

  const nonSpecs = workItems.filter(workItem => workItem.commitCount === null);
  return [
    {
      type: 'packedbubble',
      key: `non-specs`,
      id: `non-specs`,
      name: `No Commits`,
      showInLegend: false,
      allowPointSelect: true,
      data: nonSpecs.map(
        workItem => (
          {
            value: 0.1,
            name: `elide(${WorkItemTypeDisplayName[workItem.workItemType]}: ${workItem.displayId}<br/>${workItem.name}, 7)`,
            color: WorkItemStateTypeColor[workItem.stateType],
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
      },
      dataLabels: {
        enabled: true,
        format: "",
        parentNodeFormat: '{point.series.name}',
      }
    }
  ]
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

    const totalEffort = workItemsWithAggregateDurations.reduce(
      (totalEffort, workItem) => totalEffort + workItem.effort,
      0
    )

    const series = [
      ...getSpecSeries(workItemsWithAggregateDurations, intl),
      ...(!specsOnly ? getNonSpecSeries(workItemsWithAggregateDurations, intl) : [])
    ];

    return {
      chart: {

        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy',

      },
      title: {
        text: `Total Wip Effort: ${intl.formatNumber(totalEffort)} Dev-Days`,
        align: 'left',
      },
      subtitle: {
        text: `${intl.formatDate(Date.now(), {
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
          const {displayId, workItemType, name, state, stateType,  timeInStateDisplay, latestCommitDisplay, cycleTime, duration, effort, commitCount} = this.point.workItem;

          return tooltipHtml({
            header: `${WorkItemTypeDisplayName[workItemType]}: ${displayId}<br/>${name}`,
            body: commitCount != null ? [
              [`Effort`, `${intl.formatNumber(effort)} dev-days`],
              [`-----------------`, ``],
              [`Duration`, `${intl.formatNumber(duration)} days`],
              [`Latest Commit`, `${latestCommitDisplay}`],
              [`-----------------`, ``],
              [`Current State:`, `${state}`],
              [`Entered:`, `${timeInStateDisplay}`],
              [`Cycle Time:`, `${intl.formatNumber(cycleTime)} days`],
            ] : [
              [`Phase:`, `${WorkItemStateTypeDisplayName[stateType]}`],
              [`-----------------`, ``],
              [`Current State:`, `${state}`],
              [`Entered:`, `${timeInStateDisplay}`],
              [`Cycle Time:`, `${intl.formatNumber(cycleTime)} days`],
              [`-----------------`, ``],
              [`Latest Commit`, `None`],
            ]

          })
        }
      },
      series: series,
      plotOptions: {
        packedbubble: {
          layoutAlgorithm: {
            enableSimulation: false,
            parentNodeLimit: true,
            bubblePadding: 15,
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
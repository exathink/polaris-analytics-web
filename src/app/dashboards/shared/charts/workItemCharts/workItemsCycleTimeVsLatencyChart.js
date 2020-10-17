import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {pick, buildIndex, capitalizeFirstLetter} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {getWorkItemDurations} from "./shared";

import {
  Colors,
  WorkItemStateTypeSortOrder,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemTypeDisplayName, WorkItemTypeScatterRadius
} from "../../config";


function getSeriesByStateType(workItems) {
  // We group the work items into series by state type.
  const workItemsByStateType = buildIndex(workItems, workItem => workItem.stateType);

  return Object.keys(workItemsByStateType).sort(
    (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
  ).map(
    stateType => (
      {
        type: 'scatter',
        key: `${stateType}`,
        id: `${stateType}`,
        name: `${WorkItemStateTypeDisplayName[stateType]}`,
        color: `${WorkItemStateTypeColor[stateType]}`,
        marker: {
          symbol: 'circle',
          radius: 5
        },
        allowPointSelect: true,
        data: workItemsByStateType[stateType].map(
          workItem => (
            {
              x: workItem.cycleTime,
              y: workItem.latency || workItem.cycleTime,
              workItem: workItem
            }
          )
        ),

      }
    )
  );
}

function getSeriesByState(workItems) {
  // We group the work items into series by state.
  const workItemsByState = buildIndex(workItems, workItem => workItem.state);

  return Object.keys(workItemsByState).sort(
    (stateTypeA, stateTypeB) => workItemsByState[stateTypeA].length - workItemsByState[stateTypeB].length
  ).map(
    state => (
      {
        type: 'scatter',
        key: `${state}`,
        id: `${state}`,
        name: state,
        marker: {
          symbol: 'circle',
          radius: 5
        },
        allowPointSelect: true,
        data: workItemsByState[state].map(
          workItem => (
            {
              x: workItem.cycleTime,
              y: workItem.latency || workItem.cycleTime,
              workItem: workItem
            }
          )
        ),

      }
    )
  );
}

export const WorkItemsCycleTimeVsLatencyChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'workItems', 'stateTypes', 'title', 'subTitle', 'groupByState', 'cycleTimeTarget')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point.workItem),

  getConfig: ({workItems, stateTypes, title, subTitle, groupByState, cycleTimeTarget, shortTooltip, intl}) => {

    const workItemsWithAggregateDurations = getWorkItemDurations(workItems).filter(
      workItem => stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true
    );

    const maxCycleTime = Math.max(...workItemsWithAggregateDurations.map(workItems=>workItems.cycleTime));

    const cycleTimeVsLatencySeries = groupByState ?
      getSeriesByState(workItemsWithAggregateDurations)
      : getSeriesByStateType(workItemsWithAggregateDurations);

    return {
      chart: {

        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy',

      },
      title: {
        text: title || 'Title',
        align: 'left',
      },
      subtitle: {
        text: `${subTitle || 'Cycle Time and Latency: '} ${intl.formatDate(Date.now(), {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        })} `,
        align: 'left',
      },
      xAxis: {
        type: 'linear',
        min: 0,
        max: Math.max(maxCycleTime, cycleTimeTarget || -1),
        visible: true,
        labels: {
          formatter: function () {
            return intl.formatNumber(this.value, {maximumSignificantDigits: 2})
          },
        },
        title: {
          text: 'Cycle Time in Days'
        },
        plotLines: cycleTimeTarget ? [
          {
            color: 'red',
            value: cycleTimeTarget,
            dashStyle: 'longdashdot',
            width: 1,
            label: {
              text: ` T= ${intl.formatNumber(cycleTimeTarget)}`,
            }
          }
        ] : null,
      },
      yAxis: {
        type: 'logarithmic',
        labels: {
          formatter: function () {
            return intl.formatNumber(this.value, {maximumSignificantDigits: 2})
          },
        },
        title: {
          text: 'Latency in Days'
        },
      },

      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          const {displayId, workItemType, name, state, stateType, timeInStateDisplay, cycleTime, duration, latency, workItemStateDetails} = this.point.workItem;

          return tooltipHtml({
            header: `${WorkItemTypeDisplayName[workItemType]}: ${displayId}<br/>${name}`,
            body: [
              [`Cycle Time:`, `${intl.formatNumber(cycleTime)} days`],
              [`-----------------`, ``],
              [`Current State:`, `${state}`],
              [`Entered:`, `${timeInStateDisplay}`],

              stateType !== 'closed' ? [`Time in State:`, `${intl.formatNumber(this.y)} days`] : ['', ''],

              [`Commits`, `${intl.formatNumber(workItemStateDetails.commitCount || 0)}`],
              workItemStateDetails.commitCount != null ? [`-----------------`, ``] : [``,``],
              duration != null ? [`Duration`, `${intl.formatNumber(duration)} days`] : ['', ''],
              latency != null ? [`Latency`, `${intl.formatNumber(latency)} days`] : ['', ''],
            ]
          })
        }
      },
      series: [
        ...cycleTimeVsLatencySeries
      ],
      plotOptions: {
        series: {
          animation: false
        }
      },
      legend: {
        title: {
          text: groupByState ? 'State' : 'Phase',
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
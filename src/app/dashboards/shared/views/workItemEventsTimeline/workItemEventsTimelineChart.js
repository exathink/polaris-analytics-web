import {Chart, tooltipHtml} from "../../../../framework/viz/charts/index";
import moment from 'moment';
import {Colors} from "../../config";
import {capitalizeFirstLetter, daysFromNow, elide, isToday, toMoment, snakeToUpperCamel} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {formatDateTime} from "../../../../i18n";

function getStateType(workItemState) {
  if (workItemState != null) {
    if (['created', 'open', 'unscheduled', 'unstarted', 'planned', 'Backlog'].includes(workItemState)) {
      return 'initial'
    } else if (['closed', 'accepted'].includes(workItemState)) {
      return 'terminal'
    } else {
      return 'in-progress'
    }
  }
}

function getDaysSubtitle(days, prefix='Last') {
  return days > 1 ? `${prefix} ${days} Days`
      : days > 0 ? `${prefix} 24 hours` : ``;
}

function getSubtitleText(before, startWindow, endWindow, latestEvent, days){
  const endWindowDays = endWindow && daysFromNow(endWindow)
  if(latestEvent) {
    return isToday(latestEvent) ? getDaysSubtitle(days) : `${getDaysSubtitle(days,'')} ending ${toMoment(latestEvent).format('MM/DD/YYYY hh:mm a')}`
  } else if(!before || (endWindowDays <= 1)) {
    return getDaysSubtitle(days)
  } else {
    return startWindow ?
      `${startWindow.format('MM/DD/YYYY')} - ${endWindow.format('MM/DD/YYYY')}`
      : ``
  }
}

function getTitleText(totalWorkItems) {
  return `${totalWorkItems} Active Work Items`
}


function workItemStateChangeTooltip(intl, event, shortTooltip) {
  const header = `${snakeToUpperCamel(event.workItemType)}: ${elide(event.name, 50)}`;
  const transition = `Status: ${event.previousState ? `${capitalizeFirstLetter(event.previousState)} -> ` : ``} ${capitalizeFirstLetter(event.newState)} `

  return tooltipHtml(shortTooltip ? {
    header: `${header}<br/>${transition}`,
    body: [
      [`Source: `, `${event.workItemsSourceName}`],
      [`Id: `, `#${event.displayId}`],
      [`Date: `, `${formatDateTime(intl, toMoment(event.eventDate))}`],
    ]
  } : {
    header: `${header}<br/>${transition}`,
    body: [
      [`Source: `, `${event.workItemsSourceName}`],
      [`Id: `, `#${event.displayId}`],
      [`Date: `, `${formatDateTime(intl, toMoment(event.eventDate))}`],
    ]
  })
}

function workItemCommitTooltip(intl, event, shortTooltip) {
  const header = `${snakeToUpperCamel(event.workItemType)}: ${elide(event.workItemName, 50)}`;
  const commit = `Commit: ${event.committer} committed to ${event.repository} on branch ${event.branch}`
  return tooltipHtml(shortTooltip ? {
    header: `${header}<br/>${commit}`,
    body: [
      [`Message: `, `${elide(event.commitMessage, 60)}`],
      [`Author: `, `${event.author}`],
      [`Date: `, `${formatDateTime(intl, toMoment(event.commitDate))}`]
    ]
  } : {
    header: `${header}<br/>${commit}`,
    body: [
      [`Message: `, `${elide(event.commitMessage, 60)}`],
      [`Author: `, `${event.author}`],
      [`Date: `, `${formatDateTime(intl, toMoment(event.commitDate))}`]
    ]
  })
}

function getTooltip(intl, point, shortTooltip) {
  const event = point.timelineEvent;

  if (event.eventDate != null) {
    return workItemStateChangeTooltip(intl, event, shortTooltip);
  } else {
    return workItemCommitTooltip(intl, event, shortTooltip);
  }
}

export const WorkItemEventsTimelineChart = Chart({
  chartUpdateProps:
    (props) => (
      {
        model: props.model
      }
    ),

  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point.workItem),

  getConfig:

    ({model, context, intl, view, days, before,  latestEvent, latest, totalWorkItemEvents, shortTooltip, markLatest, showScrollbar, onAuthorSelected, onRepositorySelected}) => {
      const timelineEvents = model.timelineEvents;
      const categoryIndex = model.categoriesIndex;
      const totalWorkItems = Object.keys(model.workItemsIndex).length;
      const category = model.groupBy

      // sort in descending order of activity
      const categories = Object.keys(categoryIndex).sort((a, b) => categoryIndex[b] - categoryIndex[a]);
      const series_data = timelineEvents.map((timelineEvent, index) => {
        const eventDate = toMoment(timelineEvent.eventDate || timelineEvent.commitDate);
        return (
          {
            x: eventDate.valueOf(),
            y: categories.indexOf(model.getCategory(timelineEvent)),
            z: 3,
            timelineEvent: timelineEvent
          }
        )
      });


      let startWindow = null;
      let endWindow = before && moment(before)
      if (endWindow) {
        startWindow = moment(endWindow).subtract(days, 'days');
      }


      return {
        chart: {
          type: 'scatter',
          backgroundColor: Colors.Chart.backgroundColor,
          zoomType: view === 'detail' ? 'xy' : undefined,
          panning: true,
          panKey: 'shift',
        },
        title: {
          text: getTitleText(totalWorkItems),
          align: 'left'
        },
        subtitle: {
          text: getSubtitleText(before, startWindow, endWindow,  latestEvent, days),
          align: 'left'
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: 'Timeline'
          }
        },
        yAxis: {
          id: 'y-items',
          title: {
            text: capitalizeFirstLetter(category)
          },
          categories: categories,
          scrollbar: {
            enabled: view === 'detail' && showScrollbar,
            showFull: false
          },
          reversed: true,
          min: 0,
          max: categories.length - 1,
          labels: {
            align: 'left',
            reserveSpace: true,
            formatter: function() {
              if(category === 'workItem') {
                const event = model.workItemsIndex[this.value];

                if (event != null) {
                  return event.eventDate ? event.name : event.workItemName;
                } else {
                  return this.value;
                }
              } else {
                return this.value
              }
            }
          }
        },
        tooltip: {
          useHTML: true,
          hideDelay: 50,
          formatter: function () {
            return getTooltip(intl, this.point, shortTooltip);
          },
        },
        series: [
          {
            key: 'initial_states',
            id: 'initial_states',
            name: 'Open',
            pointWidth: 20,
            data: series_data.filter(point=>getStateType(point.timelineEvent.newState) === 'initial'),
            turboThreshold: 0,
            allowPointSelect: true,
            color: '#1c98cb',
            marker: {
              symbol: 'triangle',
              radius: 6
            }
          },
          {
            key: 'terminal_states',
            id: 'terminal_states',
            name: 'Completed',
            pointWidth: 20,
            data: series_data.filter(point=>getStateType(point.timelineEvent.newState) === 'terminal'),
            turboThreshold: 0,
            allowPointSelect: true,
            color:  '#8f9a8e',
            marker: {
              symbol: 'triangle-down',
              radius: 6
            }
          },
          {
            key: 'wip_states',
            id: 'wip_states',
            name: 'Wip',
            pointWidth: 20,
            data: series_data.filter(point=>getStateType(point.timelineEvent.newState) === 'in-progress'),
            turboThreshold: 0,
            allowPointSelect: true,
            color: '#199a4a',
            marker: {
              symbol: 'diamond',
              radius: 6
            }
          },
          {
            key: 'commits',
            id: 'commits',
            name: 'Commit',
            pointWidth: 20,
            data: series_data.filter(point=>point.timelineEvent.commitDate != null),
            turboThreshold: 0,
            allowPointSelect: true,
            color: '#437f61',
            marker: {
              symbol: 'circle',
              radius: 3
            }
          }
        ],
        legend: {
          enabled: true
        },
        time: {
          // Since we are already passing in UTC times we
          // dont need the chart to translate the time to UTC
          // This makes sure the tooltips text matches the timeline
          // on the axis.
          useUTC: false
        }

      }
    }
});

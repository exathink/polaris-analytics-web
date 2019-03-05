import {Chart, tooltipHtml} from "../../../../framework/viz/charts/index";
import moment from 'moment';
import {Colors} from "../../config";
import {capitalizeFirstLetter, daysFromNow, elide, isToday, toMoment, snakeToUpperCamel} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {queueTime} from "../../helpers/commitUtils";
import {formatDateTime} from "../../../../i18n";

function getStateType(workItemState) {
  if (['open', 'unscheduled', 'unstarted'].includes(workItemState)) {
    return 'initial'
  } else if (['closed', 'accepted'].includes(workItemState)) {
    return 'terminal'
  } else {
    return 'in-progress'
  }
}

function getDaysSubtitle(days, prefix='Last') {
  return days > 1 ? `${prefix} ${days} Days`
      : days > 0 ? `${prefix} 24 hours` : ``;
}

function getSubtitleText(before, startWindow, endWindow, latestCommit, days){
  const endWindowDays = endWindow && daysFromNow(endWindow)
  if(latestCommit) {
    return isToday(latestCommit) ? getDaysSubtitle(days) : `${getDaysSubtitle(days,'')} ending ${toMoment(latestCommit).format('MM/DD/YYYY hh:mm a')}`
  } else if(!before || (endWindowDays <= 1)) {
    return getDaysSubtitle(days)
  } else {
    return startWindow ?
      `${startWindow.format('MM/DD/YYYY')} - ${endWindow.format('MM/DD/YYYY')}`
      : ``
  }
}

function getTitleText(latest, commits, totalCommits) {
  return latest && latest === commits.length ?
    `Last ${latest} Commits ${latest < totalCommits ? `of ${totalCommits}`: ``}`
    : `${commits.length} Active Work Items`
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

    ({model, context, intl, view, days, before, latestCommit, latest, totalWorkItems, totalWorkItemEvents, shortTooltip, markLatest, showScrollbar, onAuthorSelected, onRepositorySelected}) => {
      const workItemEvents = model.workItemEvents;
      const categoryIndex = model.categoriesIndex;
      const category = model.groupBy

      // sort in descending order of activity
      const categories = Object.keys(categoryIndex).sort((a, b) => categoryIndex[b] - categoryIndex[a]);
      const series_data = workItemEvents.map((workItemEvent, index) => {
        const eventDate = toMoment(workItemEvent.eventDate);
        return (
          {
            x: eventDate.valueOf(),
            y: categories.indexOf(model.getCategory(workItemEvent)),
            z: 3,
            workItemEvent: workItemEvent
          }
        )
      });


      const latest_point = markLatest && series_data.length > 0 && series_data.reduce(
        (latest, point) => latest.x < point.x ? point : latest,
        series_data[0]
      );
      if (latest_point) {
        latest_point.color = Colors.ActivityLevel.ACTIVE
      }

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
          text: getTitleText(latest, workItemEvents,totalWorkItemEvents),
          align: view === 'detail' ? 'center' : 'left'
        },
        subtitle: {
          text: getSubtitleText(before, startWindow, endWindow, latestCommit, days),
          align: view === 'detail' ? 'center' : 'left'
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: 'Timeline'
          },
          max: endWindow ? moment(endWindow).add(1, 'h').valueOf() : latestCommit ? toMoment(latestCommit).add(1,'h').valueOf() : moment().add(1, 'h').valueOf()
        },
        yAxis: {
          id: 'y-items',
          title: {
            text: capitalizeFirstLetter(category)
          },
          categories: categories.map(cat => `${cat}: ${categoryIndex[cat]}`),
          scrollbar: {
            enabled: view === 'detail' && showScrollbar,
            showFull: false
          },
          reversed: true,
          min: 0,
          max: categories.length - 1,
          labels: {
            useHTML: true,
          }
        },
        tooltip: {
          useHTML: true,
          hideDelay: 50,
          formatter: function () {
            const event = this.point.workItemEvent;
            const header = `${snakeToUpperCamel(event.workItemType)}: ${elide(event.name, 50)}`;
            const transition = `Status: ${event.previousState? `${capitalizeFirstLetter(event.previousState)} -> ` : ``} ${capitalizeFirstLetter(event.newState)} `

            return tooltipHtml(shortTooltip ? {
              header: `${header}<br/>${transition}`,
              body: [
                [`Source: `, `${event.workItemsSourceName}`],
                [`Id: `, `#${event.displayId}`],
                [`Date: `, `${event.eventDate}`],
              ]
            } : {
              header: `${header}<br/>${transition}`,
              body: [
                [`Source: `, `${event.workItemsSourceName}`],
                [`Id: `, `#${event.displayId}`],
                [`Date: `, `${event.eventDate}`],
              ]
            })
          }
        },
        series: [
          {
            key: 'initial_states',
            id: 'initial_states',
            name: 'Open',
            pointWidth: 20,
            data: series_data.filter(point=>getStateType(point.workItemEvent.newState) == 'initial'),
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
            data: series_data.filter(point=>getStateType(point.workItemEvent.newState) == 'terminal'),
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
            data: series_data.filter(point=>getStateType(point.workItemEvent.newState) == 'in-progress'),
            turboThreshold: 0,
            allowPointSelect: true,
            color: '#199a4a',
            marker: {
              symbol: 'diamond',
              radius: 6
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



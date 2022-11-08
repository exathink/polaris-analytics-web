import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {AppTerms, Colors} from "../../config";
import {displayPlural, displaySingular, formatTerm} from "../../../../i18n";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import moment from 'moment';
import {findActivityLevel} from "../../helpers/commitUtils";
import {toMoment, isToday} from "../../../../helpers/utility";
import {Contexts} from "../../../../meta";

function formatDays(days) {
  return days > 1 ? `${days} days` : `24 Hours`
}

function formatSubtitle(before, latestCommit,  days) {
  if(before) {
    return `${formatDays(days)} ending ${moment(before).format('MM/DD/YYYY')}`
  } else
    if (latestCommit) {
      return isToday(latestCommit) ? `Last ${formatDays(days)}` : `${formatDays(days)} ending ${toMoment(latestCommit).format('MM/DD/YYYY')}`
    } else {
      return `Last ${formatDays(days)}`
  }
}

function initSeries(activeChildren, context, activityLevel) {
  return activeChildren.map(child => ({
    name: child.name,
    y: child.commitCount,
    color: activityLevel ? activityLevel.color : context.color(),
    child: child
  }));
}

export const MostActiveChildrenBarChart = Chart({
  chartUpdateProps:
    (props) => ({
      activeChildren: props.activeChildren,
      childContext: props.childContext,
    }),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point=>point.child),
  getConfig:
    ({activeChildren, view, top, before, latestCommit, days, childContext, context, intl}) => {
      const series_data = initSeries(activeChildren,context, findActivityLevel(latestCommit));
      const childContextName = displaySingular(intl, childContext);
      return {
        chart: {
          type: 'column',
          backgroundColor: Colors.Chart.backgroundColor
        },
        title: {
          // hack alert
          text: childContext.name === Contexts.work_items.name ? `Most Active ${AppTerms.specs.display}` :  `Most Active ${displayPlural(intl, childContext)} `,
          align: 'left'
        },
        subtitle: {
          text: formatSubtitle(before, latestCommit, days),
          align: 'left'
        },
        tooltip: {
          useHTML: true,
          hideDelay: 50,
          formatter: function () {
            return tooltipHtml({
              header: `${childContextName}: ${this.point.name}`,
              body: [
                [`${formatTerm(intl, 'Commits')}:`, `${intl.formatNumber(this.y)}`]
              ]
            })
          }
        },
        xAxis: {
          type: 'category',
          title: {
            text: childContextName
          },
          visible: view === 'detail'
        },
        yAxis: {
          type: 'linear',
          title: {
            text: 'Commits'
          },
          allowDecimals: false
        },
        series: [{
          key: 'Recent commits',
          id: 'Recent commits',
          name: 'Commits',
          data: series_data,
          allowPointSelect: true,
          cursor: 'pointer'
        }],
        legend: {
          enabled: false
        },
        plotOptions: {
            series: {
              dataLabels: {
                enabled: view === 'primary',
                align: 'center',
                format: `<b>{point.name}</b>`,
                style: {
                  color: 'black'
                }
              }
            }
        }
      }
    }
});
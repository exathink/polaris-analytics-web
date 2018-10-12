import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {Colors} from "../../config";
import {displayPlural, displaySingular, formatTerm} from "../../../../i18n";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

function formatDays(days) {
  return days > 1 ? `${days} days` : `24 Hours`
}

function initSeries(activeChildren) {
  return activeChildren.map(child => ({
    name: child.name,
    y: child.commitCount,
    color: Colors.ActivityLevel.ACTIVE,
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
    ({activeChildren, view, top, days, childContext, intl}) => {
      const series_data = initSeries(activeChildren);
      const childContextName = displaySingular(intl, childContext);
      return {
        chart: {
          type: 'column',
          backgroundColor: Colors.Chart.backgroundColor
        },
        title: {
          text: `Most Active ${displayPlural(intl, childContext)} `,
          align: 'left'
        },
        subtitle: {
          text: `Last ${formatDays(days)}`,
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
            text: 'Repository'
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
          allowPointSelect: true
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
import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import moment from 'moment';
import {Colors} from "../../config";
import {formatTerm} from "../../../../i18n";


function initSeries(cumulativeCommitCounts) {
  return cumulativeCommitCounts.map(cumulativeCommitCount => {
    const week = `${cumulativeCommitCount.week}`.padStart(2, '0');
    const date  = moment(`${cumulativeCommitCount.year}W${week}`);
    return (
      {
        moment: date,
        x: date.toDate(),
        y: cumulativeCommitCount.cumulativeCommitCount
      }
    )
  });
}

export const CumulativeCommitCountChart = Chart({
  chartUpdateProps:
    (props) => ({
      cumulativeCommitCounts: props.cumulativeCommitCounts
    }),
  getConfig:
    ({cumulativeCommitCounts, context, view, intl}) => {
      const series_data = initSeries(cumulativeCommitCounts);

      return {
        chart: {
          type: 'area',
          backgroundColor: Colors.Chart.backgroundColor
        },
        title: {
          text: view === 'detail' ? 'Commit History': undefined
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: 'Week Of'
          }
        },
        yAxis: {
          type: 'linear',
          title: {
            text: 'Total Commits'
          }
        },
        tooltip: {
          useHTML: true,
          hideDelay: 50,
          formatter: function () {
            return tooltipHtml({
              header: `Week of: ${this.point.moment.format("MMM Do, YYYY")}`,
              body: [
                [`${formatTerm(intl, 'Total Commits')}:`, `${intl.formatNumber(this.y)}`]
              ]
            })
          }
        },
        series: [{
          key: 'cumulative commits',
          id: 'cumulative commits',
          name: 'Cumulative Commits',
          color: context.color(),
          data: series_data
        }],
        plotOptions: {
          series: {
            animation: view !== 'detail'
          }
        },
        legend: {
          enabled: false
        },
      }
    }
});
import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import moment from 'moment';
import {Colors} from "../../config";
import {formatTerm} from "../../../../i18n";
import {replicate} from "../../../../helpers/utility";

function initSeries(cumulativeCommitCounts) {
  return cumulativeCommitCounts.map(cumulativeCommitCount => {
    // week 53 (leap week) is not handled properly by moment. Coerce it back to week 52.
    // this calc is not accurate strictly speaking, but it is good enough for
    // most cases and wont matter much in the overall display of the chart.
    // Can revisit if we need to.
    const week = `${Math.min(cumulativeCommitCount.week, 52)}`.padStart(2, '0');
    const date  = moment(`${cumulativeCommitCount.year}W${week}`);
    return (
      [
        date.valueOf(),
        cumulativeCommitCount.cumulativeCommitCount
      ]
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
              header: `Week of: ${moment(this.x).format("MMM Do, YYYY")}`,
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
          data: series_data,
          color: context.color()
        }],
        legend: {
          enabled: false
        },

      }
    }
});
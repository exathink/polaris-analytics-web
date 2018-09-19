import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import moment from 'moment';
import {Colors} from "../../config";
import {formatTerm} from "../../../../i18n";


function initSeries(weeklyContributorCounts) {
  return weeklyContributorCounts.map(weeklyContributorCount => {
    // week 53 (leap week) is not handled properly by moment. Coerce it back to week 52.
    // this calc is not accurate strictly speaking, but it is good enough for
    // most cases and wont matter much in the overall display of the chart.
    // Can revisit if we need to.
    const week = `${Math.min(weeklyContributorCount.week, 52)}`.padStart(2, '0');
    const date  = moment(`${weeklyContributorCount.year}W${week}`);
    return (
      [
        date.valueOf(),
        weeklyContributorCount.contributorCount
      ]
    )
  });
}

export const WeeklyContributorCountChart = Chart({
  chartUpdateProps:
    (props) => ({
      weeklyContributorCounts: props.weeklyContributorCounts
    }),
  getConfig:
    ({weeklyContributorCounts, context, view, intl}) => {
      const series_data = initSeries(weeklyContributorCounts);
      if (series_data.length > 0) {
        // we add a last item pegging todays date to the the last commit count
        // This normalizes all commit histories to today.
        series_data.push([moment().valueOf(), series_data[series_data.length-1][1]]);
      }

      return {
        chart: {
          type: 'column',
          backgroundColor: Colors.Chart.backgroundColor
        },
        title: {
          text: 'Weekly Contributor Counts',
          align: view === 'detail' ? 'center': 'left'
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
            text: 'Number of Contributors'
          }
        },
        tooltip: {
          useHTML: true,
          hideDelay: 50,
          formatter: function () {
            return tooltipHtml({
              header: `Week of: ${moment(this.x).format("MMM Do, YYYY")}`,
              body: [
                [`${formatTerm(intl, 'Number of contributors')}:`, `${intl.formatNumber(this.y)}`]
              ]
            })
          }
        },
        series: [{
          key: '1',
          id: '1',
          name: '1',
          data: series_data,
          color: context.color()
        }],
        legend: {
          enabled: false
        },

      }
    }
});
import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import moment from 'moment';
import {Colors} from "../../config";
import {formatTerm} from "../../../../i18n";
import {week_to_date} from "../../../../helpers/utility";
import {PointSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/pointSelectionHandler";

function initSeries(cumulativeCommitCounts) {
  return cumulativeCommitCounts.map(cumulativeCommitCount => {
    const weekDate = week_to_date(cumulativeCommitCount.year, cumulativeCommitCount.week)
    return (
      {
        x: weekDate.valueOf(),
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
  eventHandler: PointSelectionEventHandler,
  mapPoints: points => points.map(
    point => ({
      weekDate: moment(point.x),
      cumulativeCommitCount: point.y
    })
  ),
  getConfig:
    ({cumulativeCommitCounts, context, view, intl}) => {
      const series_data = initSeries(cumulativeCommitCounts);
      if (series_data.length > 0) {
        // we add a last item pegging todays date to the the last commit count
        // This normalizes all commit histories to today.
        series_data.push([moment().valueOf(), series_data[series_data.length-1][1]]);
      }

      return {
        chart: {
          type: 'area',
          backgroundColor: Colors.Chart.backgroundColor,
          zoomType: view === 'detail' ? 'xy' : undefined,
        },
        title: {
          text: 'Commit History',
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
          allowPointSelect: view ==='detail',
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
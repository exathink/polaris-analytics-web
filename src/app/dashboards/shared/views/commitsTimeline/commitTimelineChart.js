import {tooltipHtml} from "../../../../framework/viz/charts/index";
import {Chart} from "../../../../framework/viz/charts/index";
import {displaySingular, formatTerm} from "../../../../i18n/index";
import moment from 'moment';
import {Colors} from "../../config";
import {elide} from "../../../../helpers/utility";

export const CommitsTimelineChart = Chart({
    chartUpdateProps:
      (props) => ({
        commits: props.commits
      }),
    getConfig:
      ({commits, context, intl, view, groupBy, days}) => {
        const category = groupBy || 'author';
        const categories_index = commits.reduce(
          (index, commit) => {
            index[commit[category]] = commit[category];
            return index
          },
          {}
        );
        const categories = Object.keys(categories_index);

        const series_data = commits.map((commit, index) => {
          const commit_date = moment(commit.commitDate);
          const offset = moment(commit_date).add(3, 'hours');
          return (
            {
              x: commit_date.valueOf(),
              x2: offset.valueOf(),
              y: categories.indexOf(commit[category]),
              commit: commit
            }
          )
        });

        return {
          chart: {
            type: 'xrange',
            backgroundColor: Colors.Chart.backgroundColor,
            zoomType: view === 'detail'?  'xy' : undefined
          },
          title: {
            text: `Recent Commits`,
            align: view === 'detail' ? 'center' : 'left'
          },
          subtitle: {
            text: `Last ${days} Days`,
            align: view === 'detail' ? 'center' : 'left'
          },
          xAxis: {
            type: 'datetime',
            title: {
              text: 'Timeline'
            },
            max: moment().valueOf()
          },
          yAxis: {
            id: 'y-items',
            title: 'y-axis-thingy',
            categories: categories,
            reversed: true,
            scrollbar: {
              enabled: view === 'detail',
              showFull: false
            }
          },
          tooltip: {
            useHTML: true,
            hideDelay: 50,
            formatter: function () {
              return tooltipHtml({
                header: `Author: ${this.point.commit.author}`,
                body: [
                  [`Commit Date: `, `${moment(this.x).format("MM/DD/YYYY HH:mm a")}`],
                  [`Branch: `, `${this.point.commit.branch || ''}`],
                  ['Commit Message: ', `${elide(this.point.commit.commitMessage, 60)}`],
                  [`Committer: `, `${this.point.commit.committer}`]

                ]
              })
            }
          },
          series: [
            {
              key: 'timeline',
              id: 'timeline',
              name: 'timeline',
              pointWidth: 20,
              data: series_data,
              turboThreshold: 0
            }
          ],
          legend: {
            enabled: false
          },
          time: {
            // Since we are already passing in UTC times we
            // dont need the chart to translate the time to UTC
            // This makes sure the tooltips text matches the timeline
            // on the axis.
            useUTC: false
          }
        };
      }


  }
);


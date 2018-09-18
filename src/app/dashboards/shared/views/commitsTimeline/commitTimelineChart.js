import {tooltipHtml} from "../../../../framework/viz/charts/index";
import {Chart} from "../../../../framework/viz/charts/index";
import {displaySingular, formatTerm} from "../../../../i18n/index";
import moment from 'moment';
import {Colors} from "../../config";

export const CommitsTimelineChart = Chart({
    chartUpdateProps:
      (props) => ({
        commits: props.commits
      }),
    getConfig:
      ({commits, context, intl, view}) => {
        const categories_index = commits.reduce(
          (index, commit) => {
            index[commit.author] = commit.author;
            return index
          },
          {}
        );
        const categories = Object.keys(categories_index);

        const series_data = commits.map((commit, index) => {
          const commit_date = moment(commit.commitDate);
          const offset = moment(commit_date).add(2, 'hours');
          return (
            {
              x: commit_date.valueOf(),
              x2: offset.valueOf(),
              y: categories.indexOf(commit.author),
              commit: commit
            }
          )
        });

        return {
          chart: {
            type: 'xrange',
            backgroundColor: Colors.Chart.backgroundColor
          },
          title: {
            text: null
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
            visible: view === 'detail'
          },
          tooltip: {
            useHTML: true,
            hideDelay: 50,
            formatter: function () {
              return tooltipHtml({
                header: `Author: ${this.point.commit.author}`,
                body: [
                  [`Commit Date:`, `${this.point.commit.commitDate}`],
                  ['Commit Message: ', `${this.point.commit.commitMessage}`]
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
          }
        };
      }


  }
);


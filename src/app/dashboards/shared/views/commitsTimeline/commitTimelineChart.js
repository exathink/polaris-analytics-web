import {tooltipHtml} from "../../../../framework/viz/charts/index";
import {Chart} from "../../../../framework/viz/charts/index";
import {displaySingular, formatTerm} from "../../../../i18n/index";
import moment from 'moment';
import {Colors} from "../../config";
import {elide} from "../../../../helpers/utility";
import {PointSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/pointSelectionHandler";


export const CommitsTimelineChart = Chart({
    chartUpdateProps:
      (props) => ({
        commits: props.commits

      }),

    eventHandler: PointSelectionEventHandler,
    mapPoints: (points, _) => points.map(point => point.commit),

    getConfig:
      ({commits, context, intl, view, groupBy, days, before, onAuthorSelected, onRepositorySelected}) => {
        const category = groupBy || 'author';
        const categories_index = commits.reduce(
          (index, commit) => {
            index[commit[category]] = index[commit[category]] === undefined ? 1 : index[commit[category]] + 1;
            return index
          },
          {}
        );

        // sort in descending order of activity
        const categories = Object.keys(categories_index).sort((a, b) => categories_index[b] - categories_index[a]);

        const series_data = commits.map((commit, index) => {
          const commit_date = moment(commit.commitDate);
          return (
            {
              x: commit_date.valueOf(),
              y: categories.indexOf(commit[category]),
              z: commit.stats.lines,
              commit: commit
            }
          )
        });
        let startWindow = null;
        if (before) {
          startWindow = moment(before).subtract(days, 'days');
        }

        return {
          chart: {
            type: 'bubble',
            backgroundColor: Colors.Chart.backgroundColor,
            zoomType: view === 'detail' ? 'xy' : undefined,
            panning: true,
            panKey: 'shift',
          },
          title: {
            text: `${commits.length} Commits`,
            align: view === 'detail' ? 'center' : 'left'
          },
          subtitle: {
            text: startWindow ? `${startWindow.format('YYYY/MM/DD')} - ${before.format('YYYY/MM/DD')}` : `Last ${days} Days`,
            align: view === 'detail' ? 'center' : 'left'
          },
          xAxis: {
            type: 'datetime',
            title: {
              text: 'Timeline'
            },
            max: before? before.valueOf() : moment().valueOf()
          },
          yAxis: {
            id: 'y-items',
            title: 'y-axis-thingy',
            categories: categories.map(cat => `${cat}: ${categories_index[cat]}`),
            scrollbar: {
              enabled: view === 'detail',
              showFull: false
            },
            reversed: true,
            min: 0,
            max: categories.length - 1,
            labels: {
              useHTML: true,
              events: {
                /* This code relies on the custom events module which is breaks core highcharts code in many places
                *  so we have turned it off for now and this click event will have no effect. Revisit when we
                *  can use the module more reliably.
                * */
                click: function () {
                  const cat_index = this.axis.categories.indexOf(this.value);
                  if (cat_index !== -1) {
                    if ((onAuthorSelected && category ==='author') || (onRepositorySelected && category === 'repository')) {
                      const category_name = categories[cat_index];
                      const commit = commits.find(commit => commit[category] === category_name);
                      if (commit) {
                         if (category === 'author') {
                            onAuthorSelected(commit.author, commit.authorKey)
                         } else {
                           onRepositorySelected(commit.repository, commit.repositoryKey)
                         }
                      }
                    }
                  }
                }
              }
            }
          },
          tooltip: {
              useHTML: true,
              hideDelay: 50,
              formatter: function () {
                return tooltipHtml({
                  header: `Author: ${this.point.commit.author}`,
                  body: [
                    ['Commit: ', `${this.point.commit.name}`],
                    [`Commit Date: `, `${moment(this.x).format("MM/DD/YYYY HH:mm a")}`],
                    [`Repository: `, `${this.point.commit.repository}`],
                    [`Branch: `, `${this.point.commit.branch || ''}`],
                    [`------`, ``],
                    ['Commit Message: ', `${elide(this.point.commit.commitMessage, 60)}`],
                    [`Committer: `, `${this.point.commit.committer}`],
                    [`------`, ``],
                    [`Files: `, `${this.point.commit.stats.files}`],
                    [`Lines: `, `${this.point.commit.stats.lines}`]
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
              turboThreshold: 0,
              allowPointSelect: true
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

        }
    }
});



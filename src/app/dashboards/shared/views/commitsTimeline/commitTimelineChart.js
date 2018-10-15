import {Chart, tooltipHtml} from "../../../../framework/viz/charts/index";
import moment from 'moment';
import {Colors} from "../../config";
import {elide} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {toMoment} from "../../../../helpers/utility";
import {getCategoriesIndex} from "./utils";

function getSubtitleText(startWindow, endWindow, days){
  return startWindow ?
    `${startWindow.format('YYYY/MM/DD')} - ${endWindow.format('YYYY/MM/DD')}`
    : days > 1 ? `Last ${days} Days`
      : days > 0 ? `Last 24 hours` : ``;
}

function getTitleText(latest, commits) {
  return latest && latest === commits.length ?
    `Latest ${latest} Commits`
    : `${commits.length} Commits`
}

export const CommitsTimelineChart = Chart({
  chartUpdateProps:
    (props) => (
      {
        commits: props.commits
      }
    ),

  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point.commit),

  getConfig:

    ({commits, context, intl, view, groupBy, days, before, latest, shortTooltip, markLatest, categoryIndex, showScrollbar, onAuthorSelected, onRepositorySelected}) => {
      const {category, categories_index} = categoryIndex || getCategoriesIndex(commits, groupBy);

      // sort in descending order of activity
      const categories = Object.keys(categories_index).sort((a, b) => categories_index[b] - categories_index[a]);
      const series_data = commits.map((commit, index) => {
        const commit_date = toMoment(commit.commitDate);
        return (
          {
            x: commit_date.valueOf(),
            y: categories.indexOf(commit[category]),
            z: commit.stats.lines,
            commit: commit
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
          type: 'bubble',
          backgroundColor: Colors.Chart.backgroundColor,
          zoomType: view === 'detail' ? 'xy' : undefined,
          panning: true,
          panKey: 'shift',
        },
        title: {
          text: getTitleText(latest, commits),
          align: view === 'detail' ? 'center' : 'left'
        },
        subtitle: {
          text: getSubtitleText(startWindow, endWindow, days),
          align: view === 'detail' ? 'center' : 'left'
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: 'Timeline'
          },
          max: endWindow ? moment(endWindow).add(1, 'h').valueOf() : moment().add(1, 'h').valueOf()
        },
        yAxis: {
          id: 'y-items',
          title: 'y-axis-thingy',
          categories: categories.map(cat => `${cat}: ${categories_index[cat]}`),
          scrollbar: {
            enabled: view === 'detail' && showScrollbar,
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
                  if ((onAuthorSelected && category === 'author') || (onRepositorySelected && category === 'repository')) {
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
            return tooltipHtml(shortTooltip ? {
              header: `Author: ${this.point.commit.author}`,
              body: [
                ['Commit: ', `${this.point.commit.name}`],
                [`Commit Date: `, `${moment(this.x).format("MM/DD/YYYY hh:mm a")}`],
                [`Repository: `, `${this.point.commit.repository}`],
                [`Branch: `, `${this.point.commit.branch || ''}`],
                ['Commit Message: ', `${elide(this.point.commit.commitMessage, 60)}`]
              ]
            } : {
              header: `Author: ${this.point.commit.author}`,
              body: [
                ['Commit: ', `${this.point.commit.name}`],
                [`Committed: `, `${moment(this.x).format("MM/DD/YYYY hh:mm a")}`],
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



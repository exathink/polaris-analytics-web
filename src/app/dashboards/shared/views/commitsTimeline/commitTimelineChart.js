import {Chart, tooltipHtml} from "../../../../framework/viz/charts/index";
import moment from 'moment';
import {Colors} from "../../config";
import {capitalizeFirstLetter, daysFromNow, elide, isToday, toMoment} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {queueTime} from "../../helpers/commitUtils";
import {formatDateTime} from "../../../../i18n";

function getDaysSubtitle(days, prefix='Last') {
  return days > 1 ? `${prefix} ${days} Days`
      : days > 0 ? `${prefix} 24 hours` : ``;
}

function getSubtitleText(before, startWindow, endWindow, latestCommit, days){
  const endWindowDays = endWindow && daysFromNow(endWindow)
  if(latestCommit) {
    return isToday(latestCommit) ? getDaysSubtitle(days) : `${getDaysSubtitle(days,'')} ending ${toMoment(latestCommit).format('MM/DD/YYYY hh:mm a')}`
  } else if(!before || (endWindowDays <= 1)) {
    return getDaysSubtitle(days)
  } else {
    return startWindow ?
      `${startWindow.format('MM/DD/YYYY')} - ${endWindow.format('MM/DD/YYYY')}`
      : ``
  }
}

function getTitleText(latest, commits, totalCommits) {
  return latest && latest === commits.length ?
    `Last ${latest} Commits ${latest < totalCommits ? `of ${totalCommits}`: ``}`
    : `${commits.length} Commits`
}

function getWorkItemSummaryText(commit) {
  let workItemsSummaries = ""
  if (commit.workItemsSummaries.length  === 0) {
    workItemsSummaries = "None"
  } else if (commit.workItemsSummaries.length  === 1) {
    const item = commit.workItemsSummaries[0]
    workItemsSummaries = `${elide(item.name, 50)} (#${item.displayId})`
  } else {
    workItemsSummaries = "*"
  }
  return workItemsSummaries
}

export const CommitsTimelineChart = Chart({
  chartUpdateProps:
    (props) => (
      {
        model: props.model
      }
    ),

  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point.commit),

  getConfig:

    ({model, context, intl, view, days, before, latestCommit, latest, totalCommits, shortTooltip, markLatest, showScrollbar, onAuthorSelected, onRepositorySelected}) => {
      const commits = model.commits;
      const categoryIndex = model.categoriesIndex;
      const category = model.groupBy

      // sort in descending order of activity
      const categories = Object.keys(categoryIndex).sort((a, b) => categoryIndex[b] - categoryIndex[a]);
      const series_data = commits.map((commit, index) => {
        const commit_date = toMoment(commit.commitDate);
        return (
          {
            x: commit_date.valueOf(),
            y: categories.indexOf(model.getCategory(commit)),
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
          text: getTitleText(latest, commits,totalCommits),
          align: view === 'detail' ? 'center' : 'left'
        },
        subtitle: {
          text: getSubtitleText(before, startWindow, endWindow, latestCommit, days),
          align: view === 'detail' ? 'center' : 'left'
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: 'Timeline'
          },
          max: endWindow ? moment(endWindow).add(1, 'h').valueOf() : latestCommit ? toMoment(latestCommit).add(1,'h').valueOf() : moment().add(1, 'h').valueOf()
        },
        yAxis: {
          id: 'y-items',
          title: {
            text: capitalizeFirstLetter(category)
          },
          categories: categories.map(cat => `${cat}: ${categoryIndex[cat]}`),
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
                [`Committed: `, `${formatDateTime(intl, moment(this.x))}`],
                [`Repository: `, `${this.point.commit.repository}`],
                [`Branch: `, `${this.point.commit.branch || ''}`],
                ['Commit Message: ', `${elide(this.point.commit.commitMessage, 60)}`],
                [`Queue Time: `, `${queueTime(this.point.commit)}`],
              ]
            } : {
              header: `WorkItem: ${getWorkItemSummaryText(this.point.commit)} <br/> Author: ${this.point.commit.author}`,
              body: [
                ['Commit: ', `${this.point.commit.name}`],
                [`Committed: `, `${formatDateTime(intl, moment(this.x))}`],
                [`Repository: `, `${this.point.commit.repository}`],
                [`Branch: `, `${this.point.commit.branch || ''}`],
                [`Queue Time: `, `${queueTime(this.point.commit)}`],
                [`------`, ``],
                ['Commit Message: ', `${elide(this.point.commit.commitMessage, 60)}`],
                [`Committer: `, `${this.point.commit.committer}`],
                [`------`, ``],
                [`Files: `, `${this.point.commit.stats.files}`],
                [`Lines: `, `${this.point.commit.stats.lines}`],

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



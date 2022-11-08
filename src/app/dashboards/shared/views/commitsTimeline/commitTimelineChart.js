import {Chart} from "../../../../framework/viz/charts/index";
import moment from 'moment';
import {
  AppTerms,
  Colors,
  Untracked,
  WorkItemStateTypeDisplayName,
  WorkItemStateTypes,
  WorkItemTypeDisplayName
} from "../../config";
import {capitalizeFirstLetter, daysFromNow, elide, getMinMaxDatesFromRange, getWeekendPlotBands, toMoment} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {queueTime} from "../../helpers/commitUtils";
import {formatDateTime} from "../../../../i18n";
import styles from "./commitTimelineChart.module.css";
import {tooltipHtml_v2} from "../../../../framework/viz/charts/tooltip";

function getDaysSubtitle(days, prefix = 'Last') {
  return days > 1 ? `${prefix} ${days} Days`
    : days > 0 ? `${prefix} 24 hours` : ``;
}

function getSubtitleText(before, startWindow, endWindow, latestCommit, days) {
  const endWindowDays = endWindow && daysFromNow(endWindow)
  if (latestCommit) {
    if (days) {
      return `${getDaysSubtitle(days, '')} ending ${toMoment(latestCommit).format('MM/DD/YYYY hh:mm a')}`
    } else {
      return `Latest commit: ${toMoment(latestCommit).format('MM/DD/YYYY hh:mm a')}`
    }
  } else if (!before || (endWindowDays <= 1)) {
    return getDaysSubtitle(days)
  } else {
    return startWindow ?
      `${startWindow.format('MM/DD/YYYY')} - ${endWindow.format('MM/DD/YYYY')} (${days} days)`
      : ``
  }
}

function getTitleText(latest, commits, totalCommits) {
  return latest && latest === commits.length ?
    `Last ${latest} Commits ${latest < totalCommits ? `of ${totalCommits}`: ``}`
    : `${commits.length} ${commits.length === 1 ? ' Commit' : ' Commits'}`
}

function getWorkItemSummaryText(commit) {
  let workItemsSummaryText = ""
  if (commit.workItemsSummaries != null) {
    if (commit.workItemsSummaries.length === 0) {
      workItemsSummaryText = "Card: None"
    } else if (commit.workItemsSummaries.length === 1) {
      const item = commit.workItemsSummaries[0]
      workItemsSummaryText = `${item.displayId}: ${elide(item.name, 50)}
                               <br/>${WorkItemTypeDisplayName[item.workItemType]}  (${WorkItemStateTypeDisplayName[item.stateType]})
                              <br/>`
    } else {
      workItemsSummaryText = commit.workItemsSummaries.reduce(
        (summary, item, index, workItemsSummaries) =>
          `${summary} ${item.displayId}${index < workItemsSummaries.length - 1 ? ', ' : '.'}`
        ,
        "Cards: "
      )

    }
  }
  return workItemsSummaryText
}


const bucketToBubbleSize = [
  2,
  8,
  9,
  10,
  16,
  22,
]

function z_bucket(lines) {
  if (lines != null) {
    if (lines <= 10) {
      return 1
    } else if (lines <= 50) {
      return 2
    } else if (lines <= 100) {
      return 3
    } else if (lines <= 1000) {
      return 4
    } else {
      return 5
    }
  } else {
    return 0
  }
}

function getYAxisCategoryDisplay(model, commits, categories, category) {
  if (category === "workItem") {
    return categories.map((category) => {
      // eslint-disable-next-line
      const [_, __, stateType, ___, workItemType] = model.mapCategoryToNode(commits, category);
      const strikeThrough = stateType === WorkItemStateTypes.closed ? `text-decoration: line-through;` : "";
      const issueTypeIcon = `<span style="display:flex"><i class=${styles[workItemType]}></i></span>`;
      return `<span class=${styles.issueWrapper}> ${issueTypeIcon} <span style="display: flex; margin: 2px;${strikeThrough}">${category}</span> </span>`;
    });
  } else {
    return categories;
  }
}

export const CommitsTimelineChart = Chart({
  chartUpdateProps:
    (props) => (
      {
        model: props.model,
        excludeMerges: props.excludeMerges
      }
    ),

  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point.commit),

  getConfig:

    ({model, context, intl, view, days, before, latestCommit, latest, totalCommits, excludeMerges, shortTooltip, markLatest, showScrollbar, fullScreen, onCategoryItemSelected}) => {
      const commits = model.commits;
      const categoryIndex = model.categoriesIndex;
      const category = model.groupBy

      // sort in descending order of activity
      let categories = Object.keys(categoryIndex).sort((a, b) => categoryIndex[b] - categoryIndex[a]);
      // we want Untracked items to show up at the end regardless of activity count. This is ugly, but gets the job done.
      if (category === 'workItem' && categories.indexOf(Untracked) >= 0) {
        categories = [Untracked, ...categories.filter(cat => cat !== Untracked)]
      }

      const series_data = []
      for (let i = 0; i < commits.length; i++) {
        const commit = commits[i];
        const commit_date = toMoment(commit.commitDate);
        const commitCategories = model.getCategories(commit)
        for (let j = 0; j < commitCategories.length; j++) {
          series_data.push({
            x: commit_date.valueOf(),
            y: categories.indexOf(commitCategories[j]),
            z: z_bucket(commit.stats.lines),
            commit: commit
          })
        }
      }

      const z_bucket_range = series_data.reduce(
        (minmax, point) => {
          if (minmax.min === null || minmax.min > point.z) {
            minmax.min = point.z
          }
          if (minmax.max === null || minmax.max < point.z) {
            minmax.max = point.z
          }
          return minmax;
        },
        {min: null, max: null}
      )


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

      const [startDate, endDate] = getMinMaxDatesFromRange(commits.map(c => toMoment(c.commitDate)));
      return {
        chart: {
          type: 'bubble',
          backgroundColor: Colors.Chart.backgroundColor,
          zoomType: view === 'detail' ? 'xy' : undefined,
          panning: true,
          panKey: 'shift',
        },
        title: {
          text: getTitleText(latest, commits, totalCommits),
          align: view === 'detail' ? 'center' : 'left'
        },
        subtitle: {
          text: getSubtitleText(before, startWindow, endWindow, latestCommit, days),
          align: view === 'detail' ? 'center' : 'left'
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: 'Timeline <br/> <span style="font-size: 9px; color: #666; font-style: italic;" >Bubble Size: Source Lines Changed</span>'
          },
          max: endWindow ? moment(endWindow).add(1, 'h').valueOf() : latestCommit ? toMoment(latestCommit).add(1, 'h').valueOf() : moment().add(1, 'h').valueOf(),
          plotBands: [
            ...getWeekendPlotBands(startWindow || startDate, endWindow || endDate)
          ]
        },
        yAxis: {
          id: 'y-items',
          title: {
            text: category !== 'workItem' ? capitalizeFirstLetter(category) : AppTerms.spec.display
          },
          categories: getYAxisCategoryDisplay(model, commits, categories, category),
          scrollbar: {
            enabled: view === 'detail' && showScrollbar,
            showFull: false
          },
          reversed: true,
          min: 0,
          max: categories.length - 1,
          labels: {
            align: 'left',
            reserveSpace: true,
            style: {
              cursor: 'pointer'
            },
            useHTML: true,
            events: {
              click: function () {
                const cat_index = this.axis.categories.indexOf(this.value);
                if (cat_index !== -1) {
                  if (onCategoryItemSelected != null) {
                    const category_name = categories[cat_index];
                    const [nodeName, nodeKey] = model.mapCategoryToNode(commits, category_name);
                    if (onCategoryItemSelected && (nodeName != null) && (nodeKey != null)) {
                      onCategoryItemSelected(category, nodeName, nodeKey)
                    }
                  }
                }
              }
            }
          }
        },
        tooltip: {
          useHTML: true,
          outside: category === 'workItem' && !fullScreen,
          hideDelay: 50,
          formatter: function () {
            const workItemHeader = `${getWorkItemSummaryText(this.point.commit)} <br/>`;

            return tooltipHtml_v2(shortTooltip ? {
              header: `${workItemHeader} Author: ${this.point.commit.author}`,
              body: [
                ['Commit Message: ', `${elide(this.point.commit.commitMessage, 60)}`],
                ['Commit: ', `${this.point.commit.name}`],
                [`Committed: `, `${formatDateTime(intl, moment(this.x))}`],
                [`Repository: `, `${this.point.commit.repository}`],
                [`Branch: `, `${this.point.commit.branch || ''}`],

                [`Lines: `, `${this.point.commit.stats.lines}`],
              ]
            } : {
              header: `${workItemHeader} Author: ${this.point.commit.author}`,
              body: [
                ['Commit Message: ', `${elide(this.point.commit.commitMessage, 60)}`],
                [`Committed: `, `${formatDateTime(intl, moment(this.x))}`],
                [`Repository: `, `${this.point.commit.repository}`],
                [`Branch: `, `${this.point.commit.branch || ''}`],
                [],
                ['Commit: ', `${this.point.commit.name}`],
                [`Committer: `, `${this.point.commit.committer}`],
                [],
                [`Files: `, `${this.point.commit.stats.files}`],
                [`Lines: `, `${this.point.commit.stats.lines}`],
                [`Queue Time: `, `${queueTime(this.point.commit)}`],

              ]
            })
          }
        },
        series: [
          {
            key: 'commits',
            id: 'commits',
            name: 'Commits',
            cursor: 'pointer',
            data: series_data.filter(point => point.commit.numParents <= 1),
            minSize: bucketToBubbleSize[z_bucket_range.min],
            maxSize: bucketToBubbleSize[z_bucket_range.max],
            turboThreshold: 0,
            allowPointSelect: true,
            color: Colors.Commits.nonMerge
          },
          {
            key: 'merges',
            id: 'merges',
            name: 'Merges',
            cursor: 'pointer',
            data: series_data.filter(point => point.commit.numParents > 1),
            minSize: bucketToBubbleSize[z_bucket_range.min],
            maxSize: bucketToBubbleSize[z_bucket_range.max],
            turboThreshold: 0,
            allowPointSelect: true,
            visible: !excludeMerges,
            color: Colors.Commits.merge
          }
        ],
        legend: {
          enabled: true,
          align: 'right'
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



import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {Colors, Untracked, WorkItemStateTypeColor, WorkItemStateTypes} from "../../config";
import {capitalizeFirstLetter, elide, toMoment, buildIndex} from "../../../../helpers/utility";
import moment from "moment";
import {formatDateTime} from "../../../../i18n";
import {queueTime} from "../../helpers/commitUtils";

const bucketToBubbleSize = [2, 8, 9, 10, 16, 22];

function z_bucket(lines) {
  if (lines != null) {
    if (lines <= 10) {
      return 1;
    } else if (lines <= 50) {
      return 2;
    } else if (lines <= 100) {
      return 3;
    } else if (lines <= 1000) {
      return 4;
    } else {
      return 5;
    }
  } else {
    return 0;
  }
}

function getYAxisCategoryDisplay(model, commits, categories, category) {
  if (category === "workItem") {
    return categories.map((category) => {
      // eslint-disable-next-line
      const [_, __, stateType] = model.mapCategoryToNode(commits, category);
      const strikeThrough = stateType === WorkItemStateTypes.closed ? `text-decoration: line-through;` : "";
      return `<span style="background-color: ${WorkItemStateTypeColor[stateType]}">.</span><span style="margin: 2px;${strikeThrough}">${category}</span>`;
    });
  } else {
    return categories;
  }
}

export const CommitsTimelinePackedBubbleChart = Chart({
  chartUpdateProps: (props) => ({
    model: props.model,
    excludeMerges: props.excludeMerges,
  }),

  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point.commit),

  getConfig: ({
    model,
    context,
    intl,
    view,
    days,
    before,
    latestCommit,
    latest,
    totalCommits,
    excludeMerges,
    shortTooltip,
    markLatest,
    showScrollbar,
    fullScreen,
    onCategoryItemSelected,
  }) => {
    const commits = model.commits;
    const categoryIndex = model.categoriesIndex;
    const category = model.groupBy;

    // sort in descending order of activity
    let categories = Object.keys(categoryIndex).sort((a, b) => categoryIndex[b] - categoryIndex[a]);
    // we want Untracked items to show up at the end regardless of activity count. This is ugly, but gets the job done.
    if (category === "workItem" && categories.indexOf(Untracked) >= 0) {
      categories = [Untracked, ...categories.filter((cat) => cat !== Untracked)];
    }


    const series_data  = categories.map(
      category => ({
        name: category,
        data: []
      })
    );



    for (let i = 0; i < commits.length; i++) {
      const commit = commits[i];

      const commitCategories = model.getCategories(commit);
      for (let j = 0; j < commitCategories.length; j++) {
          const category = commitCategories[j];
          const series = series_data.find( series => series.name === category);
          series.data.push(
            {
              name: commit.workItemsSummaries.length > 0 ? commit.workItemsSummaries[0].displayId : '',
              value: commit.stats.lines,
              color: commit.workItemsSummaries.length > 0 ? '#2cf50b' : '#5a5d5e'
            }
          )
      }
    }

    return {
      chart: {
        type: "packedbubble",
        backgroundColor: Colors.Chart.backgroundColor,

      },
      title: {
        text: "FOO",
        align: view === "detail" ? "center" : "left",
      },
      subtitle: {
        text: "BAR",
        align: view === "detail" ? "center" : "left",
      },

      series: series_data,
      colors: ['#87898b', '#72806f', '#ad968f'],
      legend: {
        enabled: false,
      },
      plotOptions: {
        packedbubble: {
          minSize: 10,
          maxSize: 80,
          layoutAlgorithm: {
            enableSimulation: false,
            splitSeries: true,
            gravitationalConstant: 0.05,
            parentNodeLimit: true,
          },
          dataLabels: {
            enabled: true,
            format: "{point.name}",
            style: {
              color: "black",
              textOutline: "none",
              fontWeight: "normal",
            },
          },
          minPointSize: 5,
        },
      },
    };
  },
});

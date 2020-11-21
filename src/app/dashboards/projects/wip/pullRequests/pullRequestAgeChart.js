import { Chart, tooltipHtml } from "../../../../framework/viz/charts";
import { DefaultSelectionEventHandler } from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import { buildIndex, localNow, pick } from "../../../../helpers/utility";
import { Colors } from "../../../shared/config";

function getDisplayName(pullRequest) {
  const [workItem, ...moreWorkItems] = pullRequest.workItemsSummaries;

  return workItem
    ? `${workItem.displayId}${moreWorkItems.length > 0 ? "..." : ""}`
    : `${pullRequest.repositoryName}#${pullRequest.displayId}`;
}

function getSeries(pullRequests, intl, view) {
  const pullRequestsBySpecsNoSpecs = buildIndex(
    pullRequests,
    (pullRequest) => pullRequest.workItemsSummaries.length > 0?  'Specs' : 'No Specs'
  );
  // one series per type
  return ['Specs', 'No Specs'].map((type) => ({
    key: `${type}`,
    id: `${type}`,
    name: `${type}`,
    type: "column",
    maxPointWidth: 30,
    minPointLength: 1,
    allowPointSelect: true,
    data: (pullRequestsBySpecsNoSpecs[type] || []).map((pullRequest) => ({
      name: `#${pullRequest.displayId}`,
      y: pullRequest.age,
      pullRequest: pullRequest,
      dataLabels: {
        enabled: true,
        formatter: function () {
          return getDisplayName(pullRequest);
        },
      },
    })),
  }));
}

export const PullRequestAgeChart = Chart({
  // Update this function to choose which props will cause the chart config to be regenerated.
  chartUpdateProps: (props) => pick(props, "pullRequests"),

  // Leave this as is unless you want to create a different selection handler than the default one.
  eventHandler: DefaultSelectionEventHandler,

  // when the default selection handler calls its application callback, it calls this
  // mapper to map point objects into domain objects for the application. Attach domain objects to the series data
  // points and map them back here.
  mapPoints: (points, _) => points.map(point => point.pullRequest),

  getConfig: ({ pullRequests,  title, subtitle, intl, view }) => {

    const series = getSeries(pullRequests,intl, view);
    return {
      chart: {
        // some default options we include on all charts, but might want to
        // specialize in some cases.
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",

      },
      title: {
        text: `${pullRequests.length} ${title || "Code Reviews"}`,
        align: "left",
      },
      subtitle: {
        text: subtitle || `${localNow(intl)}`,
        align: "left",
      },
      xAxis: {
        type: "category",
        visible: false,
        title: {
          text: null,
        },
      },
      yAxis: {
        type: "logarithmic",
        allowDecimals: false,
        title: {
          text: "Age in Days",
        },
      },

      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          // This is the standard way we display tool tips.
          // A header string followed by a two column table with name, value pairs.
          // The strings can be HTML.
          const {
            displayId,
            name,
            age,
            repositoryName,
            workItemsSummaries,
          } = this.point.pullRequest;
          return tooltipHtml({
            header: `Code Review: ${repositoryName}#${displayId}<br/> Title: ${name}`,
            body: [
              [
                `Work Item(s): `,
                workItemsSummaries.length > 0
                  ? `${workItemsSummaries
                      .map((workItem) => workItem.displayId)
                      .join()}`
                  : "None",
              ],
              [`Age: `, `${intl.formatNumber(age)} Days`],
            ],
          });
        },
      },
      series: [...series],
      plotOptions: {
        series: {
          animation: false,
        },
      },
      legend: {
        title: {
          text: null,
          style: {
            fontStyle: "italic",
          },
        },

        itemMarginBottom: 3,

        enabled: true,
      },
    };
  },
});

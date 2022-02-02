import {Chart, tooltipHtml} from "../../../../../framework/viz/charts";
import {pick} from "../../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {Colors} from "../../../config";

function getCategories(selectedContributors) {
  return selectedContributors.map((x) => x.contributorName).sort();
}

export const WorkBalancePointDetailChart = Chart({
  chartUpdateProps: (props) => pick(props, "selectedContributors"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),
  getConfig: ({intl, selectedContributors}) => {
    const seriesObj = {
        key: "test",
        id: "test",
        name: "Test",
        data: selectedContributors.map(x => {
            return {
                y: x.totalCommitDays,
            }
        })
    };
    return {
      chart: {
        type: "column",
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: `Work Balance Point Detail`,
      },
      subtitle: {
        text: (function () {
          return ``;
        })(),
      },
      xAxis: {
        title: {
          text: `Contributors`,
        },
        categories: getCategories(selectedContributors),
        crosshair: true,
      },

      yAxis: {
        softMin: 0,
        title: {
          text: `Dev-Days`,
        },
      },
      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          return tooltipHtml({
            header: ` `,
            body: [[``, ``]],
          });
        },
      },
      series: [seriesObj],
      plotOptions: {
        series: {
          animation: false,
        },
      },
      legend: {
        title: {
          text: "",
          style: {
            fontStyle: "italic",
          },
        },
        align: "right",
        layout: "vertical",
        verticalAlign: "middle",
        itemMarginBottom: 3,
        enabled: true,
      },
    };
  },
});

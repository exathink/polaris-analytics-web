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
      name: "Work Balance Detail",
      data: selectedContributors.map((x) => {
        return {
          y: x.totalCommitDays,
          measurement: x,
        };
      }),
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
            header: `Contributor: ${this.point.measurement.contributorName}`,
            body: [
              [
                `Active Days:`,
                `${intl.formatNumber(this.point.y)} ( ${intl.formatNumber(
                  (this.point.y / selectedContributors.reduce((acc, x) => acc + x.totalCommitDays, 0)) * 100,
                  {maximumFractionDigits: 1}
                )}% )`,
              ],
            ],
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

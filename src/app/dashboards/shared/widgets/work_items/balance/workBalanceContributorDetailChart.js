import {Chart, tooltipHtml} from "../../../../../framework/viz/charts";
import {pick} from "../../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {Colors} from "../../../config";
import {formatAsDate} from "../../../../../i18n/utils";

function getCategories(selectedContributors) {
  return selectedContributors.map((x) => x.contributorName).sort();
}

function getSeries(contributors) {
  return [
    {
      key: "test",
      id: "test",
      showInLegend: false,
      name: "Detail",
      data: contributors.map((x) => {
        return {
          y: x.totalCommitDays,
          measurement: x,
          color: x.color
        };
      }),
    },
  ];
}

export const WorkBalanceContributorDetailChart = Chart({
  chartUpdateProps: (props) => pick(props, "selectedContributors"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),
  getConfig: ({intl, selectedContributors, measurementWindow, selectedDate}) => {
    const series = getSeries(selectedContributors);
    return {
      chart: {
        type: "column",
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: `Active Days by Contributor`,
      },
      subtitle: {
        text: (function () {
          return `${measurementWindow} days ending ${formatAsDate(intl, selectedDate)}`;
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
          text: `Days`,
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
      series: series,
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

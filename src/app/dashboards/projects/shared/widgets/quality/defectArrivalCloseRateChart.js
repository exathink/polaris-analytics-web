import {Chart, tooltipHtml} from "../../../../../framework/viz/charts";
import {i18nDate, i18nNumber, toMoment} from "../../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {Colors} from "../../../../shared/config";

function getSeries(flowRateTrends) {
  return [
    {
      key: "arrivalRate",
      name: "Arrival Rate",
      data: flowRateTrends.map((measurement) => ({
        x: toMoment(measurement.measurementDate, true).valueOf(),
        y: measurement.arrivalRate,
        measurement: measurement,
      })).sort(
        (m1, m2) => m1.x - m2.x
      ),
    },
    {
      key: "closeRate",
      name: "Close Rate",
      data: flowRateTrends.map((measurement) => ({
        x: toMoment(measurement.measurementDate, true).valueOf(),
        y: -measurement.closeRate,
        measurement: measurement,
      })).sort(
        (m1, m2) => m1.x - m2.x
      ),
    },
  ];
}

export const DefectArrivalCloseRateChart = Chart({
  chartUpdateProps: (props) => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),
  getConfig: ({flowRateTrends, measurementPeriod, measurementWindow, view, intl}) => {
    const series = getSeries(flowRateTrends);
    return {
      chart: {
        type: "column",
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: "Arrival Rate/Close Rate",
      },
      subtitle: {
        text: `${measurementPeriod} day trend`,
      },
      xAxis: {
        type: "datetime",
        title: {
          text: `${measurementWindow} days ending`,
        },
      },
      yAxis: {
        type: "linear",

        title: {
          text: "Cards",
        },
      },
      legend: {
        title: {
          text: ``,
          style: {
            fontStyle: "italic",
          },
        },
        align: "right",
        layout: "vertical",
        verticalAlign: "middle",
        itemMarginBottom: 3,
      },
      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          return tooltipHtml({
            header: `${measurementWindow} days ending ${i18nDate(intl, this.point.measurement.measurementDate)}`,
            body:
              this.point.series.name === "Arrival Rate"
                ? [["Defects Opened: ", `${i18nNumber(intl, this.point.measurement.arrivalRate)}`]]
                : [["Defects Closed: ", `${i18nNumber(intl, this.point.measurement.closeRate)}`]],
          });
        },
      },
      series: [...series],
      plotOptions: {
        series: {
          animation: false,
        },
      },
    };
  },
});

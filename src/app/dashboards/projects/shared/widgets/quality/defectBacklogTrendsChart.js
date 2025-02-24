import {Chart, tooltipHtml} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick, epoch} from "../../../../../helpers/utility";
import {Colors} from "../../../../shared/config";

export const DefectBacklogTrendsChart = Chart({
  chartUpdateProps: (props) => pick(props, "backlogTrends", "measurementPeriod", "measurementWindow"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points,
  getConfig: ({backlogTrends, measurementWindow, measurementPeriod, intl}) => {
    const boxPlotSeriesName = "Range";

    const series = [
      {
        key: "average_backlog_size",
        id: "average_backlog_size",
        name: `Avg. Backlog`,
        type: "line",
        data: backlogTrends
          .map((measurement) => ({
            x: epoch(measurement["measurementDate"], true),
            y: measurement["avgBacklogSize"],
            measurement: measurement,
          }))
          .sort((m1, m2) => m1.x - m2.x),
      },
      {
        key: "backlog_size_box",
        id: "backlog_size_box",
        name: `${boxPlotSeriesName}`,
        type: "boxplot",
        data: backlogTrends
          .map((measurement) => ({
            x: epoch(measurement["measurementDate"], true),
            low: measurement["minBacklogSize"],
            q1: measurement["q1BacklogSize"],
            median: measurement["medianBacklogSize"],
            q3: measurement["q3BacklogSize"],
            high: measurement["maxBacklogSize"],
            measurement: measurement,
          }))
          .sort((m1, m2) => m1.x - m2.x),
      },
    ];
    return {
      chart: {
        animation: false,
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: "Defect Backlog",
      },
      subtitle: {
        text: `${measurementPeriod} day trend`,
      },
      legend: {
        title: {
          text: `Backlog Size`,
          style: {
            fontStyle: "italic",
          },
        },
        align: "right",
        layout: "vertical",
        verticalAlign: "middle",
        itemMarginBottom: 3,
      },
      xAxis: {
        type: "datetime",
        title: {
          text: `${measurementWindow} days ending`,
        },
      },
      yAxis: {
        type: "linear",
        id: "cycle-metric",
        title: {
          text: `Defects`,
        },
      },
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 0,
        formatter: function () {
          return tooltipHtml(
            this.point.series.name === boxPlotSeriesName
              ? {
                  header: `${this.point.series.name}: ${measurementWindow} days ending ${intl.formatDate(
                    this.point.x
                  )}`,
                  body: [
                    ["Maximum:  ", `${intl.formatNumber(this.point.measurement.maxBacklogSize)} defects`],
                    ["Upper Quartile: ", `${intl.formatNumber(this.point.measurement.q3BacklogSize)} defects`],
                    ["Median : ", `${intl.formatNumber(this.point.measurement.medianBacklogSize)} defects`],
                    ["Lower Quartile: ", `${intl.formatNumber(this.point.measurement.q1BacklogSize)} defects`],
                    ["Minimum: ", `${intl.formatNumber(this.point.measurement.minBacklogSize)} defects`],
                  ],
                }
              : {
                  header: `${this.point.series.name}: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
                  body: [[`Defects: `, `${intl.formatNumber(this.point.measurement.avgBacklogSize)}`]],
                }
          );
        },
      },
      series: series,
      plotOptions: {
        series: {
          animation: false,
        },
      },
      time: {
        // Since we are already passing in UTC times we
        // dont need the chart to translate the time to UTC
        // This makes sure the tooltips text matches the timeline
        // on the axis.
        useUTC: false,
      },
    };
  },
});

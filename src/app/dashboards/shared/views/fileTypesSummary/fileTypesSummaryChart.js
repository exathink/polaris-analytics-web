import {Chart} from "../../../../framework/viz/charts";
import {Colors} from "../../config";

export const FileTypesSummaryChart = Chart({
  chartUpdateProps:
    (props) => ({
      fileTypesSummary: props.fileTypesSummary
    }),
  getConfig:
    ({fileTypesSummary, view}) => {
      const series = fileTypesSummary.map(
        fileType => ({
          name: fileType.fileType || "None",
          data: [fileType.count]
      }));

      return {
        chart: {
          type: 'bar',
          backgroundColor: Colors.Chart.backgroundColor
        },
        plotOptions:{
          series: {
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                align: 'center',
                formatter: function() {
                  return `<b>${this.series.name}</b>`
                },
              }
          }
        },
        title: {
          text: null
        },
        xAxis: {
          categories: [''],
          visible: false,
          allowDecimals: false
        },
        yAxis: {
          title: {
            text: null
          },
          visible: true
        },
        series: series,
        legend: {
          enabled: false
        }
      }
    }
});
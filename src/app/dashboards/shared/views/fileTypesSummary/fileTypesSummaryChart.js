import {Chart} from "../../../../framework/viz/charts";
import {Colors} from "../../config";

export const FileTypesSummaryChart = Chart({
  chartUpdateProps:
    (props) => ({
      fileTypesSummary: props.fileTypesSummary
    }),
  getConfig:
    ({fileTypesSummary, fileCount, view}) => {
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
          bar: {
            pointPadding: 0.01,
            groupPadding: 0.01
          },
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
          plotLines: fileCount ?
            [{
              value: fileCount,
              width: 2,
              color: Colors.Chart.backgroundColor,
              dashStyle: 'ShortDot',
              label: {
                text: `      ${fileCount}`,
                align: 'center',
                textAlign: 'center',
                verticalAlign: 'center',
                rotation: 0,
                x: 10,
              },
              zIndex: 100

            }]
            : [],
          allowDecimals:false,
          visible: true
        },
        series: series,
        legend: {
          enabled: false
        }
      }
    }
});
import {Chart} from "../../../framework/viz/charts";
import {Colors} from "../../shared/config";

export const CommitLinesSummaryChart = Chart({
  chartUpdateProps:
    (props) => ({
      commit: props.commit
    }),
  getConfig:
    ({commit, showY, showLabels, maxPointWidth, showTotal, view}) => {
      const series = [
        {
          id: '++',
          key: 'adds',
          name: 'Lines added',
          data: [commit.stats.insertions],
          color: "#28ff17",
        },
        {
          id: '--',
          key: 'deletes',
          name: 'Lines deleted',
          data: [commit.stats.deletions],
          color: "#ff5b0c"
        }

      ];

      return {
        chart: {
          type: 'bar',
          backgroundColor: Colors.Chart.backgroundColor
        },
        plotOptions: {
          bar: {
            pointPadding: 0.01,
            groupPadding: 0.01
          },
          series: {
            stacking: 'normal',
            dataLabels: {
              enabled: (showLabels != null ? showLabels : true),
              align: 'center',
              verticalAlign: 'middle',
              formatter: function () {
                const x = 3;
                return `<b>${this.series.userOptions.id}</b>`
              },
              color: "#000000"
            },
            maxPointWidth: maxPointWidth
          },
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
          visible: (showY != null ? showY : true),
          gridLineWidth: 0,
          plotLines: showTotal ?
            [{
              value: commit.stats.lines,
              width: 2,
              color: Colors.Chart.backgroundColor,
              dashStyle: 'ShortDot',
              label: {
                text: `      ${commit.stats.lines}`,
                align: 'center',
                textAlign: 'center',
                verticalAlign: 'center',
                rotation: 0,
                x: 10,
              },
              zIndex: 100

            }]
            : []
        },
        series: series,
        legend: {
          enabled: false
        }
      }
    }
});
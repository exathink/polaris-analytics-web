import {Chart} from "../../../../framework/viz/charts";
import {Colors} from "../../config";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {capitalizeFirstLetter} from "../../../../helpers/utility";

export const CommitsTimelineRollupBarChart = Chart({
  chartUpdateProps:
    (props) => ({
      commits: props.model.commits,
      groupBy: props.model.groupBy
    }),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: points => points.map( point => point.name),
  getConfig:
    ({model, suppressDataLabelsThreshold}) => {
      const {categoriesIndex, groupBy} = model

      const series = Object.keys(categoriesIndex).map(
        category => ({
          id: category,
          name: category,
          data: [{
            name: category,
            y: categoriesIndex[category]
          }],
          allowPointSelect: true,
        })
      ).sort((series_a, series_b) => series_b.data[0].y - series_a.data[0].y);
      return {
        chart: {
          type: 'column',
          backgroundColor: Colors.Chart.backgroundColor,
        },
        plotOptions:{
          bar: {
            pointPadding: 0.01,
            groupPadding: 0.01
          },
          series: {
            stacking: 'normal',
            dataLabels: {
                enabled: suppressDataLabelsThreshold && series.length <= suppressDataLabelsThreshold,
                rotation: 90,
                align: 'left',
                verticalAlign: 'middle',
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
          categories: [groupBy !== 'workItem' ? capitalizeFirstLetter(groupBy) : 'Dev-Item'],
          visible: true,
          allowDecimals: false
        },
        yAxis: {
          title: {
            text: null
          },
          allowDecimals:false,
          opposite: true,
          visible: true
        },
        series: series,
        legend: {
          enabled: false
        },
        tooltip: {
          hideDelay: 50,
          formatter: function() {
            return this.series.name
          }
        },
      }
    }
});
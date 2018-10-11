import {Chart} from "../../../../framework/viz/charts";
import {Colors} from "../../config";
import {getCategoriesIndex} from "./utils";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

export const CommitsTimelineRollupHeaderChart = Chart({
  chartUpdateProps:
    (props) => ({
      commits: props.commits
    }),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: points => points.map( point => point.name),
  getConfig:
    ({commits, groupBy, categoryIndex}) => {
      const {category, categories_index} = categoryIndex || getCategoriesIndex(commits, groupBy);

      const series = Object.keys(categories_index).map(
        category => ({
          id: category,
          name: category,
          data: [{
            name: category,
            y: categories_index[category]
          }],
          allowPointSelect: true,
        })
      ).sort((series_a, series_b) => series_a.data[0].y - series_b.data[0].y);
      return {
        chart: {
          type: 'bar',
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
                enabled: true,
                align: 'center',
                verticalAlign: 'top',
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
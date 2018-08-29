import {Chart} from "../../../../framework/viz/charts";

function initSeries(inceptionsSummary, groupBy = 'year') {
  const inceptions = inceptionsSummary.reduce(
    (inceptions, inception) => {
      inceptions[inception.year] = (inceptions[inception.year] || 0) + inception.inceptions;
      return inceptions;
    },
    {}
  );
  return Object.keys(inceptions).map(
    inceptionKey => ({
      x: parseInt(inceptionKey),
      y: inceptions[inceptionKey]
    })
  )
}

export const InceptionsBarChart = Chart({
  chartUpdateProps:
    (props) => ({
      inceptionsSummary: props.inceptionsSummary,
      groupBy: props.groupBy
    }),
  getConfig:
    ({inceptionsSummary, groupBy}) => {
      const series_data = initSeries(inceptionsSummary);

      return {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Inceptions Summary'
        },
        xAxis: {
          type: 'linear',
          title: {
            text: 'Year'
          }
        },
        yAxis: {
          type: 'linear',
          title: {
            text: 'Inceptions'
          }
        },
        series: [{
          key: 'inceptions',
          id: 'inceptions',
          name: 'Inceptions',
          data: series_data
        }]
      }
    }
});
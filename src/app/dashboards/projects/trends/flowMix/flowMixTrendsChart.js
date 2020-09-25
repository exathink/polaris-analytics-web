import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {percentileToText, pick, toMoment, capitalizeFirstLetter} from "../../../../helpers/utility";
import {Colors} from "../../../shared/config";

export const FlowMixTrendsChart = Chart({
  chartUpdateProps: props => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points,

  getConfig: ({flowMixTrends, measurementWindow, measurementPeriod, specsOnly, intl}) => {

    // we build one series per flow type (category)
    //
    const seriesData = {
      feature: [],
      defect: [],
      task: []
    }
    flowMixTrends.forEach(
      measurement => {
        measurement.flowMix.forEach(
          flowMixItem => {
            const category = flowMixItem['category'];
            seriesData[category].push(
              {
                x: toMoment(measurement['measurementDate'], true).valueOf(),
                y: flowMixItem[specsOnly ? 'totalEffort' : 'workItemCount'],
                measurement: measurement,
                flowMixItem: flowMixItem
              }
            )
          }
        )
      }
    )

    const series = Object.keys(seriesData).map(
      category => (
        {
          key: category,
          id: category,
          name: `${capitalizeFirstLetter(category)}`,
          type: 'column',
          stacking: 'percent',
          maxPointWidth: 30,
          minPointLength: 1,
          color: Colors.FlowType[category],
          data: seriesData[category],
          total: seriesData[category].map(point=>point.y).reduce((a,b)=>a+b,0)
        }
      )
    )

    const metricDisplay = specsOnly? 'Effort' : 'Items';

    return {
      chart: {
        animation: false,
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy'
      },
      title: {
        text: `${specsOnly ? 'Spec':  ''} Flow Mix`
      },
      subtitle: {
        text: `% of ${metricDisplay}: ${measurementPeriod} day trend`
      },
      legend: {
        title: {
          text: `${specsOnly? 'Specs' : 'All Items'}`,
          style: {
            fontStyle: 'italic'
          }
        },
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle',
        itemMarginBottom: 3,
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: `${measurementWindow} days ending`
        }
      },
      yAxis: {
        type: 'linear',
        id: 'flow-mix',
        title: {
          text: `${specsOnly ? '% Effort' : '% Items'}`
        },
      },
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 0,
        formatter: function () {
          const flowType = this.point.series.name;
          const metric = specsOnly? 'totalEffort' : 'workItemCount';
          const value = this.point.flowMixItem[metric];

          const uom = specsOnly ? 'Dev-Days' : 'Items';
          return tooltipHtml({
              header: `Flow Type: ${flowType} <br/>Closed: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                [`Percentage: `, `${intl.formatNumber(this.point.percentage)}%`],
                [`${flowType}s: `, `${intl.formatNumber(value)} ${uom}`],
                [`Total: `, `${intl.formatNumber(this.point.total)} ${uom}`],

              ]
            })
        }
      },
      series: series,
      plotOptions: {
        series: {
          animation: false,

        }
      },
      time: {
        // Since we are already passing in UTC times we
        // dont need the chart to translate the time to UTC
        // This makes sure the tooltips text matches the timeline
        // on the axis.
        useUTC: false
      }
    }

  }
})
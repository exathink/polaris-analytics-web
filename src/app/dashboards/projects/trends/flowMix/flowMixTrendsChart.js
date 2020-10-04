import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {capitalizeFirstLetter, toMoment} from "../../../../helpers/utility";
import {Colors} from "../../../shared/config";

export const FlowMixTrendsChart = Chart({
  chartUpdateProps: props => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points,

  getConfig: ({flowMixTrends, measurementWindow, measurementPeriod, specsOnly, showCounts, intl}) => {

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

    const flow_mix_series = Object.keys(seriesData).map(
      category => (
        {
          key: `${category}%`,
          id: `${category}%`,
          name: `${capitalizeFirstLetter(category)}`,
          type: 'column',
          stacking: 'percent',
          maxPointWidth: 30,
          minPointLength: 1,
          dataLabels: {
            enabled: showCounts,
            formatter: function () {
              return `${intl.formatNumber(this.point.percentage, {maximumFractionDigits: 0})}%`
            }
          },
          color: Colors.FlowType[category],
          showInLegend: !showCounts,
          data: seriesData[category],
        }
      )
    )

    const work_item_count_series = showCounts ?
      Object.keys(seriesData).map(
        category => (
          {
            key: `${category}#`,
            id: `${category}#`,
            name: `${capitalizeFirstLetter(category)}`,
            type: 'spline',
            color: Colors.FlowType[category],
            data: seriesData[category].map(
              point => ({
                x: point.x,
                y: point.flowMixItem.workItemCount,
                measurement: point.measurement,
                flowMixItem: point.flowMixItem
              })
            ),
            yAxis: 1,

          }
        )
      ) :
      [];
    const series = [...work_item_count_series, ...flow_mix_series];

    const metricDisplay = specsOnly ? 'Effort' : 'Items';

    return {
      chart: {
        animation: false,
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy'
      },
      title: {
        text: `${specsOnly ? 'Spec' : ''} Flow Mix`
      },
      subtitle: {
        text: showCounts ? `% of ${metricDisplay} vs Throughput: ${measurementPeriod} day trend` : `% of ${metricDisplay}: ${measurementPeriod} day trend`
      },
      legend: {
        title: {
          text: `${showCounts ? (specsOnly ? 'Spec Throughput' : 'Overall Throughput') : (specsOnly ? 'Spec Flow Types' : 'Flow Types')}`,
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
      yAxis: [
        {
          id: 'flow-mix-percentage',
          type: 'linear',
          title: {
            text: `${specsOnly ? '% Effort' : '% Items'}`
          }
        },
        // secondary y axis for work item count, show only if showCounts is enabled.
        ...showCounts ?
          [
            {
              id: 'work-item-count',
              type: 'linear',
              title: {
                text: `Throughput`
              },
              opposite: true
            }
          ] : [],

      ],
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 0,
        formatter: function () {
          const flowType = this.point.series.name;
          const metric = specsOnly ? 'totalEffort' : 'workItemCount';
          const metricDisplay = specsOnly? 'Effort' : 'Throughput';
          const value = this.point.flowMixItem[metric];

          const uom = specsOnly ? 'Dev-Days' : 'Items';
          return tooltipHtml( this.point.series.type === 'column' ? {
            header: `Closed: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}<br/>Flow Type: ${flowType}s`,
            body: [
              [`Percentage: `, `${intl.formatNumber(this.point.percentage, {maximumFractionDigits: 1})}%`],
              [`${metricDisplay}: `, `${intl.formatNumber(value)} ${uom}`],
              [`Total: `, `${intl.formatNumber(this.point.total)} ${uom}`],

            ]
          } : {
            header: `Closed: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}<br/>Flow Type: ${flowType}s`,
            body: [
              [`Throughput: `, `${intl.formatNumber(this.point.y)}`],
            ]
          })
        }
      }
      ,
      series: series,
      plotOptions: {
        series: {
          animation: false,

        }
      }
      ,
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
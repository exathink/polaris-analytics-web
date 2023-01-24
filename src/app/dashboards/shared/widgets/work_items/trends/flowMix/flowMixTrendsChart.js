import {Chart, tooltipHtml} from "../../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import { i18nNumber, pick, toMoment, sum_field } from "../../../../../../helpers/utility";
import { Colors, FlowTypeDisplayName } from "../../../../config";

function getFlowMixEffortPercentage(flowMix, category) {
  return flowMix.find(flowMixItem => flowMixItem.category === category)?.totalEffort/sum_field(flowMix, 'totalEffort', 0) * 100
}

export const FlowMixTrendsChart = Chart({
  chartUpdateProps: props => pick(props, "flowMixTrends", "measurementWindow", "measurementPeriod", "specsOnly", "showCounts"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points,

  getConfig: ({title, subTitle, flowMixTrends, measurementWindow, measurementPeriod, specsOnly, showCounts, chartOptions={}, intl, onPointClick}) => {

    const {alignTitle} = chartOptions;

    // we build one series per flow type (category)
    //
    const seriesData = {
      feature: [],
      defect: [],
      task: []
    }
    flowMixTrends.forEach(
      (measurement, index) => {
        measurement.flowMix.forEach(
          flowMixItem => {
            const category = flowMixItem['category'];
            seriesData[category].push(
              {
                id: `${category}%${index}`,
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
          name: `${FlowTypeDisplayName[category]}`,
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
            name: `${FlowTypeDisplayName[category]}`,
            type: 'spline',
            color: Colors.FlowType[category],
            data: seriesData[category].map(
              (point, index) => ({
                id: `${category}#${index}`,
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

    const metricDisplay = specsOnly ? 'Capacity' : 'Volume';

    return {
      chart: {
        animation: false,
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy',
        marginRight: 90
      },
      title: {
        text: title || `${specsOnly ? 'Costs' : 'Allocations'}`,
        align: alignTitle || 'center',
      },
      subtitle: {
        text: specsOnly ? '%Capacity, %Volume' : '%Volume',
        align: alignTitle || 'center',
      },
      legend: {
        title: {
          text: ``,
          style: {
            fontStyle: 'italic'
          }
        },

        itemMarginBottom: 3,
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: ` `
        },

      },
      yAxis: [
        {
          id: 'flow-mix-percentage',
          type: 'linear',
          lineWidth: 0,
          minorGridLineWidth: 0,
          lineColor: 'transparent',
          title: {
            text: `${specsOnly ? '% Capacity' : '% Volume'}`
          }
        },
        // secondary y axis for work item count, show only if showCounts is enabled.
        ...showCounts ?
          [
            {
              id: 'work-item-count',
              type: 'linear',
              lineWidth: 0,
              minorGridLineWidth: 0,
              lineColor: 'transparent',
              title: {
                text: `Volume`
              },
              opposite: true
            }
          ] : [],

      ],
      annotations: [{
        labels: [{
          point: "defect%0",
          text:
            `Defect Fixing: ${i18nNumber(intl, getFlowMixEffortPercentage(flowMixTrends[0]?.flowMix, 'defect'), 1)} %`,
          backgroundColor: Colors.FlowType['defect'],
          borderColor: Colors.FlowType['defect'],
          style: {
                color: '#ffffff',
          },
          align: "center",
          distance: 9
        },{
          point: "feature%0",
          text:
            `New Development: ${i18nNumber(intl, getFlowMixEffortPercentage(flowMixTrends[0]?.flowMix, 'feature'), 1)} %`,
          backgroundColor: Colors.FlowType['feature'],
          borderColor: Colors.FlowType['feature'],
          style: {
                color: 'rgba(24,12,12,0.5)',
          },
          align: "right",
          distance: 9
        },{
          point: "task%0",
          text:
            `Platform: ${i18nNumber(intl, getFlowMixEffortPercentage(flowMixTrends[0]?.flowMix, 'task'), 1)} %`,
          backgroundColor: Colors.FlowType['task'],
          borderColor: Colors.FlowType['task'],
          style: {
                color: '#ffffff',
          },
          align: "center",
          distance: 9
        },]
      }],
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 0,
        formatter: function () {
          const flowType = this.point.series.name;
          const metric = specsOnly ? 'totalEffort' : 'workItemCount';
          const metricDisplay = specsOnly ? 'Effort' : 'Volume';
          const value = this.point.flowMixItem[metric];

          const uom = specsOnly ? 'FTE Days' : 'Cards';
          return tooltipHtml(this.point.series.type === 'column' ? {
            header: `Closed: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}<br/>Value Type: ${flowType}`,
            body: [
              [`Percentage: `, `${intl.formatNumber(this.point.percentage, {maximumFractionDigits: 1})}%`],
              [`${metricDisplay}: `, `${intl.formatNumber(value)} ${uom}`],
              [`Total: `, `${intl.formatNumber(this.point.total)} ${uom}`],

            ]
          } : {
            header: `Closed: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}<br/>Value Type: ${flowType}`,
            body: [
              [`Volume: `, `${intl.formatNumber(this.point.y)}`],
            ]
          })
        }
      }
      ,
      series: series,
      plotOptions: {
        series: {
          animation: false,
          allowPointSelect: true,
          cursor: "pointer",
          states: {
            select: {
              color: null,
              opacity: 0.5
            },
          },
          point: {
            events: {
              click: function () {
                const {flowMixItem, measurement: {measurementDate}} = this;

                onPointClick({item: flowMixItem, measurementDate});
              },
            },
          },
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
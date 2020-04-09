import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {percentileToText} from "../../../../helpers/utility";

import {capitalizeFirstLetter, pick, toMoment} from "../../../../helpers/utility";
import {Colors} from "../../../shared/config";

export const FlowMetricsScatterPlotChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'model', 'selectedMetric')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({model, days, selectedMetric, metricsMeta, projectCycleMetrics, intl}) => {
    const deliveryCyclesByWorkItemType = model.reduce(
      (groups, cycle) => {
        if (groups[cycle.workItemType] != null) {
          groups[cycle.workItemType].push(cycle);
        } else {
          groups[cycle.workItemType] = [cycle]
        }
        return groups;
      },
      {}
    )
    const series = Object.entries(deliveryCyclesByWorkItemType).map(
      ([workItemType, cycles]) => (
        {
          key: workItemType,
          id: workItemType,
          name: workItemType,

          data: cycles.map(
            cycle => ({
              x: toMoment(cycle.endDate).valueOf(),
              y: cycle[selectedMetric],
              z: 1,
              cycle: cycle
            })
          ),
          turboThreshold: 0,
          allowPointSelect: true,
        }
      )
    )
    return {
      chart: {
        type: 'scatter',
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy'
      },
      title: {
        text: metricsMeta[selectedMetric].display
      },
      subtitle: {
        text: `Work items closed in the last ${days} days`
      },
      legend: {
        title: {
          text: "Type",
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
          text: `Date Closed`
        }
      },
      yAxis: {
        type: 'logarithmic',
        id: 'cycle-metric',
        title: {
          text: `Days`
        },
        max: Math.ceil(projectCycleMetrics.maxLeadTime) + 1,
        plotLines: [{
          color: 'red',
          value: projectCycleMetrics.percentileLeadTime,
          dashStyle: 'longdashdot',
          width: 1,
          label: {
            text: `${percentileToText(projectCycleMetrics.targetPercentile)} Lead Time=${intl.formatNumber(projectCycleMetrics.percentileLeadTime)} days`,
            align: `left`
          }
        }],

      },
      series: series,
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 50,
        formatter: function () {
          return tooltipHtml({
            header: `${capitalizeFirstLetter(this.point.cycle.workItemType)}: ${this.point.cycle.name} (${this.point.cycle.displayId})`,
            body: [
              ['Closed Date: ', `${intl.formatDate(this.point.cycle.endDate)}`],
              ['Lead Time: ', `${intl.formatNumber(this.point.cycle.leadTime)}`],
              ['Cycle Time: ', `${intl.formatNumber(this.point.cycle.cycleTime) || 'N/A'}`],
            ]
          })
        }

      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: `{point.name}`,
            inside: true,
            verticalAlign: 'center',
            style: {
              color: 'black',
              textOutline: 'none'
            }

          }
        }

      }
    }

  }
});








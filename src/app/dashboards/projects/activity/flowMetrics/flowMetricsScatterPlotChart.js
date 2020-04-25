import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {percentileToText, pick, toMoment} from "../../../../helpers/utility";
import {
  Colors,
  Symbols,
  WorkItemColorMap,
  WorkItemSymbolMap,
  WorkItemTypeDisplayName,
  WorkItemTypeScatterRadius,
  WorkItemTypeSortOrder
} from "../../../shared/config";

import {cycleMetricsReferencePlotlines} from "../shared/chartParts";

function mapColor(workItem) {
  if (!workItem.isBug) {
    return WorkItemColorMap[workItem.workItemType]
  } else {
    return Colors.WorkItemType.bug
  }
}

function mapSymbol(workItem) {
  if (!workItem.isBug) {
    return WorkItemSymbolMap[workItem.workItemType]
  } else {
    return Symbols.WorkItemType.bug
  }
}
export const FlowMetricsScatterPlotChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'model', 'selectedMetric')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({model, days, selectedMetric, metricsMeta, projectCycleMetrics, defectsOnly, intl}) => {
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
    const series = Object.entries(deliveryCyclesByWorkItemType).sort(
      (entryA, entryB) => WorkItemTypeSortOrder[entryA[0]] - WorkItemTypeSortOrder[entryB[0]]
    ).map(
      ([workItemType, cycles]) => (
        {
          key: workItemType,
          id: workItemType,
          name: WorkItemTypeDisplayName[workItemType],
          color: mapColor(cycles[0]),
          marker: {
            symbol: mapSymbol(cycles[0]),
            radius: WorkItemTypeScatterRadius[workItemType],
          },
          data: cycles.map(
            cycle => ({
              x: toMoment(cycle.endDate).valueOf(),
              y: metricsMeta[selectedMetric].value(cycle),
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
        animation: false,
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy'
      },
      title: {
        text: metricsMeta[selectedMetric].display
      },
      subtitle: {
        text: defectsOnly ? `Defects closed in the last ${days} days`:  `Work items closed in the last ${days} days`
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
        plotLines: cycleMetricsReferencePlotlines(projectCycleMetrics, intl),
      },
      series: series,
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 50,
        formatter: function () {
          const cycleTime = metricsMeta['cycleTime'].value(this.point.cycle);
          const backlogTime = metricsMeta['backlogTime'].value(this.point.cycle);
          return tooltipHtml({
            header: `${WorkItemTypeDisplayName[this.point.cycle.workItemType]}: ${this.point.cycle.name} (${this.point.cycle.displayId})`,
            body: [
              ['Closed Date: ', `${intl.formatDate(this.point.cycle.endDate)}`],
              [`------`, ``],
              ['Lead Time: ', `${intl.formatNumber(this.point.cycle.leadTime)} days`],
              ['Cycle Time: ', cycleTime > 0 ? `${intl.formatNumber(cycleTime)} days` : 'N/A'],
              ['Backlog Time: ', backlogTime > 0 ? `${intl.formatNumber(backlogTime)} days` : 'N/A']
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








import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick, toMoment} from "../../../../helpers/utility";
import {
  Colors,
  Symbols,
  WorkItemColorMap,
  WorkItemSymbolMap,
  WorkItemTypeDisplayName,
  WorkItemTypeScatterRadius,
  WorkItemTypeSortOrder
} from "../../../shared/config";

import {PlotLines} from "../shared/chartParts";
import {formatDateTime} from "../../../../i18n";

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


function getMaxDays(deliveryCycles, projectCycleMetrics) {
  return deliveryCycles.reduce(
    (max, workItem) => workItem.leadTime > max ?
      workItem.leadTime
      :
      max,
    projectCycleMetrics.maxLeadTime || 0
  )
}

export const FlowMetricsScatterPlotChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'model', 'selectedMetric', 'showEpicsAndSubTasks', 'yAxisScale')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point.cycle),

  getConfig: ({model, days, selectedMetric, metricsMeta, projectCycleMetrics, defectsOnly, showEpicsAndSubTasks, yAxisScale, intl}) => {
    const candidateCycles = showEpicsAndSubTasks != null && !showEpicsAndSubTasks ?
      model.filter(cycle => cycle.workItemType !== 'epic' && cycle.workItemType !== 'subtask')
      :model;

    const deliveryCyclesByWorkItemType = candidateCycles.reduce(
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
        text: function() {
          const subTitle = defectsOnly ?
            `${candidateCycles.length} Defects closed in the last ${days} days`
            : ` ${candidateCycles.length} Work items closed in the last ${days} days`
          // When showing cycle time we also report total with no cycle time if they exist.
          return selectedMetric === 'cycleTime'&& projectCycleMetrics.workItemsWithNullCycleTime > 0
            ? `${subTitle} (${projectCycleMetrics.workItemsWithNullCycleTime} with no cycle time)`
            : subTitle;
        }(),
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
        type: yAxisScale,
        id: 'cycle-metric',
        title: {
          text: `Days`
        },
        max: getMaxDays(candidateCycles, projectCycleMetrics),
        plotLines: selectedMetric === 'cycleTime' ? [
          PlotLines.maxCycleTime(projectCycleMetrics, intl),
          PlotLines.percentileCycleTime(projectCycleMetrics, intl, 'right'),
          PlotLines.percentileLeadTime(projectCycleMetrics, intl, 'right'),
          PlotLines.maxLeadTime(projectCycleMetrics, intl),
        ] :  [
          PlotLines.maxLeadTime(projectCycleMetrics, intl),
          PlotLines.percentileLeadTime(projectCycleMetrics, intl, 'right')
        ],
      },
      series: series,
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 0,
        formatter: function () {
          const cycleTime = metricsMeta['cycleTime'].value(this.point.cycle);
          const backlogTime = metricsMeta['backlogTime'].value(this.point.cycle);
          return tooltipHtml({
            header: `${WorkItemTypeDisplayName[this.point.cycle.workItemType]}: ${this.point.cycle.name} (${this.point.cycle.displayId})`,
            body: [
              ['Closed: ', `${formatDateTime(intl, this.point.x)}`],
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
          animation: false,
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
});








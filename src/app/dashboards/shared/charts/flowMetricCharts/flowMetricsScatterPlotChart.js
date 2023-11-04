import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {getMinMaxDatesFromRange, getWeekendPlotBands, percentileToText, pick, toMoment} from "../../../../helpers/utility";
import {
  AppTerms,
  Colors,
  Symbols,
  WorkItemColorMap,
  WorkItemSymbolMap,
  WorkItemTypeDisplayName,
  WorkItemTypeScatterRadius,
  WorkItemTypeSortOrder,
} from "../../config";
import {getTimePeriod} from "../../../projects/shared/helper/utils";
import {PlotLines} from "../workItemCharts/chartParts";
import {formatDateTime} from "../../../../i18n";
const METRICS = ["leadTime", "backlogTime", "cycleTime", "latency", "duration", "effort", "authors"];

function mapColor(workItem) {
  if (!workItem.isBug) {
    return WorkItemColorMap[workItem.workItemType];
  } else {
    return Colors.WorkItemType.bug;
  }
}

function mapSymbol(workItem) {
  if (!workItem.isBug) {
    return WorkItemSymbolMap[workItem.workItemType];
  } else {
    return Symbols.WorkItemType.bug;
  }
}

function getMaxDays(deliveryCycles, metricTarget) {
  // This function is used to normalize the y-axis across metrics so that
  // it does not change drastically based on the values that are being displayed.
  // For this purpose, we are using the larger of the max *lead time* and the metrics target
  // as heuristic, because the max lead time is guaranteed to be larger than all the other values
  // of the metrics, and we want to make sure that that y-axis is large enough to display either this
  // value or the metricTarget value whichever is larger. So this function should not be
  // taking into account what the selectedMetric is.
  return deliveryCycles.reduce(
    (max, cycle) => ((cycle.leadTime|| 0) > max ? cycle.leadTime : max),
    metricTarget || 0
  );
}

function getTargetPlotLine(selectedMetric, metricsMeta, metricTarget, targetConfidence, intl) {
  const targetMetric = metricsMeta[selectedMetric].targetMetric;
  if (metricTarget != null && targetMetric != null && PlotLines[targetMetric] != null) {
    return [PlotLines[targetMetric](metricTarget, targetConfidence, intl)];
  } else {
    return [];
  }
}

function getTargetActualPlotLine(candidateCycles, selectedMetric, targetConfidence, metricsMeta, intl) {
  const selectedMetricDisplay = metricsMeta[selectedMetric].display;
  const metricValue = metricsMeta[selectedMetric].value
  const sorted = candidateCycles.filter(
    cycle => metricValue(cycle) != null
  ).sort(
    (cycleA, cycleB) => metricValue(cycleA) - metricValue(cycleB)
  );

  if (sorted.length > 0 && targetConfidence != null) {
    let actualPosition = (sorted.length - 1) * targetConfidence;
    if (actualPosition % 1 > 0) {
      actualPosition = Math.min(Math.ceil(actualPosition), sorted.length - 1);
    }
    const actual = metricValue(sorted[actualPosition]);

    return [
      {
        color: "green",
        value: actual,
        dashStyle: "longdashdot",
        width: 1,
        label: {
          text: `${percentileToText(targetConfidence)} ${selectedMetricDisplay} Actual=${intl.formatNumber(actual)} days`,
          align: "right",
          verticalAlign: "middle",
        },
      },
    ];
  } else {
    return [];
  }
}

export const FlowMetricsScatterPlotChart = Chart({
  chartUpdateProps: (props) =>
    pick(
      props,
      "model",
      "selectedMetric",
      "showEpics",
      "yAxisScale",
      "specsOnly",
      "targetConfidence",
      "metricTarget"
    ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point.cycle),

  getConfig: ({
    model,
    days,
    before,
    selectedMetric,
    metricsMeta,
    metricTarget,
    targetConfidence,
    defectsOnly,
    specsOnly,
    showEpics,
    yAxisScale,
    intl,
  }) => {
    const candidateCycles =
      showEpics != null && !showEpics ? model.filter((cycle) => cycle.workItemType !== "epic") : model;

    const workItemsWithNullCycleTime = candidateCycles.filter((x) => !Boolean(x.cycleTime)).length;

    const deliveryCyclesByWorkItemType = candidateCycles.reduce((groups, cycle) => {
      if (groups[cycle.workItemType] != null) {
        groups[cycle.workItemType].push(cycle);
      } else {
        groups[cycle.workItemType] = [cycle];
      }
      return groups;
    }, {});

    const [startDate, endDate] = getMinMaxDatesFromRange(candidateCycles.map(x => toMoment(x.endDate)));

    const series = Object.entries(deliveryCyclesByWorkItemType)
      .sort((entryA, entryB) => WorkItemTypeSortOrder[entryA[0]] - WorkItemTypeSortOrder[entryB[0]])
      .map(([workItemType, cycles]) => ({
        key: workItemType,
        id: workItemType,
        name: WorkItemTypeDisplayName[workItemType],
        color: mapColor(cycles[0]),
        marker: {
          symbol: mapSymbol(cycles[0]),
          radius: WorkItemTypeScatterRadius[workItemType],
        },
        data: cycles.map((cycle) => ({
          x: toMoment(cycle.endDate).valueOf(),
          y: metricsMeta[selectedMetric].value(cycle),
          z: 1,
          cycle: cycle,
        })),
        turboThreshold: 0,
        allowPointSelect: true,
        cursor: 'pointer'
      }));
    return {
      chart: {
        type: "scatter",
        animation: false,
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: `${metricsMeta[selectedMetric].display} Scatter Plot`,
      },
      subtitle: {
        text: (function () {
          const subTitle = defectsOnly
            ? `${candidateCycles.length} Defects closed: ${getTimePeriod(days, before)}`
            : ` ${candidateCycles.length} ${specsOnly ? AppTerms.specs.display : AppTerms.cards.display} closed: ${getTimePeriod(days, before)}`;
          // When showing cycle time we also report total with no cycle time if they exist.
          return selectedMetric === "cycleTime" && workItemsWithNullCycleTime > 0
            ? `${subTitle} (${workItemsWithNullCycleTime} with no cycle time)`
            : subTitle;
        })(),
      },
      legend: {
        title: {
          text: "Type",
          style: {
            fontStyle: "italic",
          },
        },
        align: "right",
        layout: "vertical",
        verticalAlign: "middle",
        itemMarginBottom: 3,
      },
      xAxis: {
        type: "datetime",
        title: {
          text: `Date Closed`,
        },
        plotBands: [
        ...getWeekendPlotBands(startDate, endDate)
        ]
      },
      yAxis: {
        type: yAxisScale,
        id: "cycle-metric",
        title: {
          text: metricsMeta[selectedMetric].uom,
        },
        max: getMaxDays(candidateCycles, metricTarget),
        softMin: 0,
        plotLines: [
          ...getTargetPlotLine(selectedMetric, metricsMeta, metricTarget, targetConfidence, intl),
          ...getTargetActualPlotLine(candidateCycles, selectedMetric, targetConfidence, metricsMeta, intl),
        ],
      },
      series: series,
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 0,
        formatter: function () {
          const leadTime = metricsMeta["leadTime"].value(this.point.cycle);
          const cycleTime = metricsMeta["cycleTime"].value(this.point.cycle);
          const latency = metricsMeta["latency"].value(this.point.cycle);
          const duration = metricsMeta["duration"].value(this.point.cycle);
          const effort = metricsMeta["effort"].value(this.point.cycle);
          const authorCount = metricsMeta["authors"].value(this.point.cycle);
          const backlogTime = metricsMeta["backlogTime"].value(this.point.cycle);

          let beforeDivider = [
            [`Closed: `, `${formatDateTime(intl, this.point.x)}`],
            [`State: `, `${this.point.cycle.state}`],
          ];
          let afterDivider = [
            ["Lead Time: ", `${intl.formatNumber(leadTime)} days`],
            ["Backlog Time: ", backlogTime > 0 ? `${intl.formatNumber(backlogTime)} days` : "N/A"],
            ["Cycle Time: ", cycleTime > 0 ? `${intl.formatNumber(cycleTime)} days` : "N/A"],
          ];

          const indexOfSelectedMetric = METRICS.indexOf(selectedMetric);
          const toolTipLines= [...beforeDivider, afterDivider[indexOfSelectedMetric]];

          return tooltipHtml({
            header: `${WorkItemTypeDisplayName[this.point.cycle.workItemType]}: ${this.point.cycle.name} (${
              this.point.cycle.displayId
            })`,
            body: toolTipLines,
          });
        },
      },
      plotOptions: {
        series: {
          animation: false,
          dataLabels: {
            enabled: true,
            format: `{point.name}`,
            inside: true,
            verticalAlign: "center",
            style: {
              color: "black",
              textOutline: "none",
            },
          },
        },
      },
      time: {
        // Since we are already passing in UTC times we
        // dont need the chart to translate the time to UTC
        // This makes sure the tooltips text matches the timeline
        // on the axis.
        useUTC: false,
      },
    };
  },
});

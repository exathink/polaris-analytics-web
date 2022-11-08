import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {buildIndex, pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {getWorkItemDurations} from "../../widgets/work_items/clientSideFlowMetrics";

import {
  AppTerms,
  Colors,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemStateTypeSortOrder,
  WorkItemTypeDisplayName,
} from "../../config";

function getSpecSeries(workItems, view, intl) {
  // We group the work items for specs. These will always have non-zero effort.
  const workItemsByStateType = buildIndex(
    workItems.filter((workItem) => workItem.commitCount > 0),
    (workItem) => workItem.stateType
  );

  return Object.keys(workItemsByStateType)
    .sort((stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB])
    .map((stateType) => ({
      type: "column",
      key: `${stateType}`,
      id: `${stateType}`,
      name: `${WorkItemStateTypeDisplayName[stateType]}`,
      color: `${WorkItemStateTypeColor[stateType]}`,
      allowPointSelect: true,
      stacking: "normal",
      data: workItemsByStateType[stateType].sort(
        (workItemA, workItemB) => workItemB.effort - workItemA.effort
      ).map((workItem) => ({
        y: workItem.effort,
        name: `${WorkItemStateTypeDisplayName[stateType]}`,
        color: WorkItemStateTypeColor[stateType],
        workItem: workItem,
      })),
      animation: false,
      maxPointWidth: view === "detail" ? 150 : 50,
      dataLabels: {
        enabled: true,
        inside: true,
        filter: {
          operator: ">=",
          property: "percentage",
          value: 10,
        },
        formatter: function () {
          return this.point.percentage >= 30
            ? `${this.point.workItem.displayId}<br/>${intl.formatNumber(this.point.y)} days`
            : `${this.point.workItem.displayId}`;
        },
      },
    }));
}

function getNonSpecSeries(workItems, view, intl) {
  // All nospecs will be put into a single series.

  const nonSpecs = workItems.filter((workItem) => workItem.commitCount === null);
  return nonSpecs.length > 0
    ? [
        {
          type: "column",
          key: `non-specs`,
          id: `non-specs`,
          name: `No Commits`,

          allowPointSelect: true,
          stacking: "normal",
          minPointWidth: 1,
          data: nonSpecs
            .sort(
              (workItemA, workItemB) =>
                WorkItemStateTypeSortOrder[workItemA.stateType] - WorkItemStateTypeSortOrder[workItemB.stateType]
            )
            .map((workItem) => ({
              y: 0.1,
              name: `No Commits`,
              color: WorkItemStateTypeColor[workItem.stateType],
              workItem: workItem,
            })),
          dataLabels: {
            enabled: view === "detail",
            inside: true,
            formatter: function() {
              return `${this.point.workItem.displayId}`
            },
          },
        },
      ]
    : [];
}

function isYAxisVisible(series) {
  if (series.length === 1) {
    const [onlySeries] = series;
    if (onlySeries.key === "non-specs") {
      return false;
    }
  }
  return true;
}

export const WorkItemsEffortChart = Chart({
  chartUpdateProps: (props) => pick(props, "workItems", "stateTypes", "specsOnly"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point.workItem),

  getConfig: ({workItems, specsOnly,  intl, view}) => {
    const workItemsWithAggregateDurations = getWorkItemDurations(workItems);
    const totalEffort = workItemsWithAggregateDurations.reduce(
      (totalEffort, workItem) => totalEffort + workItem.effort,
      0
    );

    const series = [
      ...getSpecSeries(workItemsWithAggregateDurations, view, intl),
      ...(!specsOnly ? getNonSpecSeries(workItemsWithAggregateDurations, view, intl) : []),
    ];

    return {
      chart: {
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        useHTML: true,
        text: `<span>Effort<sub>WIP</sub> : ${intl.formatNumber(totalEffort, {maximumFractionDigits: 2})} FTE Days</span>`,
        align: "left",
      },
      subtitle: {
        text: `${intl.formatDate(Date.now(), {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })} `,
        align: "left",
      },
      xAxis: {
        type: "category",

        title: {
          text: null,
        },
      },
      yAxis: {
        type: "linear",
        visible: isYAxisVisible(series),
        title: {
          text: "Effort in FTE Days",
        },
      },

      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          const {
            displayId,
            workItemType,
            name,
            state,
            stateType,
            timeInStateDisplay,
            latestCommitDisplay,
            cycleTime,
            duration,
            effort,
            commitCount,
          } = this.point.workItem;

          return tooltipHtml({
            header: `${WorkItemTypeDisplayName[workItemType]}: ${displayId}<br/>${name}`,
            body:
              commitCount != null
                ? [
                    [`Effort`, `${intl.formatNumber(effort)} FTE Days`],
                    [`-----------------`, ``],
                    [`Duration`, `${intl.formatNumber(duration)} days`],
                    [`Latest Commit`, `${latestCommitDisplay}`],
                    [`-----------------`, ``],
                    [`Current State:`, `${state}`],
                    [`Entered:`, `${timeInStateDisplay}`],
                    [`Cycle Time:`, `${intl.formatNumber(cycleTime)} days`],
                  ]
                : [
                    [`Effort`, `Unknown`],
                    [`Phase:`, `${WorkItemStateTypeDisplayName[stateType]}`],
                    [`-----------------`, ``],
                    [`Current State:`, `${state}`],
                    [`Entered:`, `${timeInStateDisplay}`],
                    [`Cycle Time:`, `${intl.formatNumber(cycleTime)} days`],
                    [`-----------------`, ``],
                    [`Latest Commit`, `None`],
                  ],
          });
        },
      },
      series: series,
      legend: {
        title: {
          text: specsOnly ? AppTerms.specs.display : AppTerms.cards.display,
          style: {
            fontStyle: "italic",
          },
        },
        align: "right",
        layout: "vertical",
        verticalAlign: "middle",
        itemMarginBottom: 3,
        enabled: workItemsWithAggregateDurations.length > 0,
      },
    };
  },
});
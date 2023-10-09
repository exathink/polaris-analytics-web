import { Chart } from "../../../../framework/viz/charts";
import { buildIndex, elide, localNow, pick, range } from "../../../../helpers/utility";
import { DefaultSelectionEventHandler } from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {
  AppTerms,
  Colors,
  Symbols,
  workItemFlowTypeColor,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemStateTypeSortOrder,
  WorkItemTypeDisplayName,
  WorkItemTypeScatterRadius
} from "../../config";
import {
  getImpedance,
  getQuadrantName,
  QuadrantColors,
  QuadrantNames
} from "../../widgets/work_items/wip/cycleTimeLatency/cycleTimeLatencyUtils";
import { tooltipHtml_v2 } from "../../../../framework/viz/charts/tooltip";
import { withNavigationContext } from "../../../../framework/navigation/components/withNavigationContext";


function getSeriesByStateType(workItems) {
  // We group the work items into series by state type.
  const workItemsByStateType = buildIndex(workItems, workItem => workItem.stateType);

  return Object.keys(workItemsByStateType).sort(
    (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
  ).map(
    stateType => (
      {
        type: "scatter",
        key: `${stateType}`,
        id: `${stateType}`,
        name: `${WorkItemStateTypeDisplayName[stateType]}`,
        color: `${WorkItemStateTypeColor[stateType]}`,
        marker: {
          symbol: "circle"
        },
        allowPointSelect: true,
        data: workItemsByStateType[stateType].map(
          workItem => (
            {
              x: workItem.cycleTime,
              y: workItem.latency || workItem.cycleTime,
              marker: {
                symbol: Symbols.WorkItemType[workItem.workItemType],
                radius: WorkItemTypeScatterRadius[workItem.workItemType]
              },
              workItem: workItem
            }
          )
        ),
        cursor: "pointer"
      }
    )
  );
}

function getSeriesByState(workItems, view, cycleTimeTarget, latencyTarget) {
  // We group the work items into series by state.
  const workItemsByState = buildIndex(workItems, workItem => workItem.state);

  return Object.keys(workItemsByState)
    .sort((stateTypeA, stateTypeB) => {
      if (workItemsByState[stateTypeA][0]?.flowType < workItemsByState[stateTypeB][0]?.flowType) return -1;
      if (workItemsByState[stateTypeA][0]?.flowType > workItemsByState[stateTypeB][0]?.flowType) return 1;
      return 0;
    })
    .map((state) => ({
      type: "scatter",
      key: `${state}`,
      id: `${state}`,
      name: view === "primary" ? elide(state.toLowerCase(), 10) : state.toLowerCase(),
      marker: {
        symbol: "circle",
      },
      allowPointSelect: true,
      color: workItemFlowTypeColor(workItemsByState[state][0]?.flowType),
      data: workItemsByState[state].map((workItem) => ({
        x: workItem.cycleTime,
        y: workItem.latency || workItem.cycleTime,

        marker: {
          symbol: Symbols.WorkItemType[workItem.workItemType],
        },
        workItem: workItem,
      })),
      cursor: "pointer",
    }));
}

export function getTitle({workItems, stageName, specsOnly, selectedQuadrant}) {
  const count = workItems.length;
  const prefix = `Motion Analysis`
  const countDisplay = `${count} ${count === 1 ? specsOnly ? AppTerms.spec.display : AppTerms.card.display : specsOnly ? AppTerms.specs.display : AppTerms.cards.display}`;
  let suffix =  stageName ? `${countDisplay} in ${stageName}` : countDisplay;
  if (selectedQuadrant) {
    if (stageName) {
      suffix =  `${countDisplay} ${QuadrantNames[selectedQuadrant]} in ${stageName}`
    } else {
      suffix =  `${countDisplay} ${QuadrantNames[selectedQuadrant]}`
    }
  }
  return `${prefix}: ${suffix}`
}

function getTeamEntry(teamNodeRefs) {
  const temp = teamNodeRefs.map((team) => team.teamName).filter((_, i) => i < 2).join(", ");
  const teamsString = teamNodeRefs.length > 2 ? `${temp}, ...` : temp;
  return teamNodeRefs.length > 0 ? teamsString : "";
}



function getMotionLines(workItems,  maxCycleTime) {
  // We use this to generate the points on the line of motion.
  const xAxisRange = range(0,maxCycleTime)

  return [
    // This is the x=y line or the line of immobile points.
    // It is also a reference line, so we don't interact with it or show the points on the line
    {
      type: "spline",
      key: `line-of-immobility`,
      id: `motionless-line`,
      name: 'motionless',
      color: "red",
      showInLegend: true,
      allowPointSelect: false,
      enableMouseTracking: false,
      data: xAxisRange.map(
        x => ({
          x: x,
          y: x,
          color: Colors.Chart.backgroundColor
        })),
      zIndex: -102
    }]
}

function getAnnotations(intl, cycleTimeTarget, workItemsWithAggregateDurations) {
  // we limit friction to a number between 0 and 100
  const impedance = getImpedance(workItemsWithAggregateDurations, cycleTimeTarget)
  const color = impedance <= 0.8 ? QuadrantColors.ok : (impedance <= 1 ? QuadrantColors.age : QuadrantColors.critical)
  return [
        {
          visible: workItemsWithAggregateDurations.length > 0,
          labels: {
            point: {
              x:10,
              y:10,
            },
            useHtml: true,
            text: `Impedance: ${intl.formatNumber(impedance, {maximumFractionDigits: 2})}`,
            shadow: {
              color: color,
              offsetX: -1,
              opacity: 0.3
            },
            style: {
              color: color === QuadrantColors.critical ? 'white' : 'black'
            },
            borderRadius: 5,
            backgroundColor: color
          }
        }
      ]
}

export const WorkItemsCycleTimeVsLatencyChart = withNavigationContext(Chart({
  chartUpdateProps: (props) => (
    pick(props, "workItems", "stateTypes", "stageName", "groupByState", "cycleTimeTarget", "specsOnly", "tick", "selectedQuadrant", "fullScreen", "excludeAbandoned")
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point.workItem),

  getConfig: ({
                workItems,
                stateTypes,
                groupByState,
                cycleTimeTarget,
                latencyTarget,
                stageName,
                specsOnly,
                tick,
                intl,
                view,
                tooltipType,
                selectedQuadrant,
                blurClass,
                fullScreen,
                excludeAbandoned
              }) => {

    const workItemsWithAggregateDurations = workItems;

    const maxCycleTime = Math.max(...workItemsWithAggregateDurations.map(workItems => workItems.cycleTime));
    const minCycleTime = Math.min(...workItemsWithAggregateDurations.map(workItems => workItems.cycleTime));
    const minLatency = Math.min(...workItemsWithAggregateDurations.map(workItems => workItems.latency));

    const targetLatency = latencyTarget || (cycleTimeTarget && cycleTimeTarget * 0.1) || null;

    const cycleTimeVsLatencySeries = groupByState ?
      getSeriesByState(workItemsWithAggregateDurations, view, cycleTimeTarget, latencyTarget)
      : getSeriesByStateType(workItemsWithAggregateDurations, view);

    const motionLines = getMotionLines(workItems,  maxCycleTime, minCycleTime)

    const abandonedPlotLineYAxis = excludeAbandoned===false
      ? [
          {
            color: "red",
            value: 2 * cycleTimeTarget,
            dashStyle: "solid",
            width: 1,
            label: {
              text: ` L= ${intl.formatNumber(2 * cycleTimeTarget)}d`,
            },
          },
        ]
      : [];

    const abandonedPlotLineXAxis =
      excludeAbandoned === false
        ? [
            {
              color: "red",
              value: 2 * cycleTimeTarget,
              dashStyle: "solid",
              width: 1.5,
              label: {
                text: ` A= ${intl.formatNumber(2 * cycleTimeTarget)}d`,
              },
            },
          ]
        : [];

    return {
      chart: {
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: getTitle({workItems: workItemsWithAggregateDurations, stageName, specsOnly, selectedQuadrant}),
        align: "left",
      },
      subtitle: {
        text: `Age & Last Moved: ${localNow(intl)} `,
        align: "left",
      },
      xAxis: {
        type: "logarithmic",
        softMin: 0.5,
        //1.2 is a fudge factor - otherwise the point gets cut off when it is at max.
        // softMax causes the log axis to blow up
        max: Math.max(maxCycleTime, cycleTimeTarget || -1) * 1.2,
        visible: true,
        labels: {
          formatter: function () {
            return intl.formatNumber(this.value, {maximumSignificantDigits: 2});
          },
        },
        title: {
          text: "Age in Days",
        },
        plotLines: cycleTimeTarget
          ? [
              {
                color: "green",
                value: cycleTimeTarget,
                dashStyle: "solid",
                width: 1.5,
                label: {
                  text: ` A= ${intl.formatNumber(cycleTimeTarget)}d`,
                },
              },
              ...abandonedPlotLineXAxis,
            ]
          : null,
      },
      yAxis: {
        type: "logarithmic",
        labels: {
          formatter: function () {
            return intl.formatNumber(this.value, {maximumSignificantDigits: 2});
          },
        },
        title: {
          text: "Last Moved in Days",
        },
        // We need this rigmarole here because the min value cannot be 0 for
        // a logarithmic axes. If minLatency === 0 we choose the nominal value of 0.001.

        min: Math.max(Math.min(minLatency, targetLatency - 0.5), 0.001),
        plotLines: targetLatency
          ? [
              {
                color: "green",
                value: targetLatency,
                dashStyle: "solid",
                width: 1,
                label: {
                  text: ` L= ${intl.formatNumber(targetLatency)}d`,
                },
              },
              {
                color: excludeAbandoned ? "red" : "orange",
                value: cycleTimeTarget,
                dashStyle: "solid",
                width: 1,
                label: {
                  text: ` L= ${intl.formatNumber(cycleTimeTarget)}d`,
                },
              },
              ...abandonedPlotLineYAxis,
            ]
          : null,
      },

      tooltip: {
        useHTML: true,
        hideDelay: 50,
        outside: fullScreen === false,
        formatter: function () {
          if (this.point.workItem != null) {
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
                latency,
                effort,
                workItemStateDetails,
                teamNodeRefs,
              } = this.point.workItem;

              const teamEntry = getTeamEntry(teamNodeRefs);
              const teamHeaderEntry = teamNodeRefs.length > 0 ? `${teamEntry} <br/>` : "";

              const remainingEntries =
                tooltipType === "small"
                  ? []
                  : [
                      [],
                      [`Current State:`, `${state.toLowerCase()}`],
                      [`Entered:`, `${timeInStateDisplay}`],

                      stateType !== "closed" ? [`Time in State:`, `${intl.formatNumber(this.y)} days`] : ["", ""],

                      [`Commits`, `${intl.formatNumber(workItemStateDetails.commitCount || 0)}`],
                      workItemStateDetails.commitCount != null ? [] : [``, ``],
                      duration != null ? [`Duration`, `${intl.formatNumber(duration)} days`] : ["", ""],
                      effort != null ? [`Effort`, `${intl.formatNumber(effort)} FTE Days`] : ["", ""],
                    ];

              const _displayId = blurClass ? "**********" : displayId;
              const _name = blurClass ? "**********" : name;
              return tooltipHtml_v2({
                header: `${teamHeaderEntry}${WorkItemTypeDisplayName[workItemType]}: ${_displayId}<br/>${elide(_name, 30)}`,
                body: [
                  [`Status:`, `${getQuadrantName(cycleTime, latency, cycleTimeTarget, latencyTarget)?.toLowerCase()}`],
                  [`Current State:`, `${state.toLowerCase()}`],
                  [`Entered:`, `${timeInStateDisplay}`],
                  [],
                  [`Age:`, `${intl.formatNumber(cycleTime)} days`],
                  [`Last Moved:`, `${intl.formatNumber(latency)} days`],
                  effort != null ? [`Effort`, `${intl.formatNumber(effort)} FTE Days`] : ["", ""],
                  latestCommitDisplay != null ? [`Latest Commit`, `${latestCommitDisplay}`] : ["", ""],
                  ...remainingEntries,
                ],
              });
            }},
      },
      series: [...cycleTimeVsLatencySeries, ...motionLines],
      plotOptions: {
        series: {
          animation: false,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.point.workItem?.displayId;
            },
          },
          events: {
            legendItemClick: function () {
              const currentSeries = this;
              // get all the series
              var series = this.chart.series;
              
              // other series except current
              const otherSeries = series.filter((x) => x.type !== 'spline').filter((x) => x.userOptions.id !== currentSeries.userOptions.id);
              const areAllOtherHidden = otherSeries.every((x) => Boolean(x.visible)===false);

              if (areAllOtherHidden) {
                otherSeries.forEach((x) => {
                  x.show();
                });
              } else {
                otherSeries.forEach((x) => {
                  x.hide();
                });
              }
              
              if (this.visible) {
                return false;
              }
              
            },
          },
        },
      },
      legend: {
        title: {
          text: groupByState ? "State" : "Phase",
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
      annotations: getAnnotations(intl, cycleTimeTarget, workItemsWithAggregateDurations)
    };
  }
}));
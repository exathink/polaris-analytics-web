import { Chart, tooltipHtml } from "../../../../framework/viz/charts";
import { buildIndex, pick, elide, localNow } from "../../../../helpers/utility";
import { DefaultSelectionEventHandler } from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import { getWorkItemDurations } from "../../widgets/work_items/clientSideFlowMetrics";

import {
  Colors,
  Symbols,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemStateTypeSortOrder,
  WorkItemTypeDisplayName,
  WorkItemTypeScatterRadius
} from "../../config";



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

function getSeriesByState(workItems, view) {
  // We group the work items into series by state.
  const workItemsByState = buildIndex(workItems, workItem => workItem.state);

  return Object.keys(workItemsByState).sort(
    (stateTypeA, stateTypeB) => workItemsByState[stateTypeA].length - workItemsByState[stateTypeB].length
  ).map(
    state => (
      {
        type: "scatter",
        key: `${state}`,
        id: `${state}`,
        name: view === "primary" ? elide(state, 10) : state,
        marker: {

          symbol: "circle"
        },
        allowPointSelect: true,
        data: workItemsByState[state].map(
          workItem => (
            {
              x: workItem.cycleTime,
              y: workItem.latency || workItem.cycleTime,
              marker: {
                symbol: Symbols.WorkItemType[workItem.workItemType]

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

function getTitle(workItems, stageName, specsOnly) {
  const count = workItems.length;
  const countDisplay = `${count} ${count === 1 ? specsOnly ? "Spec" : "Card" : specsOnly ? "Specs" : "Cards"}`;
  return stageName ? `${countDisplay} in ${stageName}` : countDisplay;
}

function getTeamEntry(teamNodeRefs) {
  const temp = teamNodeRefs.map((team) => team.teamName).filter((_, i) => i < 2).join(", ");
  const teamsString = teamNodeRefs.length > 2 ? `${temp}, ...` : temp;
  return teamNodeRefs.length > 0 ? teamsString : "";
}

export const WorkItemsCycleTimeVsLatencyChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, "workItems", "stateTypes", "stageName", "groupByState", "cycleTimeTarget", "specsOnly", "tick")
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
                tooltipType
              }) => {

    const workItemsWithAggregateDurations = getWorkItemDurations(workItems).filter(
      workItem => stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true
    );

    const maxCycleTime = Math.max(...workItemsWithAggregateDurations.map(workItems => workItems.cycleTime));
    const minLatency = Math.min(...workItemsWithAggregateDurations.map(workItems => workItems.latency));

    const targetLatency = latencyTarget || (cycleTimeTarget && cycleTimeTarget * 0.1) || null;

    const cycleTimeVsLatencySeries = groupByState ?
      getSeriesByState(workItemsWithAggregateDurations, view)
      : getSeriesByStateType(workItemsWithAggregateDurations, view);

    return {
      chart: {

        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy"

      },
      title: {
        text: getTitle(workItemsWithAggregateDurations, stageName, specsOnly),
        align: "left"
      },
      subtitle: {
        text: `Age vs Idle Time: ${localNow(intl)} `,
        align: "left"
      },
      xAxis: {
        type: "logarithmic",
        softMin: 0.5,
        //1.2 is a fudge factor - otherwise the point gets cut off when it is at max.
        // softMax causes the log axis to blow up
        max: Math.max(maxCycleTime, cycleTimeTarget || -1) * 1.2,
        visible: true,
        labels: {
          formatter: function() {
            return intl.formatNumber(this.value, { maximumSignificantDigits: 2 });
          }
        },
        title: {
          text: "Age in Days"
        },
        plotLines: cycleTimeTarget ? [
          {
            color: "red",
            value: cycleTimeTarget,
            dashStyle: "longdashdot",
            width: 1,
            label: {
              text: ` T= ${intl.formatNumber(cycleTimeTarget)}`
            }
          }
        ] : null
      },
      yAxis: {
        type: "logarithmic",
        labels: {
          formatter: function() {
            return intl.formatNumber(this.value, { maximumSignificantDigits: 2 });
          }
        },
        title: {
          text: "Idle Time in Days"
        },
        // We need this rigmarole here because the min value cannot be 0 for
        // a logarithmic axes. If minLatency === 0 we choose the nominal value of 0.001.

        min: Math.max(Math.min(minLatency, targetLatency - 0.5), 0.001),
        plotLines: targetLatency ? [
          {
            color: "red",
            value: targetLatency,
            dashStyle: "longdashdot",
            width: 1,
            label: {
              text: ` T= ${intl.formatNumber(targetLatency)}`
            }
          }
        ] : null
      },

      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function() {
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
            teamNodeRefs
          } = this.point.workItem;

          const teamEntry = getTeamEntry(teamNodeRefs);
          const teamHeaderEntry = teamNodeRefs.length > 0 ? `${teamEntry} <br/>` : "";

          const remainingEntries =
            tooltipType === "small"
              ? []
              : [
                [`-----------------`, ``],
                [`Current State:`, `${state}`],
                [`Entered:`, `${timeInStateDisplay}`],

                stateType !== "closed" ? [`Time in State:`, `${intl.formatNumber(this.y)} days`] : ["", ""],

                [`Commits`, `${intl.formatNumber(workItemStateDetails.commitCount || 0)}`],
                workItemStateDetails.commitCount != null ? [`-----------------`, ``] : [``, ``],
                duration != null ? [`Duration`, `${intl.formatNumber(duration)} days`] : ["", ""],
                effort != null ? [`Effort`, `${intl.formatNumber(effort)} FTE Days`] : ["", ""]
              ];

          return tooltipHtml({
            header: `${teamHeaderEntry}${WorkItemTypeDisplayName[workItemType]}: ${displayId}<br/>${
              elide(name, 30)
            }`,
            body: [
              [`Current State:`, `${state}`],
              [`-----------------`, ``],
              [`Age:`, `${intl.formatNumber(cycleTime)} days`],
              [`Idle Time`, `${intl.formatNumber(latency)} days`],

              latestCommitDisplay != null ? [`Latest Commit`, `${latestCommitDisplay}`] : ["", ""],
              ...remainingEntries

            ]
          });
        }
      },
      series: [
        ...cycleTimeVsLatencySeries
      ],
      plotOptions: {
        series: {
          animation: false,
          dataLabels: {
            enabled: true,
            formatter: function() {
              return this.point.workItem.displayId;
            }
          },
          zoneAxis: 'x',
          zones: [{
            value: 0,
            color: "#f7a35c"
          }, {
            value: cycleTimeTarget,
            color: "#488a1a"
          },
          {
            color: "#d30c4b"
          }
          ]
        }
      },
      legend: {
        title: {
          text: groupByState ? "State" : "Phase",
          style: {
            fontStyle: "italic"
          }
        },
        align: "right",
        layout: "vertical",
        verticalAlign: "middle",
        itemMarginBottom: 3,
        enabled: workItemsWithAggregateDurations.length > 0

      }
    };
  }
});
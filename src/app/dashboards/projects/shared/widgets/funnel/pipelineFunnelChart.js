import { Chart } from "../../../../../framework/viz/charts";
import {
  DefaultSelectionEventHandler
} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick, humanizeDuration, i18nNumber } from "../../../../../helpers/utility";
import {
  Colors,
  WorkItemStateTypeColor,
  WorkItemStateTypes,
  WorkItemStateTypeDisplayName
} from "../../../../shared/config";
import { Highcharts } from "../../../../../framework/viz/charts/chartWrapper";
import {tooltipHtml_v2} from "../../../../../framework/viz/charts/tooltip";

require("highcharts/modules/funnel")(Highcharts);


function getCloseRate(workItemStateTypeCounts, days) {
  return (workItemStateTypeCounts[WorkItemStateTypes.closed] || 0) / days;
}

function getTimeToClear(workItemStateTypeCounts, days) {
  const timeToClear = {};
  const closeRate = getCloseRate(workItemStateTypeCounts, days);
  if (closeRate > 0) {
    timeToClear[WorkItemStateTypes.backlog] = (
      (workItemStateTypeCounts[WorkItemStateTypes.backlog] || 0) +
      (workItemStateTypeCounts[WorkItemStateTypes.open] || 0) +
      (workItemStateTypeCounts[WorkItemStateTypes.make] || 0) +
      (workItemStateTypeCounts[WorkItemStateTypes.deliver] || 0)
    ) / closeRate;
    timeToClear[WorkItemStateTypes.make] = (
      (workItemStateTypeCounts[WorkItemStateTypes.open] || 0) +
      (workItemStateTypeCounts[WorkItemStateTypes.make] || 0) +
      (workItemStateTypeCounts[WorkItemStateTypes.deliver] || 0)
    ) / closeRate;
    timeToClear[WorkItemStateTypes.deliver] = (
      workItemStateTypeCounts[WorkItemStateTypes.deliver]
    ) / closeRate;
  }
  return timeToClear;

}


export const PipelineFunnelChart = Chart({
  chartUpdateProps: (props) => pick(props, "workItemStateTypeCounts", "totalEffortByStateType", "grouping", "showVolumeOrEffort", "days", "leadTimeTarget", "cycleTimeTarget"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({
                workItemStateTypeCounts,
                totalEffortByStateType,
                days,
                leadTimeTarget,
                cycleTimeTarget,
                grouping,
                showVolumeOrEffort = "volume",
                displayBag={},
                intl
              }) => {

    const selectedSummary = workItemStateTypeCounts;
    const timeToClear = getTimeToClear(workItemStateTypeCounts, days);
    const {funnelCenter = ["38%", "50%"], title, subTitle} = displayBag;
    return {
      chart: {
        type: "funnel",
        backgroundColor: Colors.Chart.backgroundColor
      },
      title: {
        text: title || `Flow, ${grouping === 'specs' ? "Specs" : "All Cards"}`,
        align: "center"
      },
      subtitle: {
        text: subTitle || (showVolumeOrEffort === 'volume' ? "Expected Time to Clear by Phase" : "Total Effort by Phase"),
        align: "center"
      },
      plotOptions: {
        series: {
          dataLabels: [{
            enabled: true,
            useHTML: true,
            formatter: function() {
              const label = this.point.stateType === WorkItemStateTypes.closed ? `${this.point.name} Last ${days} days` : `${this.point.name}`;
              return `<b>${label}</b> (${this.point.count})`;
            },
            style: {
              fontSize: displayBag?.series?.dataLabels?.fontSize
            },
            softConnector: true,
            color: "black",
          }, {
            enabled: true,
            align: "center",
            allowOverlap: false,
            useHTML: true,
            formatter: function() {
              return (
                showVolumeOrEffort === "volume" ?
                  this.point.timeToClear ?
                    humanizeDuration(this.point.timeToClear)
                    :
                    this.point.stateType === WorkItemStateTypes.closed ?
                      `Throughput: ${i18nNumber(intl, getCloseRate(workItemStateTypeCounts, days), 1)} /day`
                      :
                      ""
                  :
                  ` ${i18nNumber(intl, totalEffortByStateType[this.point.stateType], 1)}  FTE Days`
              );
            },
            style: {
              fontSize: displayBag?.series?.dataLabels?.fontSize
            },
            color: "white"
          }],
          center: funnelCenter,
          neckWidth: "25%",
          neckHeight: "45%",
          width: "70%"
        }
      },
      legend: {
        title: {
          text: "Phases",
          style: {
            fontStyle: "italic",
            fontSize: displayBag?.legend?.title?.fontSize,
          }
        },
        align: "left",
        layout: "vertical",
        verticalAlign: "middle",
        itemMarginBottom: 3,
        enabled: true,
        itemStyle: {
          fontSize: displayBag?.legend?.fontSize
        }
      },
      series: [{
        name: grouping === "specs" ? "Specs" : "Cards",
        data: Object.keys(WorkItemStateTypeDisplayName).filter(
          stateType => selectedSummary[stateType] != null
        ).map(
          stateType => ({
            name: WorkItemStateTypeDisplayName[stateType],
            y: (selectedSummary[stateType] || 0),

            color: WorkItemStateTypeColor[stateType],
            stateType: stateType,
            count: selectedSummary[stateType],
            timeToClear: timeToClear[stateType]
          })
        ),
        showInLegend: true
      }],
      tooltip: {
        useHTML: true,
        outside: true,
        followPointer: false,
        hideDelay: 0,
        formatter: function() {
          const timeToClear = this.point.timeToClear ? `<br/>Expected Time to Clear: ${humanizeDuration(this.point.timeToClear)}` : "";
          const closeRate = getCloseRate(workItemStateTypeCounts, days);
          const wipLevelInfo = [
            ["Avg. Throughput: ", `${i18nNumber(intl, closeRate, 3)} /day`],
            [],
            ["<b>Code + Deliver Phase</b>", ""],
            ["Current Total Wip", workItemStateTypeCounts[WorkItemStateTypes.open] + workItemStateTypeCounts[WorkItemStateTypes.make] + workItemStateTypeCounts[WorkItemStateTypes.deliver]],
            ["Recommended Target Wip", ` ${i18nNumber(intl, cycleTimeTarget * getCloseRate(workItemStateTypeCounts, days), 0)}`]

          ];
          return tooltipHtml_v2({
              header: `Phase: ${this.point.name}${timeToClear}`,
              body: [
                [`Volume: `, ` ${intl.formatNumber(this.point.count)} ${grouping === "specs" ? "Specs" : "Cards"}`],

                [`Effort: `, ` ${intl.formatNumber(totalEffortByStateType[this.point.stateType])}  FTE Days`],

                ...(this.point.stateType === WorkItemStateTypes.closed ? wipLevelInfo : [["", ""]])
              ]
            }
          );
        }
      }
    };
  }
});
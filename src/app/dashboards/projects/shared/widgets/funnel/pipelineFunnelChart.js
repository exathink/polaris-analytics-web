import {Chart, tooltipHtml} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {capitalizeFirstLetter, pick, humanizeDuration} from "../../../../../helpers/utility";
import {Colors, WorkItemStateTypeColor, WorkItemStateTypes, WorkItemStateTypeDisplayName} from "../../../../shared/config";
import {Highcharts} from "../../../../../framework/viz/charts/chartWrapper";

require('highcharts/modules/funnel')(Highcharts);

function getTimeToClear(workItemStateTypeCounts, days) {
  const timeToClear = {}
  const closeRate = (workItemStateTypeCounts[WorkItemStateTypes.closed] || 0)/days;
  if (closeRate > 0) {
    timeToClear[WorkItemStateTypes.backlog] = (
      workItemStateTypeCounts[WorkItemStateTypes.backlog] || 0 +
      workItemStateTypeCounts[WorkItemStateTypes.open] || 0 +
      workItemStateTypeCounts[WorkItemStateTypes.make] || 0 +
      workItemStateTypeCounts[WorkItemStateTypes.deliver] || 0
    ) / closeRate;
    timeToClear[WorkItemStateTypes.make] = (
      workItemStateTypeCounts[WorkItemStateTypes.open] || 0 +
      workItemStateTypeCounts[WorkItemStateTypes.make] || 0 +
      workItemStateTypeCounts[WorkItemStateTypes.deliver] || 0
    ) / closeRate;
    timeToClear[WorkItemStateTypes.deliver] = (
      workItemStateTypeCounts[WorkItemStateTypes.deliver]
    ) / closeRate;
  }
  return timeToClear;

}
export const PipelineFunnelChart = Chart({
  chartUpdateProps: (props) => pick(props, 'workItemStateTypeCounts', 'totalEffortByStateType', 'grouping', 'days'),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({workItemStateTypeCounts, totalEffortByStateType, days, title, grouping, intl}) => {

    const selectedSummary = workItemStateTypeCounts;
    const timeToClear = getTimeToClear(workItemStateTypeCounts, days)
    return {
      chart: {
        type: 'funnel',
        backgroundColor: Colors.Chart.backgroundColor,
      },
      title: {
        text: title || 'Flow States',
        align: 'left'
      },
      plotOptions: {
        series: {
          dataLabels: [{
            enabled: true,
            formatter : function() {
              const label = this.point.stateType === WorkItemStateTypes.closed ? `${this.point.name} Last ${days} days` : `${this.point.name}`;
              return `<b>${label}</b> (${this.point.y})`
            },
            softConnector: true,
            color: 'black'
          }, {
            enabled: true,
            align: 'center',
            formatter: function (){
              return this.point.timeToClear? humanizeDuration(this.point.timeToClear) : ''
            },
            color: 'black'
          }],
          center: ['45%', '50%'],
          neckWidth: '25%',
          neckHeight: '45%',
          width: '80%'
        }
      },
      legend: {
        title: {
          text: grouping === 'specs' ? capitalizeFirstLetter(grouping): 'All Cards',
          style: {
            fontStyle: 'italic'
          }
        },
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle',
        itemMarginBottom: 3,
        enabled: true
      },
      series: [{
        name: grouping === 'specs' ? 'Specs' : 'Cards',
        data: Object.keys(WorkItemStateTypeDisplayName).filter(
          stateType => selectedSummary[stateType] != null
        ).map(
          stateType=> ({
            name: WorkItemStateTypeDisplayName[stateType],
            y: selectedSummary[stateType] || 0,
            color: WorkItemStateTypeColor[stateType],
            stateType: stateType,
            timeToClear: timeToClear[stateType]
          })
        ),
        showInLegend: true
      }],
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 0,
        formatter: function () {
          const timeToClear = this.point.timeToClear ? `<br/>Time to Clear: ${humanizeDuration(this.point.timeToClear)}` : ''
          return tooltipHtml({
              header: `Phase: ${this.point.name}${timeToClear}`,
              body: [
                [`Volume: `, ` ${intl.formatNumber(this.point.y)} ${grouping === 'specs'? 'Specs': 'Cards'}`],

                [`Effort: `, ` ${intl.formatNumber(totalEffortByStateType[this.point.stateType])}  FTE Days`],
              ]
            }
          )
        }
      }
    }
  }
});
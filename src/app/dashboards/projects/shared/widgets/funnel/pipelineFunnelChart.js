import {Chart, tooltipHtml} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {capitalizeFirstLetter, pick} from "../../../../../helpers/utility";
import {Colors, WorkItemStateTypeColor, WorkItemStateTypeDisplayName} from "../../../../shared/config";
import {Highcharts} from "../../../../../framework/viz/charts/chartWrapper";

require('highcharts/modules/funnel')(Highcharts);

export const PipelineFunnelChart = Chart({
  chartUpdateProps: (props) => pick(props, 'workItemStateTypeCounts', 'totalEffortByStateType', 'grouping'),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({workItemStateTypeCounts, totalEffortByStateType, title, grouping, intl}) => {

    const selectedSummary = workItemStateTypeCounts;

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
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b> ({point.y:,.0f})',
            softConnector: true,
            color: 'black'
          },
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
            stateType: stateType
          })
        ),
        showInLegend: true
      }],
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 0,
        formatter: function () {

          return tooltipHtml({
              header: `Phase: ${this.point.name}`,
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
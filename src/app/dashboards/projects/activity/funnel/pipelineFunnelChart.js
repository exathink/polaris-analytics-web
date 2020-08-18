import {Chart} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {capitalizeFirstLetter, pick} from "../../../../helpers/utility";
import {Colors, WorkItemStateTypeColor, WorkItemStateTypeDisplayName} from "../../../shared/config";
import {Highcharts} from "../../../../framework/viz/charts/chartWrapper";

require('highcharts/modules/funnel')(Highcharts);

export const PipelineFunnelChart = Chart({
  chartUpdateProps: (props) => pick(props, 'workItemStateTypeCounts', 'specStateTypeCounts', 'grouping'),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({workItemStateTypeCounts, specStateTypeCounts, title, grouping, intl}) => {

    const selectedSummary = grouping === 'specs' ? specStateTypeCounts : workItemStateTypeCounts;

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
          center: ['38%', '50%'],
          neckWidth: '15%',
          neckHeight: '50%',
          width: '80%'
        }
      },
      legend: {
        title: {
          text: capitalizeFirstLetter(grouping),
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
        name: 'Foo',
        data: Object.keys(WorkItemStateTypeDisplayName).filter(
          stateType => selectedSummary[stateType] != null
        ).map(
          stateType=> ({
            name: WorkItemStateTypeDisplayName[stateType],
            y: selectedSummary[stateType] || 0,
            color: WorkItemStateTypeColor[stateType]
          })
        ),
        showInLegend: true
      }]
    }
  }
});
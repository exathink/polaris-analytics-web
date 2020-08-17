import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick} from "../../../../helpers/utility";
import {Colors, WorkItemStateTypeDisplayName, WorkItemStateTypeColor} from "../../../shared/config";
import {Highcharts} from "../../../../framework/viz/charts/chartWrapper";
require('highcharts/modules/funnel')(Highcharts);

export const PipelineFunnelChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'workItemStateTypeCounts', 'specStateTypeCounts')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({workItemStateTypeCounts, specStateTypeCounts, title, intl}) => {

    return {
      chart: {
        type: 'funnel',
        backgroundColor: Colors.Chart.backgroundColor,
      },
      title: {
        text: '',
        align: 'left'
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b> ({point.y:,.0f})',
            softConnector: true
          },
          center: ['40%', '50%'],
          neckWidth: '15%',
          neckHeight: '50%',
          width: '80%'
        }
      },
      legend: {
        title: {
          text: 'Specs',
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
        data: Object.keys(WorkItemStateTypeDisplayName).map(
          stateType=> ({
            name: WorkItemStateTypeDisplayName[stateType],
            y: workItemStateTypeCounts[stateType] || 0,
            color: WorkItemStateTypeColor[stateType]
          })
        ),
        showInLegend: true
      }]
    }
  }
});
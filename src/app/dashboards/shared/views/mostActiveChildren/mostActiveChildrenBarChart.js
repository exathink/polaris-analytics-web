import {Chart} from "../../../../framework/viz/charts";
import {Colors} from "../../config";

function initSeries(activeChildren) {
  return activeChildren.map(child => ({
    name: child.name,
    y: child.commitCount,
    color: Colors.ActivityLevel.ACTIVE
  }));
}

export const MostActiveChildrenBarChart = Chart({
  chartUpdateProps:
    (props) => ({
      activeChildren: props.activeChildren,
      childContext: props.childContext,
    }),
  getConfig:
    ({activeChildren, view, childContext}) => {
      const series_data = initSeries(activeChildren);

      return {
        chart: {
          type: 'column',
          backgroundColor: "#f2f3f6"
        },
        title: {
          text: 'Recent Activity',
          align: 'left'
        },
        xAxis: {
          type: 'category',
          title: {
            text: 'Repository'
          },
          visible: view === 'detail'
        },
        yAxis: {
          type: 'linear',
          title: {
            text: 'Commits'
          }
        },
        series: [{
          key: 'Recent commits',
          id: 'Recent commits',
          name: 'Commits',
          data: series_data
        }],
        legend: {
            enabled: false
        }
      }
    }
});
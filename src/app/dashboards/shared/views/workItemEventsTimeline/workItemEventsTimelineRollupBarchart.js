import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {Colors} from "../../config";
import {getCategoriesIndex} from "./workItemEventsTimelineChartModel";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {capitalizeFirstLetter} from "../../../../helpers/utility";

function getWorkItemName(workItemEvents, displayId) {
  const workItem = workItemEvents.find(item => item.displayId == displayId)
  if (workItem) {
    return workItem.name
  } else {
    return displayId
  }
}

function getTooltip(timelineEvents, categoriesIndex, groupBy, series) {
  if (groupBy == 'workItem') {
    const workItem = timelineEvents.find(item => item.displayId == series.name)
    if (workItem) {
      return `<p><b>${capitalizeFirstLetter(workItem.workItemType)}: </b>#${series.name}<br/>${workItem.name}<br/><br/> ${categoriesIndex[series.name]} events</p>`
    } else {
      return `<br>${series.name}<br/><br/> ${categoriesIndex[series.name]} events</p>`
    }
  } else {
    return `<br>${series.name}<br/><br/> ${categoriesIndex[series.name]} events</p>`
  }
}

export const WorkItemEventsTimelineRollupBarchart = Chart({
  chartUpdateProps:
    (props) => ({
      workItemEvents: props.model.workItemEvents,
      groupBy: props.model.groupBy
    }),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: points => points.map( point => point.name),
  getConfig:
    ({model, suppressDataLabelsThreshold}) => {
      const {timelineEvents, categoriesIndex, groupBy} = model

      const series = Object.keys(categoriesIndex).map(
        category => ({
          id: category,
          name: category,
          data: [{
            name: category,
            y: categoriesIndex[category]
          }],
          allowPointSelect: true,
        })
      ).sort((series_a, series_b) => series_b.data[0].y - series_a.data[0].y);
      return {
        chart: {
          type: 'column',
          backgroundColor: Colors.Chart.backgroundColor,
        },
        plotOptions:{
          bar: {
            pointPadding: 0.01,
            groupPadding: 0.01
          },
          series: {
            stacking: 'normal',
            dataLabels: {
                enabled: suppressDataLabelsThreshold && series.length <= suppressDataLabelsThreshold,
                rotation: 90,
                align: 'left',
                verticalAlign: 'middle',
                formatter: function() {
                  return `<b>${this.series.name}</b>`
                },
              }
          }
        },
        title: {
          text: null
        },
        xAxis: {
          categories: [capitalizeFirstLetter(groupBy)],
          visible: true,
          allowDecimals: false
        },
        yAxis: {
          title: {
            text: null
          },
          allowDecimals:false,
          opposite: true,
          visible: true
        },
        series: series,
        legend: {
          enabled: false
        },
        tooltip: {
          useHTML: true,
          hideDelay: 50,
          formatter: function() {
            return getTooltip(timelineEvents, categoriesIndex, groupBy, this.series)
          }
        },
      }
    }
});
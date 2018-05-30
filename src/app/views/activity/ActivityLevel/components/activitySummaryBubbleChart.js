import {defineMessages} from 'react-intl';

import {ACTIVITY_LEVELS, partitionByActivityLevel} from "../activityLevel";
import {Chart, tooltipHtml} from '../../../../components/charts/index';
import {PointSelectionEventHandler} from "../../../../components/charts/eventHandlers/pointSelectionHandler";
import {displaySingular, i18n} from "../../../../meta";


const componentId = 'activitySummaryBubbleChart';

const messages = defineMessages({
  title:  {
    id: `${componentId}.title`,
    defaultMessage: '{subject} Activity Summary'
  }
});

const chartUpdateProps = props => ({
  model: props.model
});




const initSeries = props => {
  // Partition the data set by activity level and set the
  // initial visibility of the level. Initially we only set as visible
  // the most recent activity bucket for which there is any data
  // to show.

  let domainPartition = partitionByActivityLevel(props.model.data);

  return ACTIVITY_LEVELS.map((activity_level, index) => {
    const level_partition = domainPartition[activity_level.index];
    const seriesData = level_partition.data.map((activitySummary) => ({
      domain_id: activitySummary.id,
      name: activitySummary.entity_name,
      x: activitySummary.span,
      y: activitySummary.commit_count,
      z: activitySummary.contributor_count,
      days_since_latest_commit: activitySummary.days_since_latest_commit
    }));


    return(
      {
        type: 'bubble',
        allowPointSelect: props.onSelectionChange != null,
        key: index,
        id: index,
        color: activity_level.color,
        name: activity_level.display_name,
        data: seriesData,
        visible: level_partition.visible
      }
    )
  });
};


const mapPoints = (points, props) => {
  return points.map(point => props.model.data.find(
    activitySummary =>
      activitySummary.id === point.domain_id
  ));
};

const eventHandler = PointSelectionEventHandler;

const getConfig =  props => {
  const model = props.model;
  const intl = props.intl;
  const childContextName = displaySingular(intl, model.childContext);

  return {
    chart: {
      type: 'bubble',
      panning: true,
      panKey: 'shift',
      zoomType: 'xy'
    },
    title: {
      text: intl.formatMessage(messages.title, {subject: childContextName})
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      verticalAlign: 'middle',
      reversed: true
    },
    xAxis: {
      type: 'linear',
      title: {
        text: `${i18n(intl, 'History')} (${model.span_uom})`
      }
    },
    yAxis: {
      type: model.data.length > 1 ? 'logarithmic' : 'linear',
      id: 'commits',
      title: {
        text: `${i18n(intl, 'Number of commits')}`
      }
    },
    series: initSeries(props),
    tooltip: {
      useHTML: true,
      followPointer: false,
      hideDelay: 50,
      formatter: function(){
        return tooltipHtml({
          header: `${childContextName}: ${this.key}`,
          body: [
            [`${i18n(intl, 'Commits')}:`, `${intl.formatNumber(this.y)}`],
            [`${i18n(intl, 'History')}:`, `${intl.formatNumber(this.x, {maximumFractionDigits:0})} ${model.span_uom}`],
            [`${i18n(intl, 'Contributors')}:`, `${this.point ? intl.formatNumber(this.point.z) : ''}`]
          ]
        })
      }

    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: props.showDataLabels || true,
          format: `{point.name}`,
          inside: false,
          verticalAlign: 'bottom',
          style: {
            color: 'black',
            textOutline: 'none'
          }

        }
      }

    }
  }
};

export const ActivitySummaryBubbleChart = Chart({chartUpdateProps: chartUpdateProps, getConfig, eventHandler, mapPoints});




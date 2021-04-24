import {defineMessages} from 'react-intl.macro';

import {ACTIVITY_LEVELS, partitionByActivityLevel} from "../../../helpers/activityLevel";
import {Chart, tooltipHtml} from '../../../../../framework/viz/charts/index';
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {displaySingular, formatTerm, displayPlural} from "../../../../../i18n/index";

function getSubtitleText(intl, model) {
  const baseText = model.secondaryMeasureContext ? `Bubble size: ${displayPlural(intl, model.secondaryMeasureContext)}` : ``;
  return model.childCount > model.data.length ? `${baseText}<br/>Showing top ${model.data.length} of ${model.childCount} by commits` : baseText
}

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
      z: activitySummary.secondary_measure,
      labelrank: activitySummary.secondary_measure,
      days_since_latest_commit: activitySummary.days_since_latest_commit
    }));


    return(
      {
        allowPointSelect: props.onSelectionChange != null,
        key: index,
        id: index,
        color: activity_level.color,
        name: activity_level.display_name,
        data: seriesData,
        visible: level_partition.visible,
        zMin: 1,
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

const eventHandler = DefaultSelectionEventHandler;

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
    subtitle: {
      text: `${getSubtitleText(intl, model)}`
    },
    legend: {
      title: {
        text: 'Activity Levels<br/><span style="font-size: 10px; color: #666; font-weight: normal">Click to select</span>',
        style: {
          fontStyle: 'italic'
        }
      },
      align: 'right',
      layout: 'vertical',
      verticalAlign: 'middle',
      itemMarginBottom: 3,
      reversed: true,
    },
    xAxis: {
      type: 'linear',
      title: {
        text: `${formatTerm(intl, 'History')} (${model.span_uom})`
      }
    },
    yAxis: {
      type: model.data.length > 1 ? 'logarithmic' : 'linear',
      id: 'commits',
      title: {
        text: `${formatTerm(intl, 'Number of commits')}`
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
            [`${formatTerm(intl, 'Commits')}:`, `${intl.formatNumber(this.y)}`],
            [`${formatTerm(intl, 'History')}:`, `${intl.formatNumber(this.x, {maximumFractionDigits:0})} ${model.span_uom}`],
            model.secondaryMeasureContext?
              [`${displayPlural(intl, model.secondaryMeasureContext)}:`, `${this.point ? intl.formatNumber(this.point.z) : ''}`]
            : ['', '']
          ]
        })
      }

    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: props.suppressDataLabelsAt ? model.data.length < props.suppressDataLabelsAt : true,
          format: `{point.name}`,
          inside: true,
          verticalAlign: 'center',
          style: {
            color: 'black',
            textOutline: 'none'
          }

        }
      }

    }
  }
};

export const ActivityLevelsBubbleChart = Chart({chartUpdateProps: chartUpdateProps, getConfig, eventHandler, mapPoints});




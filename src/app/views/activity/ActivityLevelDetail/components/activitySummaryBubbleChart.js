import React from "react";
import type {Props} from "../model";
import {ACTIVITY_LEVELS, partitionByActivityLevel} from "../activityLevel";
import {
  tooltipHtml,
  ChartWrapper
} from '../../../../components/charts/index';



export class ActivitySummaryBubbleChart extends React.Component<Props> {
  static BOOST_THRESHOLD = 100;


  chart: any;
  selecting: string | null;
  selections: any;
  series: Array<Series>;
  plotOptions: any;

  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
      config: ActivitySummaryBubbleChart.getConfig(props)
    }

    this.chart = null;
    this.selecting = null;
    this.plotOptions = {};
    this.selections = {};
  }

  setChart = chart => {
    this.chart = chart;
  };

  static getDerivedPropsFromState(nextProps, prevState){
    if(nextProps.model !== prevState.model) {
      return {
        model: nextProps.model,
        config: ActivitySummaryBubbleChart.getConfig(nextProps)
      }
    }
    return null;
  }

  attachEventHandlers(){
    const self = this;
    const config = this.state.config;
    config.plotOptions.series.events = {
      hide: function () {
        // `this` is bound to the series when this callback is invoked
        // so we need to redispatch this to the actual plot instance using
        // a new name self that is looked up from the closure of this callback.
        self.onSeriesHide()
      },
      show: function () {
        self.onSeriesShow()
      },
    };
    config.chart.onClick = this.pointClicked.bind(this);

  }

  componentDidUpdate() {
    this.attachEventHandlers();
  }

  componentDidMount() {
    //this.attachEventHandlers();
  }

  static initSeries(props) {
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
          boostThreshold: ActivitySummaryBubbleChart.BOOST_THRESHOLD,
          allowPointSelect: props.onActivitiesSelected != null,
          key: index,
          id: index,
          color: activity_level.color,
          name: activity_level.display_name,
          data: seriesData,
          visible: level_partition.visible
        }
      )
    });
  }

  zoom = e => {
    if (e.resetSelection) {
      this.selections['zoom'] = null;
      this.onSelectionChange()
    }
    else {
      this.selections['zoom'] = {
        x_min: e.xAxis[0].min,
        x_max: e.xAxis[0].max,
        y_min: e.yAxis[0].min,
        y_max: e.yAxis[0].max
      };

      this.onSelectionChange();
    }
  };

  pointClicked = e => {
    const selected = this.chart.getSelectedPoints();
    if (!selected.find(point => e.point === point)) {
      this.selecting = 'select';
      if (e.shiftKey) {
        this.selections['selected'] = [e.point, ...selected];
      } else {
        this.selections['selected'] = [e.point]
      }
      this.onSelectionChange()
    } else {
      this.selecting = 'deselect';
      this.selections['selected'] = null;
      this.onSelectionChange();
    }

  };


  static getConfig(props) {
    const model = props.model;
    return {
      chart: {
        type: 'bubble',
        panning: true,
        panKey: 'shift',
        zoomType: 'xy',
        events: {
          selection: ActivitySummaryBubbleChart.zoom
        }
      },
      title: {
        text: `${model.subject_label_long} Activity Summary`
      },
      subTitle: {
        text: `${model.level_label}: ${model.level}`
      },
      xAxis: {
        type: 'linear',
        title: {
          text: `Timespan (${model.span_uom})`
        }
      },
      yAxis: {
        type: 'logarithmic',
        id: 'commits',
        title: {
          text: `Number of commits`
        }
      },
      series: ActivitySummaryBubbleChart.initSeries(props),
      toolTip: {
        useHTML: true,
        followPointer: true,
        formatter: point => (
          tooltipHtml({
            header: `${model.subject_label_long}: ${point.key}`,
            body: [
              ['Commits: ', `${point.y}`],
              ['Timespan:', `${point.x.toLocaleString()} ${model.span_uom}`],
              ['Contributors:', `${point.point ? point.point.z : ''}`]
            ]
          })
        )
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: `{point.name}`,
            inside: false,
            verticalAlign: 'bottom',
            style: {
              color: 'black',
              textOutline: 'none'
            }

          }
        },

      }
    }
  }

  render() {
    return (
      <ChartWrapper config={this.state.config} afterRender={this.setChart} />
    )
  }









  onSeriesShow() {
    this.onSelectionChange()

  }

  onSeriesHide() {
    this.onSelectionChange()
  }

  pointsToActivities(points) {
    return points.map(point => this.props.model.data.find(
      activitySummary =>
        activitySummary.id === point.domain_id
    ));
  }

  showSelected() {
    if (this.selections['selected'] != null) {
      return this.pointsToActivities(this.selections['selected']);
    } else {
      const visible = this.chart.series.filter((series) => series.visible);
      const selected = [];
      const zoom = this.selections['zoom'];
      for (let i = 0; i < visible.length; i++) {
        let points = visible[i].options.data;
        if (zoom != null) {
          for (let j = 0; j < points.length; j++) {
            let point = points[j];
            if (point.x >= zoom.x_min && point.x <= zoom.x_max && point.y >= zoom.y_min && point.y <= zoom.y_max) {
              selected.push(point);
            }
          }
        } else {
          selected.push(...points);
        }
      }
      return this.pointsToActivities(selected)
    }
  }


  onSelectionChange() {
    if (this.props.onActivitiesSelected) {
      this.props.onActivitiesSelected(this.showSelected());
    }
  }




  shouldComponentUpdate() {
    if (this.selecting != null) {
      if (this.selecting === 'select') {
        this.chart.redraw();
        return false;
      } else {
        this.selecting = null;
        this.chart.redraw();
        return false;
      }

    } else {
      return true;
    }
  }








}
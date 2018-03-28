import React from "react";
import type {Props} from "../types";
import {ACTIVITY_LEVELS, partitionByActivityLevel} from "../activityLevel";
import {
  BubbleSeries,
  Chart,
  HighchartsChart,
  LegendRight,
  Series,
  Subtitle,
  Title,
  Tooltip,
  tooltipHtml,
  XAxis,
  YAxis,
} from '../../../charts';



export class ActivitySummaryBubbleChart extends React.Component<Props> {
  static BOOST_THRESHOLD = 100;


  chart: any;
  selecting: string | null;
  selections: any;
  series: Array<Series>;
  plotOptions: any;

  constructor(props) {
    super(props);
    this.chart = null;
    this.selecting = null;
    this.series = [];
    this.plotOptions = {};
    this.selections = {};
  }

  setChart = chart => {
    this.chart = chart;
  };


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

  onSeriesShow() {
    this.onSelectionChange()

  }

  onSeriesHide() {
    this.onSelectionChange()
  }

  pointsToActivities(points) {
    return points.map(point => this.props.viz_domain.data.find(
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


  initSeries() {
    const self = this;
    this.plotOptions['series'] = {
      dataLabels: {
        enabled: true,
        format: `{point.name}`,
        inside: false,
        verticalAlign: 'bottom',
        style: {
          color: 'black',
          textOutline: 'none'
        }

      },
      events: {
        hide: function () {
          // `this` is bound to the series when this callback is invoked
          // so we need to redispatch this to the actual plot instance using
          // a new name self that is looked up from the closure of this callback.
          self.onSeriesHide()
        },
        show: function () {
          self.onSeriesShow()
        },
      }
    };


    // Partition the data set by activity level and set the
    // initial visibility of the level. Initially we only set as visible
    // the most recent activity bucket for which there is any data
    // to show.

    let domainPartition = partitionByActivityLevel(this.props.viz_domain.data);

    this.series = ACTIVITY_LEVELS.map((activity_level, index) => {
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
        <BubbleSeries
          boostThreshold={ActivitySummaryBubbleChart.BOOST_THRESHOLD}
          allowPointSelect={this.props.onActivitiesSelected != null}
          onClick={this.pointClicked}
          key={index}
          id={index}
          color={activity_level.color}
          name={activity_level.display_name}
          data={seriesData}
          visible={level_partition.visible}
        />
      )
    });
  }

  componentWillMount() {
    this.initSeries();
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


  formatTooltip(point) {
    const viz_domain = this.props.viz_domain;
    return tooltipHtml({
      header: `${viz_domain.level}: ${point.key}`,
      body: [
        ['Commits: ', `${point.y}`],
        ['Timespan:', `${point.x} (${viz_domain.span_uom})`],
        ['Contributors:', `${point.point ? point.point.z : ''}`]
      ]
    });
  }



  render() {
    const viz_domain = this.props.viz_domain;
    const axesType = this.props.viz_domain.data.length > ActivitySummaryBubbleChart.BOOST_THRESHOLD ? 'logarithmic' : 'linear';
    const title = `Activity Summary`;
    return (
      <HighchartsChart
        plotOptions={this.plotOptions}
        callback={this.setChart}
      >
        <Chart
          zoomType={'xy'}
          panning={true}
          panKey={'shift'}
          onSelection={this.zoom.bind(this)}
        />
        <Title>{title}</Title>

        <Subtitle>{`Company: ${viz_domain.subject}`}</Subtitle>
        <LegendRight reversed={true}/>
        <Tooltip
          useHTML={true}
          followPointer={true}
          formatter={this.formatTooltip.bind(this)}
        />
        <XAxis type={'axesType'}>
          <XAxis.Title>{`Timespan (${viz_domain.span_uom})`}</XAxis.Title>
        </XAxis>

        <YAxis
          id="commits"
          type={axesType}
        >
          <YAxis.Title>Number of commits</YAxis.Title>
        </YAxis>

        {this.series}
      </HighchartsChart>
    );
  }
}
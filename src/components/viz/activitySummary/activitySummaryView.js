// @flow
import React, {Fragment} from 'react';
import {
  BubbleSeries,
  ColumnSeries,
  Chart,
  HighchartsChart,
  LegendRight,
  Series,
  Subtitle,
  TimelineSeries,
  Title,
  Tooltip,
  tooltipHtml,
  XAxis,
  YAxis,

} from '../../charts';

import {VizItem, VizRow} from "../containers/layout";
import {withMaxMinViews} from "../helpers/viewSelectors";
import {formatDate, formatPolarisTimestamp} from "../../../helpers/utility";
import {Table} from '../containers/table';

import {CustomTabPanel, Tab, TabList, Tabs} from '../containers/tab';


import type {ActivitySummary, Props} from './types'
import {activity_levels, getActivityLevel} from "./activityLevel";


class ActivitySummaryScatterPlot extends React.Component<Props> {
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
        verticalAlign: 'bottom'

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

    const seriesData = this.props.viz_domain.data.map((activitySummary) => ({
      domain_id: activitySummary.id,
      name: activitySummary.entity_name,
      x: activitySummary.span,
      y: activitySummary.commit_count,
      z: activitySummary.contributor_count,
      days_since_latest_commit: activitySummary.days_since_latest_commit
    }));
    


    this.series = activity_levels.map((activity_level, index) => (
      <BubbleSeries
        boostThreshold={ActivitySummaryScatterPlot.BOOST_THRESHOLD}
        allowPointSelect={this.props.onActivitiesSelected != null}
        onClick={this.pointClicked}
        key={index}
        id={index}
        color={activity_level.color}
        name={activity_level.display_name}
        data={seriesData.filter(activity_level.isMember)}
        visible={activity_level.visible}
      />
    ))
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
    const axesType = this.props.viz_domain.data.length > ActivitySummaryScatterPlot.BOOST_THRESHOLD ? 'logarithmic' : 'linear';
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
        <Title>{`${viz_domain.level} Landscape`}</Title>

        <Subtitle>{`Company: ${viz_domain.subject}`}</Subtitle>
        <LegendRight reversed={true}/>
        <Tooltip
          useHTML={true}
          followPointer={false}
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


class ActivitySummaryTimelinePlot extends React.Component<Props> {
  sortedDomainData: Array<ActivitySummary>;

  constructor(props) {
    super(props);
    this.sortedDomainData = [];
  }

  getSeries() {
    const seriesData = this.sortedDomainData.map((activitySummary, index) => ({
      x: activitySummary.earliest_commit.valueOf(),
      x2: activitySummary.latest_commit.valueOf(),
      y: index, 
      color: getActivityLevel(activitySummary).color
    }));
    return [
      <TimelineSeries
        key="activitytimeline"
        id="activitytimeline"
        name={this.props.viz_domain.level}
        data={seriesData}
        maxPointWidth={10}
        turboThreshold={0}
      />
    ];
  }

  formatTooltip(point) {
    const viz_domain = this.props.viz_domain;
    return tooltipHtml({
      header: `${viz_domain.level}: ${point.point.yCategory}`,
      body: [
        ['Earliest Commit: ', `${formatDate(point.point.x, 'MM-DD-YYYY')}`],
        ['Latest Commit: ', `${formatDate(point.point.x2, 'MM-DD-YYYY')}`],
      ]
    });
  }

  render() {
    const viz_domain = this.props.viz_domain;
    const domain_data = this.props.selectedActivities || viz_domain.data.filter(activitySummary => activitySummary.activity_level.visible);
    this.sortedDomainData = domain_data.sort((a, b) => a.earliest_commit.valueOf() - b.earliest_commit.valueOf());
    const entities = this.sortedDomainData.map((activitySummary) => activitySummary.entity_name);


    return (
      <HighchartsChart>
        <Chart/>

        <Tooltip
          useHTML={true}
          formatter={this.formatTooltip.bind(this)}
        />

        <XAxis type={'datetime'}>
          <XAxis.Title>{`Timeline`}</XAxis.Title>
        </XAxis>

        <YAxis
          id="projects"
          categories={entities}
          reversed={true}
        >
          <YAxis.Title>{viz_domain.level}</YAxis.Title>
        </YAxis>

        {this.getSeries()}
      </HighchartsChart>
    );
  }
}

const ActivitySummaryTable = (props: Props) => {
  const tableData = props.selectedActivities || props.viz_domain.data.filter(activitySummary => activitySummary.activity_level.visible);

  return (
    <Table
      data={tableData.sort((a, b) => b.activity_level.priority - a.activity_level.priority)}
      columns={[{
        id: 'col-activity-level',
        Header: 'Activity Level',
        headerStyle:{width:'50px'},
        accessor: activitySummary => getActivityLevel(activitySummary).color,

        Cell: row => (
          <div style={{
            width: "100%",
            height: "100%",
            backgroundColor: row.value,
            borderRadius: '2px'
          }}>
          </div>
        )
      },{
        id: 'col-entity-name',
        Header: `${props.viz_domain.level}`,
        accessor: 'entity_name',
      },{
        Header: `Commits`,
        accessor: 'commit_count',
      }, {
        Header: `Contributors`,
        accessor: 'contributor_count',
      }, {
        id: 'earliest-commit-col',
        Header: `Earliest Commit`,
        accessor: activitySummary => formatPolarisTimestamp(activitySummary.earliest_commit),
      }, {
        id: 'latest-commit-col',
        Header: `Latest Commit`,
        accessor: activitySummary => formatPolarisTimestamp(activitySummary.latest_commit),
      }, {
        Header: `Timespan (${props.viz_domain.span_uom}`,
        accessor: 'span',
      }]}
      defaultPageSize={10}
      className="-striped -highlight"
    />
  )
};

const TotalsChart = (props: Props) => {
  const totalsByActivityLevel = props.viz_domain.data.reduce(
    (totals, activitySummary) => {
      let level = activitySummary.activity_level.display_name;
      totals[level] = (totals[level] || 0) + 1;
      return totals
  },
    {});
  const series = [...activity_levels].reverse().map(activityLevel => (
    <ColumnSeries
      name={activityLevel.display_name}
      data={[totalsByActivityLevel[activityLevel.display_name]]}
      color={activityLevel.color}
    />
  ));

  const formatTooltip = (point) => {
    return tooltipHtml({
      header: `${point.series.name}`,
      body: [
        [`${point.percentage.toFixed(0)}%`]
      ]
    });
  };

  return (
    <HighchartsChart plotOptions={{
      series: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          format:`{point.y}`,
          rotation: 270
        }
      }
    }}>
      <Chart
        type={'column'}
      />
      <Title>Totals</Title>

      <Tooltip
        useHTML={true}
        formatter={formatTooltip}
        valueDecimals={0}
      />

      <XAxis
        categories={['']}
        visible={false}
        allowDecimals={false}
      />


      <YAxis
        id="totals"
        visible={true}
        allowDecimals={false}
        gridLineWidth={0}
      >
      </YAxis>
      {series}
    </HighchartsChart>
  )
};


const DetailTabs = (props) => (
  <Tabs>
    <TabList>
      <Tab>Timelines</Tab>
      <Tab>Totals</Tab>
    </TabList>

    <CustomTabPanel>
      <ActivitySummaryTimelinePlot {...props}/>
    </CustomTabPanel>
    <CustomTabPanel>
      <TotalsChart {...props}/>
    </CustomTabPanel>
  </Tabs>
);

const MaxViewFull = (props) => (
  <Fragment>
    <VizRow h={"60%"}>
      <VizItem w={0.07}>
        <TotalsChart {...props}/>
      </VizItem>
      <VizItem w={0.5}>
        <ActivitySummaryScatterPlot {...props}/>
      </VizItem>
      <VizItem w={0.43}>
        <DetailTabs {...props}/>
      </VizItem>
    </VizRow>
    <VizRow h={"40%"}>
      <VizItem w={1}>
        <ActivitySummaryTable {...props}/>
      </VizItem>
    </VizRow>
  </Fragment>
);


type MaxViewState = {
  selected: Array<ActivitySummary> | null
}

class ActivitySummaryMaxView extends React.Component<Props, MaxViewState> {

  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
  }

  onActivitiesSelected(activities) {
    this.setState({
      selected: activities
    })
  }


  render() {
    return (
        <MaxViewFull
          onActivitiesSelected={this.onActivitiesSelected.bind(this)}
          selectedActivities={this.state.selected}
          {...this.props}
        />
    );
  }
}

export const ActivitySummaryViz = withMaxMinViews({
  minimized: ActivitySummaryScatterPlot,
  maximized: ActivitySummaryMaxView
});

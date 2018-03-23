// @flow
import React, {Fragment} from 'react';
import {
  HighchartsChart,
  Chart,
  BubbleSeries,
  TimelineSeries,
  Title,
  Tooltip,
  tooltipHtml,
  Subtitle,
  LegendRight,
  XAxis,
  YAxis,
  Debug
} from '../../charts';
import {DashboardItem, DashboardRow} from "../../../containers/Dashboard/index";
import {withMaxMinViews} from "../helpers/viewSelectors";
import {formatDate, formatPolarisTimestamp} from "../../../helpers/utility";
import ReactTable from 'react-table';
import "react-table/react-table.css";


type ActivitySummary = {
  entity_name: string,
  commit_count: number,
  contributor_count: number,
  earliest_commit: Date,
  latest_commit: Date,
  span: number
}
type VizDomain = {
  data: Array<ActivitySummary>,
  level: string,
  subject: string,
  span_uom: string

}
type Props = {
  viz_domain: VizDomain,
  onActivitiesSelected: (any) => void,
  selectedActivities: Array<ActivitySummary>
}

class ActivitySummaryScatterPlot extends React.Component<Props> {
  static BOOST_THRESHOLD = 30;

  chart: any;

  setChart = chart => {
    this.chart = chart;
  };


  selectedPoints = e => {
    if (e.resetSelection) {
      console.log("Selection reset");
      this.onPointsSelected([])
    }
    else {
      const selected = this.chart.series[0].points.filter((point) => (
        point.x >= e.xAxis[0].min && point.x <= e.xAxis[0].max &&
        point.y >= e.yAxis[0].min && point.y <= e.yAxis[0].max
      ));
      console.log(`${selected ? selected.length : 'empty'} points selected`);

      this.onPointsSelected(selected);
    }
  };

  onPointsSelected(selected) {
    const activitySummaries = selected.map(point => this.props.viz_domain.data.find(
      activitySummary =>
        activitySummary.span === point.x &&
        activitySummary.commit_count === point.y
    ));
    this.props.onActivitiesSelected(activitySummaries)
  }

  getSeries() {
    const seriesData = this.props.viz_domain.data.map((activitySummary) => ({
      name: activitySummary.entity_name,
      x: activitySummary.span,
      y: activitySummary.commit_count,
      z: activitySummary.contributor_count
    }));
    return [
      <BubbleSeries
        boostThreshold={ActivitySummaryScatterPlot.BOOST_THRESHOLD}
        allowPointSelect={true}
        key={this.props.viz_domain.subject}
        id={this.props.viz_domain.subject}
        name={this.props.viz_domain.subject}
        data={seriesData}
      />
    ];
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
      <HighchartsChart callback={this.setChart}>
        <Chart
          zoomType={'xy'}
          panning={true}
          panKey={'shift'}
          onSelection={this.selectedPoints}
        />
        <Title>{`${viz_domain.level} Landscape`}</Title>

        <Subtitle>{`Company: ${viz_domain.subject}`}</Subtitle>
        <LegendRight/>
        <Tooltip
          shared={true}
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

        {this.getSeries()}
        <Debug varName={"activityBubble"}/>
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
      y: index
    }));
    return [
      <TimelineSeries
        key="activitytimeline"
        id="activitytimeline"
        name={this.props.viz_domain.level}
        data={seriesData}
        maxPointWidth={10}
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
    const domain_data = (this.props.selectedActivities && this.props.selectedActivities.length > 0) ?
      this.props.selectedActivities : viz_domain.data;
    this.sortedDomainData = domain_data.sort((a, b) => a.earliest_commit.valueOf() - b.earliest_commit.valueOf());
    const entities = this.sortedDomainData.map((activitySummary) => activitySummary.entity_name);


    return (
      <HighchartsChart>
        <Chart/>
        <Title>{`${viz_domain.level} Timelines`}</Title>

        <Subtitle>{`Company: ${viz_domain.subject}`}</Subtitle>

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
          visible={domain_data.length <= 10}
        >
          <YAxis.Title>{viz_domain.level}</YAxis.Title>
        </YAxis>

        {this.getSeries()}
        <Debug varName={"activityTimeline"}/>
      </HighchartsChart>
    );
  }
}

const ActivitySummaryTable = (props: Props) => {
  const tableData = (props.selectedActivities && props.selectedActivities.length > 0) ?
        props.selectedActivities : props.viz_domain.data;

  return (<ReactTable data={tableData} columns={[{
      Header: `${props.viz_domain.level}`,
      accessor: 'entity_name',
    }, {
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
                      style={{
                        height: "110%" // This will force the table body to overflow and scroll, since there is not enough room
                      }}
    />
  )
};

const MaxViewManyPoints = (props) => (
  <Fragment>
    <DashboardRow h={"50%"}>
      <DashboardItem w={1}>
        <ActivitySummaryScatterPlot {...props}/>
      </DashboardItem>
    </DashboardRow>
    <DashboardRow h={"50%"}>
      <DashboardItem w={1}>
        <ActivitySummaryTable {...props}/>
      </DashboardItem>
    </DashboardRow>
  </Fragment>
);

const MaxViewFull = (props) => (
  <Fragment>
    <DashboardRow h={"50%"}>
      <DashboardItem w={1 / 2}>
        <ActivitySummaryScatterPlot {...props}/>
      </DashboardItem>
      <DashboardItem w={1 / 2}>
        <ActivitySummaryTimelinePlot {...props}/>
      </DashboardItem>
    </DashboardRow>
    <DashboardRow h={"50%"}>
      <DashboardItem w={1}>
        <ActivitySummaryTable {...props}/>
      </DashboardItem>
    </DashboardRow>
  </Fragment>
);


type MaxViewState = {
  selected: Array<ActivitySummary>
}

class ActivitySummaryMaxView extends React.Component<Props, MaxViewState> {
  static FULL_VIEW_MAX_THRESHOLD = 20;

  constructor(props) {
    super(props);
    this.state = {
      selected: []
    }
  }

  onActivitiesSelected(activities) {
    this.setState({
      selected: activities
    })
  }


  render() {
    return (
      this.props.viz_domain.data.length > ActivitySummaryMaxView.FULL_VIEW_MAX_THRESHOLD ?
        <MaxViewManyPoints
          onActivitiesSelected={this.onActivitiesSelected.bind(this)}
          selectedActivities={this.state.selected}
          {...this.props} />
        :
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

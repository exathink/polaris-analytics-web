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
import {formatDate} from "../../../helpers/utility";

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
  viz_domain: VizDomain
}

class ActivitySummaryScatterPlot extends React.Component<Props> {
  static BOOST_THRESHOLD = 30;

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
      header:  `${viz_domain.level}: ${point.key}`,
      body:[
        ['Commits: ', `${point.y}`],
        ['Timespan:', `${point.x} (${viz_domain.span_uom})`],
        ['Contributors:', `${point.point.z}`]
      ]});
  }

  render() {
    const viz_domain = this.props.viz_domain;
    const axesType = this.props.viz_domain.data.length > ActivitySummaryScatterPlot.BOOST_THRESHOLD ? 'logarithmic' : 'linear';
    return (
      <HighchartsChart>
        <Chart/>
        <Title>{`${viz_domain.level} Landscape`}</Title>

        <Subtitle>{`Company: ${viz_domain.subject}`}</Subtitle>
        <LegendRight/>
        <Tooltip
          shared={true}
          useHTML={true}
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

  constructor(props) {
    super(props);
    this.sortedDomainData = null;
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
      header:  `${viz_domain.level}: ${point.point.yCategory}`,
      body:[
          ['Earliest Commit: ', `${formatDate(point.point.x, 'MM-DD-YYYY')}`],
          ['Latest Commit: ', `${formatDate(point.point.x2, 'MM-DD-YYYY')}`],
    ]});
  }

  render() {
    const viz_domain = this.props.viz_domain;
    this.sortedDomainData = viz_domain.data.sort((a,b)=>a.earliest_commit.valueOf() - b.earliest_commit.valueOf());
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
          visible={viz_domain.data.length <= 10}
        >
          <YAxis.Title>{viz_domain.level}</YAxis.Title>
        </YAxis>

        {this.getSeries()}
        <Debug varName={"activityTimeline"}/>
      </HighchartsChart>
    );
  }
}

const MaxViewScatterOnly = (props) => (
  <Fragment>
    <DashboardRow h={"100%"}>
      <DashboardItem w={1}>
        <ActivitySummaryScatterPlot {...props}/>
      </DashboardItem>
    </DashboardRow>
  </Fragment>
);

const MaxViewFull = (props) => (
  <Fragment>
    <DashboardRow h={"50%"}>
      <DashboardItem w={1/2}>
        <ActivitySummaryScatterPlot {...props}/>
      </DashboardItem>
      <DashboardItem w={1/2}>
        <ActivitySummaryTimelinePlot {...props}/>
      </DashboardItem>
    </DashboardRow>
  </Fragment>
);

class ActivitySummaryMaxView extends React.Component<Props> {
  static FULL_VIEW_MAX_THRESHOLD = 20;
  render() {
    return (
      this.props.viz_domain.data.length > ActivitySummaryMaxView.FULL_VIEW_MAX_THRESHOLD ?
        <MaxViewScatterOnly {...this.props} />
        :
        <MaxViewFull {...this.props}/>
    );
  }
}

export const ActivitySummaryViz = withMaxMinViews({
  minimized: ActivitySummaryScatterPlot,
  maximized: ActivitySummaryMaxView
});

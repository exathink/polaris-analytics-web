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
  YAxis
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

  getSeries() {
    const seriesData = this.props.viz_domain.data.map((activitySummary) => ({
      name: activitySummary.entity_name,
      x: activitySummary.span,
      y: activitySummary.commit_count,
      z: activitySummary.contributor_count
    }));
    return [
      <BubbleSeries
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

        <XAxis>
          <XAxis.Title>{`Timespan (${viz_domain.span_uom})`}</XAxis.Title>
        </XAxis>

        <YAxis id="commits">
          <YAxis.Title>Number of commits</YAxis.Title>
        </YAxis>

        {this.getSeries()}

      </HighchartsChart>
    );
  }
}


class ActivitySummaryTimelinePlot extends React.Component<Props> {

  getSeries() {
    const seriesData = this.props.viz_domain.data.map((activitySummary, index) => ({
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
    const entities = viz_domain.data.map((activitySummary) => activitySummary.entity_name);


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
        >
          <YAxis.Title>{viz_domain.level}</YAxis.Title>
        </YAxis>

        {this.getSeries()}
      </HighchartsChart>
    );
  }
}


class ActivitySummaryMaxView extends React.Component<Props> {
  render() {
    return (
      <Fragment>
        <DashboardRow h={"50%"}>
          <DashboardItem w={1 / 2}>
            <ActivitySummaryScatterPlot {...this.props}/>
          </DashboardItem>
          <DashboardItem w={1 / 2}>
            <ActivitySummaryTimelinePlot {...this.props}/>
          </DashboardItem>
        </DashboardRow>
        <DashboardRow h={"50%"}>
          <DashboardItem w={1 / 2}>
            <ActivitySummaryScatterPlot {...this.props}/>
          </DashboardItem>
          <DashboardItem w={1 / 2}>
            <ActivitySummaryScatterPlot {...this.props}/>
          </DashboardItem>
        </DashboardRow>
      </Fragment>
    );
  }
}

export const ActivitySummaryViz = withMaxMinViews({
  minimized: ActivitySummaryScatterPlot,
  maximized: ActivitySummaryMaxView
});

// @flow
import React, {Fragment} from 'react';
import {
  HighchartsChart,
  Chart,
  BubbleSeries,
  TimelineSeries,
  Title,
  Tooltip,
  HtmlTooltip,
  Subtitle,
  LegendRight,
  XAxis,
  YAxis,
  Debug
} from '../../charts';
import {DashboardItem, DashboardRow} from "../../../containers/Dashboard/index";
import {withMaxMinViews} from "../helpers/viewSelectors";

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
    return this.props.viz_domain.data.map((activitySummary) => (
      <BubbleSeries key={activitySummary.entity_name} id={activitySummary.entity_name}
                    name={activitySummary.entity_name} data={[{
        name: activitySummary.entity_name,
        x: activitySummary.span,
        y: activitySummary.commit_count,
        z: activitySummary.contributor_count,
      }]}/>));
  }


  render() {
    const viz_domain = this.props.viz_domain;
    return (
      <HighchartsChart>
        <Chart/>
        <Title>{`${viz_domain.level} Landscape`}</Title>

        <Subtitle>{`Company: ${viz_domain.subject}`}</Subtitle>
        <LegendRight/>
        <HtmlTooltip
          shared={true}
          header={`${viz_domain.level}: {point.key}`}
          body={[
            ['Commits: ', '{point.y}'],
            ['Timespan:', `{point.x} (${viz_domain.span_uom})`],
            ['Contributors:', '{point.z}']
          ]}
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
          xDateFormat={'%m-%d-%Y'}
          headerFormat={"<span>{series.name}: {point.yCategory}</span><br/><br/><table>" +
          "<tr><td style=\"text-align: left\">Earliest Commit: </td><td style=\"text-align: left\">{point.x}</td>" +
          "<tr><td style=\"text-align: left\">Latest Commit: </td><td style=\"text-align: left\">{point.x2}</td>"
          }
          pointFormat={""}
          footerFormat={"</table>"}
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
        <Debug/>
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

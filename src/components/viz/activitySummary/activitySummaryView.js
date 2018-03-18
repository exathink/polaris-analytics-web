// @flow
import React from 'react';

import {HighchartsChart, Chart, BubbleSeries, Title, HtmlTooltip, Subtitle, LegendRight, XAxis, YAxis} from '../../charts';


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

class ActivitySummaryView extends React.Component<Props> {

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

export const ActivitySummaryViz = ActivitySummaryView
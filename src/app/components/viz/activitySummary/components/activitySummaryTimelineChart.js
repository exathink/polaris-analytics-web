import React from "react";
import type {ActivitySummary, Props} from "../types";
import {findVisibleLevels, getActivityLevel} from "../activityLevel";
import {tooltipHtml, TimelineSeries, HighchartsChart, Chart, Tooltip, XAxis, YAxis} from "../../../charts";
import {formatDate} from "../../../../helpers/utility";

export class ActivitySummaryTimelineChart extends React.Component<Props> {
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
      header: `${viz_domain.subject_label_long}: ${point.point.yCategory}`,
      body: [
        ['Earliest Commit: ', `${formatDate(point.point.x, 'MM-DD-YYYY')}`],
        ['Latest Commit: ', `${formatDate(point.point.x2, 'MM-DD-YYYY')}`],
      ]
    });
  }

  render() {
    const viz_domain = this.props.viz_domain;
    const domain_data = this.props.selectedActivities || findVisibleLevels(viz_domain.data);
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
          <YAxis.Title>{viz_domain.subject_label}</YAxis.Title>
        </YAxis>

        {this.getSeries()}
      </HighchartsChart>
    );
  }


}
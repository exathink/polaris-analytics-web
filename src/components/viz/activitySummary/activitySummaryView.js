// @flow
import React from 'react';
import Highcharts from 'highcharts';
import { withHighcharts, Debug, HighchartsChart, Chart, Title, Tooltip, Subtitle, Legend, XAxis, YAxis,  BubbleSeries  } from 'react-jsx-highcharts';
import Dimensions from 'react-dimensions';


require ('highcharts/highcharts-more')(Highcharts);


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
  isMaximized: boolean,
  containerHeight: number,
  containerWidth: number
}


const plotOptions = {
  series: {
    pointStart: 2010
  }
};

class ActivitySummaryView extends React.Component<Props> {
  chart: any;

  constructor(props) {
    super(props);
    this.chart = null;
  }


  setChart = chart => {
    this.chart = chart;
  };



  render() {
    console.log("rendering viz...");
    const viz_domain = this.props.viz_domain;
    const bubbles = viz_domain.data.map((activitySummary) => (
      <BubbleSeries key={activitySummary.entity_name} id={activitySummary.entity_name}
                    name={activitySummary.entity_name} data={[{
        name: activitySummary.entity_name,
        x: activitySummary.span,
        y: activitySummary.commit_count,
        z: activitySummary.contributor_count,
      }]}/>));
    return (
          <HighchartsChart plotOptions={plotOptions} callback={this.setChart}>
            <Chart width={this.props.containerWidth} height={this.props.containerHeight}/>

            <Title align={'left'}>{`${viz_domain.level} Landscape`}</Title>

            <Subtitle align={'left'}>{`Company: ${viz_domain.subject}`}</Subtitle>
            <Legend
              align={'right'}
              layout={'vertical'}
              verticalAlign={'middle'}
            />
            <Tooltip shared={true}
                     useHTML={true}
                     headerFormat='<small>{point.key}</small><table>'
                     pointFormat={
                       '<tr><td>commits: </td><td style="text-align: right"><b>{point.x}</b></td></tr>' +
                       `<tr><td>${viz_domain.span_uom}</td><td style="text-align: right"><b>{point.y}</b></td></tr>` +
                       '<tr><td>contributors</td><td style="text-align: right"><b>{point.z}</b></td></tr>'
                     }
                     footerFormat={'</table>'}
                     valueDecimals={2}
            />

            <XAxis>
              <XAxis.Title>{`Timespan (${viz_domain.span_uom})`}</XAxis.Title>
            </XAxis>

            <YAxis id="number">
              <YAxis.Title>Number of commits</YAxis.Title>
            </YAxis>
            {bubbles}
            <Debug/>
          </HighchartsChart>
    );
  }

}
export const ActivitySummaryViz = withHighcharts(Dimensions({elementResize: true})(ActivitySummaryView), Highcharts);
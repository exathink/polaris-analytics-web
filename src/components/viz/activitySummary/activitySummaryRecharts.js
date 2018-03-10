// @flow
import React from 'react';
import {ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';


type activitySummary = {
  entity_name: string,
  commit_count: number,
  contributor_count: number,
  earliest_commit: Date,
  latest_commit: Date,
  span: number
}
type VizDomain = {
  data: Array<activitySummary>,
  level: string,
  subject: string,
  span_uom: string

}
type Props = {
  viz_domain: VizDomain,
  containerHeight: number,
  containerWidth: number
}

export class ActivitySummaryRecharts extends React.Component<Props> {
  render () {
    const { viz_domain } = this.props;
    return (
      <ResponsiveContainer>
        <ScatterChart>
          <XAxis  type="number" dataKey={'span'} name='days'/>
          <YAxis  type="number" dataKey={'commit_count'} name='commits'/>
          <ZAxis dataKey={'contributor_count'} range={[60, 400]} name='contributors'/>
          <CartesianGrid />
          <Tooltip cursor={{strokeDasharray: '3 3'}}/>
          <Scatter name={viz_domain.subject} data={viz_domain.data} fill='#8884d8' shape="circle"/>
        </ScatterChart>
      </ResponsiveContainer>
    );
  }
}







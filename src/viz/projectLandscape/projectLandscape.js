import React from 'react';

import {ScatterChart, ResponsiveContainer, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, LabelList} from 'recharts';

export default class ProjectLandscape extends React.Component {

  static viz_domains(props){
    return [
      `project-summary/${props.account.company}`
    ];
  }

  mapData(viz_data) {
    if (viz_data) {
      return viz_data.map((data_point) => ({
        x: data_point.commit_count,
        y: data_point.contributor_count,
        z: data_point.contributor_count,
        label: data_point.project,
      }))
    }
  }

  render() {

    let viz_domain = ProjectLandscape.viz_domains(this.props)[0];
    let viz_data = this.props.viz_data.get(viz_domain);
    let chart_data = this.mapData(viz_data);
    return (
        <ResponsiveContainer width="100%" height="100%" >
          <ScatterChart
            margin={{
              top: 20, right: 20, bottom: 10, left: 10
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" name="Commits" unit="" />
            <YAxis dataKey="y" name="Contributors" unit="" />
            <ZAxis dataKey="z" range={[64, 144]} name="Contributors" unit="km" />
            <Tooltip cursor={{strokeDasharray: '3 3'}} />
            <Legend />
            <Scatter
              name={`${this.props.account.company} Project Landscape`}
              data={chart_data}
              fill="#8884d8"
            >
              <LabelList dataKey="label" position="top" />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
    )
  }
}


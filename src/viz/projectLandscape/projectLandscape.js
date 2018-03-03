import React from 'react';

import {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

export default class ProjectLandscape extends React.Component {

  static viz_domain(props){
    return `project-summary/${props.account.company}`;
  }

  static mapData(viz_data) {
    if (viz_data) {
      return viz_data.map((data_point) => ({
        x: data_point.commit_count,
        y: data_point.contributor_count,
        z: 30
      }))
    }
  }

  render() {

    let viz_domain = ProjectLandscape.viz_domain(this.props);
    let viz_data = this.props.viz_data.get(viz_domain);

    return (
        <ScatterChart
          width={730}
          height={250}
          margin={{
            top: 20, right: 20, bottom: 10, left: 10
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" name="Commits" unit="" />
          <YAxis dataKey="y" name="Contributors" unit="" />
          <Tooltip cursor={{strokeDasharray: '3 3'}} />
          <Legend />
          <Scatter
            name="Exathink"
            data={ProjectLandscape.mapData(viz_data)}
            fill="#8884d8"
          />
        </ScatterChart>
    )
  }
}


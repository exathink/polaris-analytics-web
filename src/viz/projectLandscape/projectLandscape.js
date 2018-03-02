import React from 'react';
import { connect } from 'react-redux';
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import vizActions from '../../redux/viz/actions';
import {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const { fetchData } = vizActions;

class ProjectLandscape extends React.Component {
  componentDidMount() {
    if (!this.props.viz_data) {
      this.props.fetchData(null)
    }
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
    return (
      <ReactPlaceholder
        showLoadingAnimation
        type="text"
        rows={7}
        ready={this.props.viz_data != null}
      >
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
            data={ProjectLandscape.mapData(this.props.viz_data)}
            fill="#8884d8"
          />
        </ScatterChart>
      </ReactPlaceholder>
    )
  }
}

const mapStateToProps = state => ({
  viz_data: state.viz.get('viz_data')
});

export default connect(
  mapStateToProps,
  { fetchData }
)(ProjectLandscape);

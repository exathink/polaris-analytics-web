import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';
import {connect} from 'react-redux';
import vizActions from '../redux/viz/actions';
import {withNavigation} from "../navigation/withNavigation";

import type {ModelFactory} from "./modelFactory";


const {fetchData} = vizActions;
export function withVizController(delegate: ModelFactory) {
  return (Viz) => {
    const mapStateToProps = (state) => {
      return {
        user: state.user,
        viz_data: state.vizData
      }
    };

    return withNavigation(connect(mapStateToProps, {fetchData})(
      class VizController extends React.Component {

        render() {
          return (
              <Viz fetchData={this.props.fetchData} viz_data={this.props.viz_data} modelFactory={this.props.modelFactory} context={this.props.navigation.current()}/>
          )
        }
      }));
  }


}

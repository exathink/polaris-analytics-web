import React from 'react';
import {Model} from "./model";
import {BoundView} from "./boundView";
import {withNavigation} from "../navigation/withNavigation";
import {connect} from "react-redux";
import vizActions from '../redux/viz/actions';

const {fetchData} = vizActions;

export function withModel(modelClass: Class<Model<T>>) {
  return View => {
    const mapStateToProps = (state) => {
      return {
        user: state.user,
        viz_data: state.vizData
      }
    };
    return withNavigation(
      connect(mapStateToProps, {fetchData})(
        props => (
          <BoundView modelClass={modelClass} context={props.navigation.current()} {...props}>
            <View/>
          </BoundView>
        )
      )
    );
  }
}
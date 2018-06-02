import React from 'react';
import {Model} from "./model";
import {BoundView} from "./boundView";
import {withNavigation} from "../../navigation/context/withNavigation";
import {connect} from "react-redux";
import vizActions from '../../redux/vizData/actions';
import {ModelCacheContext} from "./modelCache";

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
          <ModelCacheContext.Consumer>
            { modelCache =>
              <BoundView modelClass={modelClass} modelCache={modelCache} context={props.navigation.current()} {...props}>
                <View/>
              </BoundView>
            }
          </ModelCacheContext.Consumer>
        )
      )
    );
  }
}
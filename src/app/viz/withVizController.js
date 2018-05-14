import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';
import {connect} from 'react-redux';
import vizActions from '../redux/viz/actions';
import {withNavigation} from "../navigation/withNavigation";

import type {ControllerDelegate} from "./controllerDelegate";


const {fetchData} = vizActions;
export function withVizController(delegate: ControllerDelegate) {
  return (View) => {
    const mapStateToProps = (state) => {
      return {
        user: state.user,
        viz_data: state.vizData
      }
    };

    return withNavigation(connect(mapStateToProps, {fetchData})(
      class VizController extends React.Component {

        constructor(props) {
          super(props);
        }

        componentDidMount() {
          const context = this.props.navigation.current();
          const dataSpec = delegate.getDataSpec(context);
          dataSpec.forEach(({dataSource, params}) => {
            if (!this.props.viz_data.getData(dataSource, params)) {
              this.props.fetchData({dataSource: dataSource, params: params})
            }
          })
        }

        ready() {
          const context = this.props.navigation.current();
          const dataSpec = delegate.getDataSpec(context);
          return dataSpec.every(({dataSource, params}) => {
            return this.props.viz_data.getData(dataSource, params) != null;
          })
        }

        getModel() {
          if (this.ready()) {
            const context = this.props.navigation.current();
            const dataSpec = delegate.getDataSpec(context);
            const source_data = dataSpec.map(({dataSource, params}) => ({
              dataSource,
              params,
              data: this.props.viz_data.getData(dataSource, params)
            }));
            return delegate.initModel(source_data, this.props);
          }
        }


        render() {
          return (
            <ReactPlaceholder
              showLoadingAnimation
              type="text"
              rows={7}
              ready={this.ready()}
            >
              <View model={this.getModel()} context={this.props.navigation.current()}/>

            </ReactPlaceholder>
          )
        }
      }));
  }


}

import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';
import {connect} from 'react-redux';
import vizActions from '../redux/viz/actions';

import type {ControllerDelegate} from "./controllerDelegate";


const {fetchData} = vizActions;
export function withVizController(delegate: ControllerDelegate) {
  return (View) => {
    const mapStateToProps = (state,ownProps) => {
      return {
        ...ownProps,
        ...{viz_data: state.vizData},
        ...(delegate.mapStateToProps ? delegate.mapStateToProps(state, ownProps) : {})
      }
    };

    return connect(mapStateToProps, {fetchData})(
      class VizController extends React.Component {

        componentDidMount() {
          const dataSpec = delegate.getDataSpec(this.props);
          dataSpec.forEach(({dataSource, params}) => {
            if (!this.props.viz_data.getData(dataSource, params)) {
              this.props.fetchData({dataSource: dataSource, params: params})
            }
          })
        }

        ready() {
          const dataSpec = delegate.getDataSpec(this.props);
          return dataSpec.every(({dataSource, params}) => {
            return this.props.viz_data.getData(dataSource, params) != null;
          })
        }

        getModel() {
          if (this.ready()) {

            const dataSpec = delegate.getDataSpec(this.props);
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
              <View model={this.getModel()}/>

            </ReactPlaceholder>
          )
        }
      });
  }


}

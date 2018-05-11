import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';

import {connect} from 'react-redux';

import vizActions from '../redux/viz/actions';

const {fetchData} = vizActions;

export function withVizController(controller) {
  return (View) => {
    const mapStateToProps = (state,ownProps) => {
      return {
        ...ownProps,
        ...{viz_data: state.vizData},
        ...(controller.mapStateToProps ? controller.mapStateToProps(state, ownProps) : {})
      }
    };

    return connect(mapStateToProps, {fetchData})(
      class extends React.Component {

        componentDidMount() {
          const dataSpec = controller.getDataSpec(this.props);
          dataSpec.forEach(({dataSource, params}) => {
            if (!this.props.viz_data.getData(dataSource, params)) {
              this.props.fetchData({dataSource: dataSource, params: params})
            }
          })
        }

        ready() {
          const dataSpec = controller.getDataSpec(this.props);
          return dataSpec.every(({dataSource, params}) => {
            return this.props.viz_data.getData(dataSource, params) != null;
          })
        }

        mapDomain() {
          if (this.ready()) {

            const dataSpec = controller.getDataSpec(this.props);
            const source_data = dataSpec.map(({dataSource, params}) => ({
              dataSource,
              params,
              data: this.props.viz_data.getData(dataSource, params)
            }));
            return controller.mapDomain(source_data, this.props);
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
              <View {...this.props} model={this.mapDomain()}/>

            </ReactPlaceholder>
          )
        }
      });
  }


}

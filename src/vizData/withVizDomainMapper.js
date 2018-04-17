import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import {connect} from 'react-redux';

import vizActions from '../redux/viz/actions';

const {fetchData} = vizActions;

export function withVizDomainMapper(domainMapper) {
  return (Viz) => {
    const mapStateToProps = (state,ownProps) => {
      return {
        ...ownProps,
        ...{viz_data: state.vizData},
        ...(domainMapper.mapStateToProps ? domainMapper.mapStateToProps(state, ownProps) : {})
      }
    };

    return connect(mapStateToProps, {fetchData})(
      class extends React.Component {

        componentWillMount() {
          const dataSpec = domainMapper.getDataSpec(this.props);
          dataSpec.forEach(({dataSource, params}) => {
            if (!this.props.viz_data.getData(dataSource, params)) {
              this.props.fetchData({dataSource: dataSource, params: params})
            }
          })
        }

        ready() {
          const dataSpec = domainMapper.getDataSpec(this.props);
          return dataSpec.every(({dataSource, params}) => {
            return this.props.viz_data.getData(dataSource, params) != null;
          })
        }

        mapDomain() {
          if (this.ready()) {
            const dataSpec = domainMapper.getDataSpec(this.props);
            const source_data = dataSpec.map(({dataSource, params}) => ({
              dataSource,
              params,
              data: this.props.viz_data.getData(dataSource, params)
            }));
            return domainMapper.mapDomain(source_data, this.props);
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
              <Viz {...{...this.props, ...{viz_domain: this.mapDomain()}}}/>

            </ReactPlaceholder>
          )
        }
      });
  }


}

import React from "react";

import {withSize} from 'react-sizeme';

import {HighchartsChart} from "./highchartsReact";

const Highcharts = require('highcharts/highstock');

require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/xrange')(Highcharts);


class ChartWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: ChartWrapper.setDefaults(props.config, props),
      isResize: false,
      isNewConfig: false
    };
  }

  static setDefaults(config, props) {
    const {height, width, minHeight, minWidth, size} = props;
    config.chart.height = height || minHeight ? Math.max(size.height, minHeight) : size.height;
    config.chart.width = width || minWidth ? Math.max(size.width, minWidth) : size.width;
    config.chart.style = {
      fontFamily: 'Roboto, sans-serif'
    };
    config.credits = {
      enabled: false
    };
    return config
  }

  static willResize(nextProps, prevState) {
    return (
      nextProps.size.height !== prevState.config.chart.height ||
      nextProps.size.width !== prevState.config.chart.width
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const isResize = ChartWrapper.willResize(nextProps, prevState);
    const isNewConfig = nextProps.config !== prevState.config;
    if( isNewConfig || isResize ) {
      return {
        config: ChartWrapper.setDefaults(nextProps.config, nextProps),
        isResize: isResize,
        isNewConfig: isNewConfig
      }
    }
    return null;
  }

  getChart() {
    return this.refs.chart.getChart()
  }

  render() {
    return (
      <div style={{height: "100%", width: "100%"}}>
        <HighchartsChart
          highcharts={Highcharts}
          constructorType={this.props.constructorType}
          config={this.state.config}
          callback={this.props.afterRender}
          isResize={this.state.isResize}
          isNewConfig={this.state.isNewConfig}
          size={this.props.size}
          ref="chart"
        />
      </div>
    );
  }
}

export default withSize({monitorWidth:true, monitorHeight: true, refreshMode: 'debounce'})(ChartWrapper);

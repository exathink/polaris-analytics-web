import React from "react";


import {HighchartsChart} from "./highchartsReact";

export const Highcharts = require('highcharts/highstock');

require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/xrange')(Highcharts);
require('highcharts-custom-events')(Highcharts);
require('highcharts/modules/draggable-points')(Highcharts);

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
    if (config.tooltip && config.tooltip.useHTML) {
      config.tooltip.padding = 1;
    }
    config.chart.style = {
      fontFamily: 'Roboto, sans-serif'
    };
    config.credits = {
      enabled: false
    };
    return config
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const isNewConfig = nextProps.config !== prevState.config;
    return {
      config: isNewConfig? ChartWrapper.setDefaults(nextProps.config, nextProps) :prevState.config,
      isNewConfig: isNewConfig
    }
  }

  getChart() {
    return this.refs.chart.getChart()
  }

  render() {
    return (
        <HighchartsChart
          highcharts={Highcharts}
          constructorType={this.props.constructorType}
          config={this.state.config}
          callback={this.props.afterRender}
          isNewConfig={this.state.isNewConfig}
          ref="chart"
        />
     
    );
  }
}

export default ChartWrapper;

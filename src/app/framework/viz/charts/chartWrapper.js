import React from "react";

import Dimensions from 'react-dimensions';

import {HighchartsChart} from "./highchartsReact";

const Highcharts = require('highcharts/highstock');
require('highcharts/highcharts-more.src.js')(Highcharts);
require('highcharts/modules/xrange.src.js')(Highcharts);



class ChartWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: ChartWrapper.setDefaults(props.config, props)
    };
  }

  static setDefaults(config, props) {
    config.chart.height = props.containerHeight;
    config.chart.width = props.containerWidth;
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
      nextProps.containerHeight !== prevState.config.chart.height ||
      nextProps.containerWidth !== prevState.config.chart.width
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.config !== prevState.config || ChartWrapper.willResize(nextProps, prevState)) {
      return {
        config: ChartWrapper.setDefaults(nextProps.config, nextProps)
      }
    }
    return null;
  }

  getChart() {
    return this.refs.chart.getChart()
  }


  shouldComponentUpdate(nextProps, nextState){
    return this.state !== nextState;
  }

  componentDidUpdate() {
    const chart = this.getChart();
    const type = this.state.config.chart.type;

    window.performance.mark(`before-chart-${type}-update`);
    console.time(`${type}-update`);
    chart.update(this.state.config);
    console.timeEnd(`${type}-update`);
    window.performance.mark(`after-chart-${type}-update`);
    window.performance.measure(`${type}-chart-update`, `before-chart-${type}-update`, `after-chart-${type}-update`);

  }

  render() {
    return (<HighchartsChart highcharts={Highcharts} config={this.state.config} callback={this.props.afterRender} ref="chart"/>);
  }
}

export default Dimensions({elementResize: true})(ChartWrapper);

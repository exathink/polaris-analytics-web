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
      config: ChartWrapper.setDefaults(props.config, props)
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
    //const type = this.state.config.chart.type;

    //window.performance.mark(`before-chart-${type}-update`);
    //console.time(`${type}-update`);
    if (chart) {
      chart.update(this.state.config);
      chart.zoomOut();
    }
    //console.timeEnd(`${type}-update`);
    //window.performance.mark(`after-chart-${type}-update`);
    //window.performance.measure(`${type}-chart-update`, `before-chart-${type}-update`, `after-chart-${type}-update`);

  }

  render() {
    return (
      <div style={{height: "100%", width: "100%"}}>
        <HighchartsChart
          highcharts={Highcharts}
          constructorType={this.props.constructorType}
          config={this.state.config}
          callback={this.props.afterRender}
          ref="chart"
        />
      </div>
    );
  }
}

export default withSize({monitorWidth:true, monitorHeight: true})(ChartWrapper);

import React from "react";
import ReactHighcharts from 'react-highcharts';
import Dimensions from 'react-dimensions';


require('highcharts/modules/xrange.js')(ReactHighcharts.Highcharts);

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
      config: Chart.getConfig(props)
    }
  }

  static setDefaults(config, props) {
    config.chart.height = props.containerHeight;
    config.chart.width = props.containerWidth;
    config.credits = {
      enabled: false
    };
    return config
  }

  static getConfig(props) {
    return Chart.setDefaults(props.getConfig(props), props)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.model !== prevState.model) {
      return {
        model: nextProps.model,
        config: Chart.getConfig(nextProps.model)
      }
    }
  }

  getChart() {
    return this.refs.chart.getChart()
  }

  componentDidUpdate() {
    const chart = this.getChart();
    if (this.props.containerHeight !== chart.chartHeight || this.props.containerWidth !== chart.chartWidth) {
      chart.setSize(this.props.containerWidth, this.props.containerHeight, false)
    }
  }

  render() {
    return (<ReactHighcharts config={this.state.config} isPureConfig={true} callback={this.props.afterRender} ref="chart"/>);
  }
}

export default Dimensions({elementResize: true})(Chart);

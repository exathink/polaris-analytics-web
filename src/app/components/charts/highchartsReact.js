
import React from 'react';

export class HighchartsChart extends React.Component {

  constructor(props){
    super(props);
    this.container = React.createRef();
    this.chart = null;
    this.state = {}
  }

  getChart() {
    return this.chart;
  }

  componentDidMount() {

    const {highcharts, constructorType, config, callback} = this.props;
    console.time(`${config.chart.type}`);
    window.performance.mark(`before-chart-render-${config.chart.type}`);
    this.chart = highcharts[constructorType || 'chart'](this.container.current, config);
    window.performance.mark(`after-chart-render-${config.chart.type}`);
    window.performance.measure(`${config.chart.type}-render-time`, `before-chart-render-${config.chart.type}`, `after-chart-render-${config.chart.type}`);
    console.timeEnd(`${config.chart.type}`);
    if(callback) {
      callback(this.chart);
    }
  }

  componentWillUnmount() {
    if(this.chart) {
      this.chart.destroy();
    }
  }

  shouldComponentUpdate(){
    return false;
  }

  static getDerivedStateFromProps(){
    return null;
  }

  render() {
    return (<div  ref={this.container}/>);
  }
}

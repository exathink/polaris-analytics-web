import React from 'react';

export class HighchartsChart extends React.Component {

  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.chart = null;
  }


  getChart() {
    return this.chart;
  }

  // by making this async, we can kick off rendering of multiple charts in parallel while the react component
  // tree builds.
  async componentDidMount() {
    await this.initChart();
  }

  async componentDidUpdate() {
    if (this.props.isNewConfig) {
      this.teardownChart();
      await this.initChart()
    }
  }

  async initChart() {
    const {highcharts, constructorType, config, callback} = this.props;
    //console.time(`${config.chart.type}`);
    //window.performance.mark(`before-chart-render-${config.chart.type}`);
    this.chart = await highcharts[constructorType || 'chart'](this.container.current, config);
    //window.performance.mark(`after-chart-render-${config.chart.type}`);
    //window.performance.measure(`${config.chart.type}-render-time`, `before-chart-render-${config.chart.type}`, `after-chart-render-${config.chart.type}`);
    //console.timeEnd(`${config.chart.type}`);
    if (callback) {
      callback(this.chart);
    }
  }

  componentWillUnmount() {
    this.teardownChart();
  }

  teardownChart() {
    const {callback} = this.props;
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
      if (callback) {
        callback(this.chart)
      }
    }
  }


  render() {
    return (<div ref={this.container} className="tw-w-full tw-h-full"/>);
  }
}

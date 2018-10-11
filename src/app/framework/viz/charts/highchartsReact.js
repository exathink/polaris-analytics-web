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
      console.log(`${this.props.config.chart.type} chart has new config`);
      this.teardownChart();
      await this.initChart()
    }
    if (this.props.isResize) {
        console.log(`${this.props.config.chart.type} chart will resize`);
        const chart = this.getChart();
        const {size} = this.props;
        chart.setSize(size.width, size.height)
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

  shouldComponentUpdate(nextProps){
    return nextProps.isNewConfig || nextProps.isResize
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
    return (<div ref={this.container}/>);
  }
}

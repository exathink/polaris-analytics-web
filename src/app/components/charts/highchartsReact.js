
import React from 'react';

export class HighchartsChart extends React.Component {

  constructor(props){
    super(props);
    this.container = React.createRef();
    this.chart = null;
  }

  getChart() {
    return this.chart;
  }

  componentDidMount() {
    const {highcharts, constructorType, config, callback} = this.props;
    this.chart = highcharts[constructorType || 'chart'](this.container.current, config);
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

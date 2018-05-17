import React from "react";
import ReactHighcharts from 'react-highcharts';
import Dimensions from  'react-dimensions';

import {fromJS} from 'immutable';


function applyUpdates(props, map, updates) {
  return updates.reduce((currentMap, update) => update(props, currentMap), map)
}


class Config {
  constructor(map) {
    this.map = map;
    this.config = map.toJS();
  }
}


const updates = [
  (nextProps, map) => map.getIn(['chart', 'height']) !== nextProps.containerHeight ? map.setIn(['chart', 'height'], nextProps.containerHeight) : map,
  (nextProps, map) => map.getIn(['chart', 'width']) !== nextProps.containerWidth ? map.setIn(['chart', 'width'], nextProps.containerWidth) : map,
];

class ChartWrapper extends React.Component {

  constructor(props){
    super(props);
    this.state = new Config(ChartWrapper.setDefaults(props.configMap, props));
  }

  static setDefaults(configMap, props) {
    return configMap
      .setIn(['chart', 'height'], props.containerHeight)
      .setIn(['chart', 'width'], props.containerWidth)
      .setIn(['credits', 'enabled'], false)
  }

  getChart() {
    return this.refs.chart.getChart()
  }


  componentDidUpdate() {
    const nextMap = applyUpdates(this.props, this.state.map, updates);
    if(nextMap !== this.state.map) {
      const chart = this.getChart();
      chart.setSize(this.props.containerWidth, this.props.containerHeight, false)

    }
  }

  render() {
    return (<ReactHighcharts config={this.state.config} isPureConfig={true} callback={this.props.afterRender} ref="chart"/>);
  }
}

export default Dimensions({elementResize: true})(ChartWrapper);

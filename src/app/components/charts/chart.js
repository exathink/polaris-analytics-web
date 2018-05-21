import React from "react";

import {ChartWrapper} from "./index";
import type {ChartConfigProvider} from "./chartConfigProvider";

export const Chart = (configProvider: ChartConfigProvider) => {
  return class _ extends React.Component {

    constructor(props) {
      super(props);
      this.state = {};
      this.chart = null;
      this.eventHandler = null;
    }

    setChart(chart) {
      this.chart = chart;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const providerProps = configProvider.mapPropsToState(nextProps);
      const propChange = Object.keys(providerProps).find(prop => providerProps[prop] !== prevState[prop]);
      if (propChange) {
        return {
          ...providerProps,
          config: prevState.config,
          providerPropsUpdated: true
        }
      }
      return null;
    }

    attachEvents(config){
      if(configProvider.eventHandler) {
        this.eventHandler = new configProvider.eventHandler(config, this);
      }
      return config
    }

    updateConfig() {
      if(this.state.providerPropsUpdated) {
        const config = this.attachEvents(configProvider.getConfig(this.props));
        this.setState( prevState => {
          return {
            ...{prevState},
            config: config,
            providerPropsUpdated: false
          }
        })
      }
    }



    componentDidMount(){
      this.updateConfig();
    }

    componentDidUpdate() {
      this.updateConfig();
    }



    onSelectionChange(selected){
      if(this.props.onActivitiesSelected && configProvider.mapPoints) {
        this.props.onActivitiesSelected(configProvider.mapPoints(selected, this.props));
      }
    }

    render() {
      return (this.state.config ? <ChartWrapper config={this.state.config} afterRender={this.setChart.bind(this)}/> : null);
    }
  }
};


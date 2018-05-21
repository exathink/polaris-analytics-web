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
      this.dispatching = false;
    }

    setChart(chart) {
      this.chart = chart;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const providerProps = configProvider.mapPropsToState(nextProps);
      if (Object.keys(providerProps).some(prop => providerProps[prop] !== prevState[prop])) {
        return {
          ...{providerProps},
          config: prevState.config,
          providerPropsUpdated: true,
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

    shouldComponentUpdate() {
      if(this.dispatching) {
        // this seems to be required in order to allow
        // the highcharts charts interaction on the current thread to complete
        // and show the user feedback to selections etc.. Not entirely sure
        // why but this might potentially cause problems if a dispatch does
        // cause React to call this method. So keep this in mind.
        this.dispatching = false;
        return false;
      }
      return true;
    }

    onSelectionChange(selected){
      if(this.props.onActivitiesSelected && configProvider.mapPoints) {
        this.dispatching = true;
        this.props.onActivitiesSelected(configProvider.mapPoints(selected, this.props));
      }
    }

    render() {
      return (this.state.config ? <ChartWrapper config={this.state.config} afterRender={this.setChart.bind(this)}/> : null);
    }
  }
};


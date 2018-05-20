import React from "react";

import {ChartWrapper} from "./index";
import type {ChartConfigProvider} from "./chartConfigProvider";

export const BasicChart = (configProvider: ChartConfigProvider) => {
  return class Chart extends React.Component {

    constructor(props) {
      super(props);
      this.state = {};
      this.chart = null;
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

    updateConfig() {
      if(this.state.providerPropsUpdated) {
        this.setState( prevState => {
          return {
            ...{prevState},
            config: configProvider.getConfig(this.props),
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


    render() {
      return (this.state.config ? <ChartWrapper config={this.state.config} afterRender={this.setChart}/> : null);
    }
  }
};


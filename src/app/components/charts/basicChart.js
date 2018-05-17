import React from "react";

import {ChartWrapper} from "./index";
import type {ChartConfigProvider} from "./chartConfigProvider";

export const BasicChart = (configProvider: ChartConfigProvider) => {
  return class Chart extends React.Component {

    constructor(props) {
      super(props);
      this.state = Chart.computeState(props);
    }

    static computeState(props) {
      return  {
        ...configProvider.mapPropsToState(props),
        config: configProvider.getConfig(props)
      }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const providerProps = configProvider.mapPropsToState(nextProps);
      if (Object.keys(providerProps).some(prop => providerProps[prop] !== prevState[prop])) {
        return Chart.computeState(nextProps)
      }
      return null;
    }

    render() {
      return (<ChartWrapper config={this.state.config}/>);
    }
  }
};


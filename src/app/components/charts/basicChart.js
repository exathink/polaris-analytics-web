import React from "react";

import {ChartWrapper} from "./index";

export const BasicChart = (configProvider) => {
  return class extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        model: props.model,
        config: configProvider(props)
      }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.model !== prevState.model) {
        return {
          model: nextProps.model,
          config: configProvider(nextProps)
        }
      }
    }

    render() {
      return (<ChartWrapper config={this.state.config}/>);
    }
  }
};


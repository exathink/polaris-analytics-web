import React from "react";
import {ChartWrapper} from "./index";
import type {ChartConfigProvider} from "./chartConfigProvider";
import {injectIntl} from "react-intl";

export const Chart = (configProvider: ChartConfigProvider) => {
  return injectIntl(class _ extends React.Component {

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
        const chartUpdateProps = configProvider.chartUpdateProps(nextProps);
        const propChange = Object.keys(chartUpdateProps).find(prop => chartUpdateProps[prop] !== prevState[prop]);
        if (propChange) {
          return {
            ...chartUpdateProps,
            config: prevState.config,
            providerPropsUpdated: true
          }
        }
        return null;
      }

      attachEvents(config) {
        if (configProvider.eventHandler) {
          this.eventHandler = new configProvider.eventHandler(config, this, this.props);
        }
        return config
      }

      updateConfig() {
        if (this.state.providerPropsUpdated) {
          const config = this.attachEvents(configProvider.getConfig(this.props));
          this.setState(prevState => {
            return {
              ...{prevState},
              config: config,
              providerPropsUpdated: false
            }
          })
        }
      }


      componentDidMount() {
        this.updateConfig();
      }

      componentDidUpdate() {
        this.updateConfig();
      }


      onSelectionChange(selected) {
        if (this.props.onSelectionChange && configProvider.mapPoints) {
          if(selected) {
            this.props.onSelectionChange(configProvider.mapPoints(selected, this.props));
          } else {
            this.props.onSelectionChange(selected)
          }
        }
      }

      render() {
        return (this.state.config ?
          <ChartWrapper config={this.state.config} constructorType={configProvider.constructorType} afterRender={this.setChart.bind(this)}/> : null);
      }
    }
  )
};


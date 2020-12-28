import React from "react";
import {ChartWrapper} from "./index";
import type {ChartConfigProvider} from "./chartConfigProvider";
import {injectIntl} from "react-intl";
import {SpyContext} from "./chartSpyContext";

export const Chart = (configProvider: ChartConfigProvider) => {
  return injectIntl(class _ extends React.Component {
      static contextType = SpyContext;

      constructor(props) {
        super(props);
        this.state = {}

      }

      componentDidMount() {
        if(this.context && this.context.configSpy){
          this.context.configSpy(this.state.config)
        }
      }

      static attachEvents(config, props) {
        if (configProvider.eventHandler) {
          return new configProvider.eventHandler(config, props);
        }
      }

      static initConfig(props) {
        const config = configProvider.getConfig(props);
        return {
          config: config,
          eventHandler: _.attachEvents(config, props)
        }
      }


      setChart(chart) {
        this.chart = chart;
        if(this.state.eventHandler) {
          this.state.eventHandler.setChart(this)
        }
        if(this.context && this.context.onChartUpdated) {
          this.context.onChartUpdated(this.chart)
        }
      }

      static getDerivedStateFromProps(nextProps, prevState) {
        const chartUpdateProps = configProvider.chartUpdateProps(nextProps);
        const propChange = Object.keys(chartUpdateProps).find(prop => chartUpdateProps[prop] !== prevState[prop]);
        if (propChange) {
          if(prevState.config) {
            console.log(`Prop '${propChange}' changed for ${prevState.config.chart.type} chart`);
          }
          return {
            ...chartUpdateProps,
            ..._.initConfig(nextProps)
          }
        }
        return null;
      }

      onSelectionChange(selected, options = {}) {
        if (this.props.onSelectionChange && configProvider.mapPoints) {
          if(selected) {
            this.props.onSelectionChange(configProvider.mapPoints(selected, this.props), options);
          } else {
            this.props.onSelectionChange(selected)
          }
        }
      }

      render() {
        return (this.state.config ?
          <ChartWrapper
            config={this.state.config}
            constructorType={configProvider.constructorType}
            afterRender={this.setChart.bind(this)}
            height={this.props.height}
            width={this.props.width}
            minHeight={this.props.minHeight}
            minWidth={this.props.minWidth}
          /> : null


        );
      }
    }
  )
};


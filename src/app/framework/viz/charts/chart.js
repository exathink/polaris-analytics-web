import React from "react";
import {ChartWrapper} from "./index";
import type {ChartConfigProvider} from "./chartConfigProvider";
import {injectIntl} from "react-intl";

export const Chart = (configProvider: ChartConfigProvider) => {
  return injectIntl(class _ extends React.Component {

      constructor(props) {
        super(props);
        this.state = {}

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


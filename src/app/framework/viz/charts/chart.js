import React from "react";
import {ChartWrapper} from "./index";
import type {ChartConfigProvider} from "./chartConfigProvider";
import {injectIntl} from "react-intl";
import {TestDataContext} from "./TestDataContext";
import {addIdsToChartPoints} from "./addIdsToChart";

export const Chart = (configProvider: ChartConfigProvider) => {
  return injectIntl(class _ extends React.Component {
      static contextType = TestDataContext;

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
        // useful for tests
        this.addTestUtilities(chart);
      }

      addTestUtilities(chart){
        if (this.context && chart) {
          if(this.context.chartSpy) {
            this.context.chartSpy(chart)
          }
          // add testId to chart svg node.
          if (this.context.chartTestId) {
            // chart.getSVG() is not working, need to check
            chart.container.firstChild.setAttribute("data-testid",this.context.chartTestId);
          }
          // add testIds to chart points, for a specific series, filtered by mapper.
          if (this.context.pointOptions) {
            const {mapper, seriesIndex} = this.context.pointOptions;
            addIdsToChartPoints(chart, mapper, seriesIndex);
          }
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


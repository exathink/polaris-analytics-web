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

      getInitialViewState() {
        const {context, cacheViewState, chartId} = this.props;
        if (context && cacheViewState && chartId) {
          return context.getViewState(chartId)
        }
      }

      updateViewState(viewState) {
        
        if(this.chart && viewState && this.eventHandler) {
          if(this.eventHandler.setInitialViewState(viewState)) {
              this.chart.redraw();
          }
        }
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

      doUpdate() {
        if (this.state.providerPropsUpdated) {
          const config = this.attachEvents(configProvider.getConfig(this.props));
          this.setState(prevState => {
            return {
              ...{prevState},
              config: config,
              providerPropsUpdated: false
            }
          })
        } else if (this.chart) {
            const initialViewState = this.getInitialViewState();
            if(initialViewState) {
              this.updateViewState(initialViewState)
            }
        }
      }


      componentDidMount() {
        
        this.doUpdate();
      }

      componentDidUpdate() {
        
        this.doUpdate();
      }


      onSelectionChange(selected) {
        if (this.props.onSelectionChange && configProvider.mapPoints) {
          if (selected) {
            this.props.onSelectionChange(configProvider.mapPoints(selected, this.props));
          } else {
            this.props.onSelectionChange(selected)
          }
        }
      }

      render() {
        
        return (this.state.config ?
          <ChartWrapper config={this.state.config} constructorType={configProvider.constructorType}
                        afterRender={this.setChart.bind(this)}/> : null);
      }
    }
  )
};


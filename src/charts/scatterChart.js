// @flow

import {VizDomain, Trace} from "./flow_types";

const DEFAULT_MARKER_COLOR = '#1675fa';


type ScatterPlotMap = {
  x: (VizDomain) => Array<any>,
  y: (VizDomain) => Array<any>,
  size: ?(VizDomain) => Array<any>,
  labels: ?(VizDomain) => Array<string>,
  text: ?(VizDomain) => Array<string>
}

export function scatterChart(vizDomain: VizDomain, plotMap: ScatterPlotMap, plotProperties: any = {}): Trace {
  scatterChart.defaultProps = {
    type: 'scatter',
    hoverinfo: 'text',
    mode: 'markers+text',
    textposition: 'bottom center'


  };

  scatterChart.defaultMarkerProps = {
    color: DEFAULT_MARKER_COLOR,
  };

  const base_chart = {
    ...scatterChart.defaultProps,
    ...{x: plotMap.x(vizDomain)},
    ...{y: plotMap.y(vizDomain)},
    ...(plotMap.text != null? {text: plotMap.text(vizDomain)}: {}),
  };

  const marker_props = {
    marker: {
      ...scatterChart.defaultMarkerProps,
      ...(plotMap.size != null ? {size: plotMap.size(vizDomain)} : {})
    }
  };


  return {
    ...base_chart,
    ...marker_props
  }


}
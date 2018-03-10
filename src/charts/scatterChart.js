const DEFAULT_MARKER_COLOR = '#1675fa';
export function scatterChart(plotMap){
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
    ...{x: plotMap.x},
    ...{y: plotMap.y},
    ...(plotMap.text != null? {text: plotMap.text}: {}),
  };

  const marker_props = {
    marker: {
      ...scatterChart.defaultMarkerProps,
      ...(plotMap.size != null ? {size: plotMap.size} : {})
    }
  };


  return {
    ...base_chart,
    ...marker_props
  }


}
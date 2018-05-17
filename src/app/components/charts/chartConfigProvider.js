
export type HighChartsConfig = {};

export type ChartConfigProvider = {
  getConfig: (props:any) => HighChartsConfig,
  mapPropsToState: (props:any) => {}
}
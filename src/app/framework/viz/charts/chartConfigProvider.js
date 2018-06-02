
export type HighChartsConfig = {};

export type ChartConfigProvider = {
  getConfig: (props:any) => HighChartsConfig,
  chartUpdateProps: (props:any) => {}
}
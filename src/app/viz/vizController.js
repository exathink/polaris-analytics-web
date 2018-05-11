// @flow
export type VizController = {
  mapStateToProps: (state:any) => {},
  getDataSpec: () => Array<{ dataSource: {}, params: {} }>,
  mapDomain: (source_data: any, props: {} ) => {}
}
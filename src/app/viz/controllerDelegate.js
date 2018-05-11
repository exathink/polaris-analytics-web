// @flow
export type ControllerDelegate = {
  mapStateToProps: (state:any) => {},
  getDataSpec: () => Array<{ dataSource: {}, params: {} }>,
  mapDomain: (source_data: any, props: {} ) => {}
}
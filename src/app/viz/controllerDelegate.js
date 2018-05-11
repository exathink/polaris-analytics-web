// @flow
export type ControllerDelegate = {
  mapStateToProps: (state:any) => {},
  getDataSpec: () => Array<{ dataSource: {}, params: {} }>,
  initModel: (source_data: any, props: {} ) => {}
}
// @flow
import {Model} from "./model";

export type DatasourceBinding = Array<{ dataSource: {}, params: {} }>

export type ModelFactory<T> = {
  getDataBinding: (context: any) => DatasourceBinding,
  initModel: (source_data: any, props: {}) => Model<T>
}

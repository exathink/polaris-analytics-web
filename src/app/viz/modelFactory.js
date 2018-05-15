// @flow
import {Model} from "./model";

export type ModelFactory<T> = {
  getDataBinding: (context: any) => Array<{ dataSource: {}, params: {} }>,
  initModel: (source_data: any, props: {}) => Model<T>
}

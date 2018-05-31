
import {Map} from 'immutable'
import type {Model} from "./model";
import type {DatasourceBinding} from "./modelFactory";
import React from "react";

type T = any;

type ModelState<T> = {
  model: Model<T> | null,
  status: 'initial' | 'fetching' | 'initialized'
}

type ModelMap = Map<[Class<Model<T>>, DatasourceBinding],ModelState<T>>;

export class ModelCache {
  map: ModelMap;

  constructor() {
    this.map = new Map();
  }

  getModel(modelClass: Class<Model<T>>, datasourceBinding: DatasourceBinding) {
    return this.map.get([modelClass, datasourceBinding], {
      model: null,
      status: 'initial'
    });
  }

  putModel(modelClass: Class<Model<T>>, datasourceBinding: DatasourceBinding, modelState: ModelState<T>) {
    this.map = this.map.set([modelClass, datasourceBinding], modelState);
  }

}

export const ModelCacheContext = React.createContext(new ModelCache());

import {Map} from 'immutable'
import type {Model} from "./model";
import React from "react";

type T = any;

type ModelState<T> = {
  model: Model<T> | null,
  status: 'initial' | 'fetching' | 'initialized'
}

type ModelMap = Map<Class<Model<T>>,ModelState<T>>;

export class ModelCache {
  map: ModelMap;

  constructor() {
    this.map = new Map();
  }

  getModel(modelClass: Class<Model<T>>) {
    return this.map.get(modelClass, {
      model: null,
      status: 'initial'
    });
  }

  putModel(modelClass: Class<Model<T>>, modelState: ModelState<T>) {
    this.map = this.map.set(modelClass, modelState);
  }

}

export const ModelCacheContext = React.createContext(new ModelCache());
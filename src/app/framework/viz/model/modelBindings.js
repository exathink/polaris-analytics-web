// @flow
import {Map} from 'immutable';
import type {ModelFactory} from "./modelFactory";
import type {Model} from "./model";

type T = any;
type ModelBinding<T> = [Class<Model<T>>, ModelFactory<T>];

export class ModelBindings {

  name: string;
  map: Map<Class<Model<T>>, ModelFactory<T>>;

  constructor(name: string, mapEntries: [ModelBinding<T>]) {
    this.name = name;
    this.map = Map(mapEntries)
  }

  getModelFactory(modelClass: Class<Model<T>>) {
    return this.map.get(modelClass);
  }

}
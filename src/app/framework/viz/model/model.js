// @flow

export class Model<T> {
  data: T;
  version: number;


  constructor(data: T, version: number = 0) {
    this.data = data;
    this.version = version;

  }

}
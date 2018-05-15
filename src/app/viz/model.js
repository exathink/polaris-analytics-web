// @flow

export class Model<T> {
  data: T;
  version: number;

  super(data: T, version: number) {
    this.data = data;
    this.version = version;
  }

}
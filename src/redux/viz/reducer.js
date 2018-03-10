import { Map, List } from 'immutable';

import actions from './actions';


const dataSourceCacheKey = (dataSource, params) => {
  return List([dataSource.name, Map(params)]);
};



class DataSourceCache {
  constructor(map = new Map()) {
    this.cache = map
  }

  getData(dataSource, params) {
    return this.cache.get(dataSourceCacheKey(dataSource, params));

  }

  set(dataSource, params, data) {
    // This is a "set" operation on an immutable - so we need to send out a new object instance with a
    // reference to the modified version of the cache so that redux records it as state change.
    return new DataSourceCache(this.cache.set(dataSourceCacheKey(dataSource, params), data));
  }
}


export default function vizDataReducer(state=new DataSourceCache(), action) {
  switch (action.type) {
    case actions.FETCH_DATA_SUCCESS:
      return state.set(action.payload.dataSource, action.payload.params, action.payload.data);
    default:
      return state;
  }
}

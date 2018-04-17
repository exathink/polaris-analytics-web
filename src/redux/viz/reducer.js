import actions from './actions';
import {DataSourceCache} from "../../vizData/dataSourceCache";


export default function vizDataReducer(state=new DataSourceCache(), action) {
  switch (action.type) {
    case actions.FETCH_DATA_SUCCESS:
      return state.set(action.payload.dataSource, action.payload.params, action.payload.data);
    default:
      return state;
  }
}

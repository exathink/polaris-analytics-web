import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({});

export default (state=initState, action) => {
  switch (action.type) {
    case actions.FETCH_DATA_SUCCESS:
      return state.set(action.payload.viz_domain, action.payload.data);
    default:
      return state;
  }
}

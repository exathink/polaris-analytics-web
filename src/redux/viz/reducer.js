import { Map } from 'immutable';

import actions from './actions';

const initState = new Map();
export default function chartReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_DATA_SUCCESS:
      return state.set('data', action.payload);
    default:
      return state;
  }
}
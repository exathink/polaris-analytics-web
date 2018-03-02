import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({viz_data: null});

export default (state=initState, action) => {
  switch (action.type) {
    case actions.FETCH_DATA_SUCCESS:
      return state.set('viz_data', action.payload);
    default:
      return state;
  }
}

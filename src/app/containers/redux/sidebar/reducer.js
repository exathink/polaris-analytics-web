import actions from "./actions";
import {Map} from 'immutable';

const initState = new Map({topics:[]});
export default (state=initState, action) => {
  switch(action.type) {
    case actions.SET_TOPICS:
      return state.set('topics', action.payload);
    case actions.CLEAR_TOPICS:
      return initState;
    default:
      return state;
  }
};

import actions from './actions';
import {Stack} from 'immutable';


export default function contextReducer(state=Stack(), action) {
  switch (action.type) {
    case actions.PUSH:
      return state.push(action.payload);
    case actions.POP:
      return state.pop();
    default:
      return state;
  }
}

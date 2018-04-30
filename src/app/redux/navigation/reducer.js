import actions from "./actions";
import {Stack} from 'immutable';

export const getCurrentRoute = state => !state.isEmpty() ? state.peek().routes : [];

const initState = new Stack();
export default (state=initState, action) => {
  switch(action.type) {
    case actions.PUSH_ROUTE:
      return state.push({'routes': action.payload});
    case actions.POP_ROUTE:
      return state.pop();
    default:
      return state;
  }
};

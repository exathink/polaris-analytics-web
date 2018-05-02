import actions from "./actions";
import {Stack} from 'immutable';

const initState = new Stack();
export default (state=initState, action) => {
  switch(action.type) {
    case actions.PUSH_ROUTE: {

      return state.push(action.payload);
    }
    case actions.POP_ROUTE:
      return state.butLast();

    default:
      return state;
  }
};

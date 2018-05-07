import actions from "./actions";
import {Stack} from 'immutable';

const initState = new Stack();
export default function contextStackReducer(state=initState, action){
  switch(action.type) {
    case actions.PUSH_CONTEXT: {

      return state.push(action.payload);
    }
    case actions.POP_CONTEXT:
      return state.butLast();

    default:
      return state;
  }
};

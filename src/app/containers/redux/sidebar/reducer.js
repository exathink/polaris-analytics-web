import actions from "./actions";
import {Stack} from 'immutable';

export const getCurrentTopics = state => !state.isEmpty() ? state.peek().topics : [];

const initState = new Stack();
export default (state=initState, action) => {
  switch(action.type) {
    case actions.PUSH_TOPICS:
      return state.push({'topics': action.payload});
    case actions.POP_TOPICS:
      return state.pop();
    default:
      return state;
  }
};

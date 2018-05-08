import actions from "./actions";

import {List} from 'immutable';


export class ContextStack {
  constructor(stack, index) {
    this.stack = stack;
    this.index = index;
  }

  current() {
    return this.stack.size > 0 && this.index >=0 ?
      this.stack.get(this.index)
      : null;
  }

  next() {
    return this.index > 0 ?
      this.stack.get(this.index - 1)
      : null;
  }

  prev() {
    return this.index + 1 < this.stack.size ?
      this.stack.get(this.index + 1)
      : null;
  }

}



const initState = new ContextStack(new List(), -1);

export default function contextStackReducer(state=initState, action){
  switch(action.type) {
    case actions.PUSH_CONTEXT: {
      return new ContextStack(state.stack.unshift(action.payload), 0);
    }
    case actions.POP_CONTEXT:
      return state.butLast();

    default:
      return state;
  }
};

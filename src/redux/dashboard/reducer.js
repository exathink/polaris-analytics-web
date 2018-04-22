
import actions from './actions';
import {Stack} from 'immutable';

export type Context = {
  organization?: {
    level: 'account' |'organization' | 'project' | 'repository',
    name: string,
    key: string
  };
}

export default function contextReducer(state:Stack<Context> = Stack(), action: any) {
  switch (action.type) {
    case actions.PUSH:
      return state.push(action.payload);
    case actions.POP:
      return state.pop();
    default:
      return state;
  }
}

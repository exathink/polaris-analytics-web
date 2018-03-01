import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({ authorized: false });

export default (state=initState, action) => {
    switch(action.type) {
        case actions.AUTH_SUCCESS:
          return state.set('authorized', true);
        case actions.AUTH_FAIL:
        case actions.LOGOUT:
          return initState;
        default:
          return state;
    }
};

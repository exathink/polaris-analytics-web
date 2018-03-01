import { Map } from 'immutable';
import actions from '../auth/actions';

const initState = new Map({});

export default (state=initState, action) => {
    switch(action.type) {
        case actions.AUTH_SUCCESS:
          return new Map({...action.user});
        case actions.AUTH_FAIL:
        case actions.LOGOUT:
          return initState;
        default:
          return state;
    }
};

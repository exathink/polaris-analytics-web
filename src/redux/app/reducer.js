import { Map } from 'immutable';
import actions, { getView } from './actions';



const initState = new Map({
  collapsed: true,
  view: getView(window.innerWidth),
  height: window.innerHeight,
  openDrawer: false,
  openKeys: [],
  current: []
});
export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.COLLPSE_CHANGE:
      return state.set('collapsed', !state.get('collapsed'));
    case actions.COLLPSE_OPEN_DRAWER:
      return state.set('openDrawer', !state.get('openDrawer'));
    case actions.TOGGLE_ALL:
      if (state.get('view') !== action.view || action.height !== state.height) {
        const height = action.height ? action.height : state.height;
        return state
          .set('collapsed', action.collapsed)
          .set('view', action.view)
          .set('height', height);
      }
      break;
    case actions.CHANGE_OPEN_KEYS:
      return state.set('openKeys', action.openKeys);
    case actions.CHANGE_CURRENT:
      return state.set('current', action.current);
    default:
      return state;
  }
  return state;
}

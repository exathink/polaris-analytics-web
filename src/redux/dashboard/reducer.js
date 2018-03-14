import actions from '../viz/actions';

const initState = { expanded: false, expandedViz: null };

export default (state=initState, action) => {
  switch(action.type) {
    case actions.EXPAND:
      return {
        expanded: true,
        expandedViz: action.vizId
      };
    case actions.CONTRACT:
      return initState;
    default:
      return state;
  }
}

const actions = {
  // types
  PUSH_ROUTE: 'PUSH_ROUTE',
  POP_ROUTE: 'POP_ROUTE',

  // events
  pushRoute: payload => ({
    type: actions.PUSH_ROUTE, payload: payload
  }),
  popRoute: payload => ({
    type: actions.POP_ROUTE, payload: payload
  }),
};
export default actions;
const actions = {
  // types
  PUSH_CONTEXT: 'PUSH_CONTEXT',
  POP_CONTEXT: 'POP_CONTEXT',

  // events
  pushContext: payload => ({
    type: actions.PUSH_CONTEXT, payload: payload
  }),
  popContext: () => ({
    type: actions.POP_CONTEXT
  }),
};
export default actions;
const actions = {
  // types
  PUSH: 'push',
  POP: 'pop',

  // events
  push: context => ({
    type: actions.PUSH, payload: context
  }),
  pop: () => ({
    type: actions.POP
  }),
};
export default actions;

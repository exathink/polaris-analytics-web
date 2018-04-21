const actions = {
  // types
  PUSH: 'push',
  POP: 'pop',

  // events
  push: context => ({
    type: actions.PUSH, payload: context
  }),
  fetchDataSuccess: () => ({
    type: actions.POP
  }),
};
export default actions;

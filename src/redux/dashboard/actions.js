const actions = {
  // types
  MOUNT: 'mount',
  DISMOUNT: 'dismount',

  // events
  mount: payload => ({
    type: actions.MOUNT, payload: payload
  }),
  dismount: () => ({
    type: actions.DISMOUNT
  }),
};
export default actions;

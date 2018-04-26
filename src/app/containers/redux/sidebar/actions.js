const actions = {
  // types
  PUSH_TOPICS: 'PUSH_TOPICS',
  POP_TOPICS: 'POP_TOPICS',

  // events
  pushTopics: payload => ({
    type: actions.PUSH_TOPICS, payload: payload
  }),
  popTopics: () => ({
    type: actions.POP_TOPICS
  }),
};
export default actions;
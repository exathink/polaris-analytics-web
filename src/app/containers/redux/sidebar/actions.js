const actions = {
  // types
  SET_TOPICS: 'SET_TOPICS',
  CLEAR_TOPICS: 'CLEAR_TOPICS',

  // events
  setTopics: payload => ({
    type: actions.SET_TOPICS, payload: payload
  }),
  clearTopics: () => ({
    type: actions.CLEAR_TOPICS
  }),
};
export default actions;
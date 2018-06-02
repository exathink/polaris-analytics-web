const actions = {
  // types
  FETCH_DATA: 'fetch-data',
  FETCH_DATA_SUCCESS: 'fetch-data-success',

  // events
  fetchData: params => ({
    type: actions.FETCH_DATA, payload: params
  }),
  fetchDataSuccess: data => ({
    type: actions.FETCH_DATA_SUCCESS, payload: data
  }),
};
export default actions;

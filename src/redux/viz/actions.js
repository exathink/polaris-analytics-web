const actions = {
  // types
  FETCH_DATA: 'fetch-data',
  FETCH_DATA_SUCCESS: 'fetch-data-success',
  EXPAND: 'EXPAND',
  CONTRACT: 'CONTRACT',

  // events
  fetchData: params => ({
    type: actions.FETCH_DATA, payload: params
  }),
  fetchDataSuccess: data => ({
    type: actions.FETCH_DATA_SUCCESS, payload: data
  }),
  expandViz: id => ({
    type: actions.EXPAND,
    vizId: id
  }),
  contractViz: () => ({
    type: actions.CONTRACT,
  }),
};
export default actions;

const actions = {
  LOGOUT: 'LOGOUT',
  AUTH_FAIL: 'AUTH_FAIL',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  USER_DATA_REQUEST: 'USER_DATA_REQUEST',
  requestUserData: () => ({
    type: actions.USER_DATA_REQUEST
  }),
  logout: () => ({
    type: actions.LOGOUT
  })
};

export default actions;

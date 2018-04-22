import { all, call, takeEvery, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import actions from './actions';
import { getSessionKey } from '../../app/services/auth/helpers';
import { fetchUserData } from '../../app/services/auth/api';

export function* userDataRequest() {
    yield takeEvery(actions.USER_DATA_REQUEST, function*() {
      try {
        const user = yield call(fetchUserData, getSessionKey());
        yield put({
          type: actions.AUTH_SUCCESS,
          user
        });
      } catch (error) {
        yield put({
          type: actions.AUTH_FAIL
        })
      }
    })
}

export function* authError() {
  yield takeEvery(actions.AUTH_FAIL, function*() {
    yield put(push('/logout'));
  });
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    yield put(push('/logout'));
  });
}

export default function* rootSaga() {
  yield all([
    fork(userDataRequest),
    fork(authError),
    fork(logout)
  ]);
}

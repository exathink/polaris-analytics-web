import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import vizSagas from './viz/saga';
import contextSagas from './context/saga';

export default function* rootSaga() {
  yield all([
    authSagas(),
    vizSagas(),
    contextSagas()
  ]);
};

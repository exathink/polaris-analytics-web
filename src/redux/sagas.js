import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import vizSagas from '../app/redux/viz/saga';

export default function* rootSaga() {
  yield all([
    authSagas(),
    vizSagas()
  ]);
};

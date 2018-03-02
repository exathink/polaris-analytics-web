import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import actions from "./actions";
import { getSessionKey } from "../../utils";

const GET_CHART = "http://polaris-services.exathink.localdev:8200/charts";

export const fetchVizData = async (key) => {
  const response = await fetch(`${GET_CHART}/project-summary/Exathink/`, {
      headers: { 'X-XSRF-TOKEN': key }
  });
  const data = await response.json();

  return data;
};

export function* fetchData() {
  yield takeEvery(actions.FETCH_DATA, function*() {
    const sessionKey = getSessionKey();

    if (sessionKey) {
      const data = yield call(fetchVizData, sessionKey)

      yield put({
        type: actions.FETCH_DATA_SUCCESS,
        payload: data,
      });
    }
  });
}

export default function* visSagas() {
  yield all([
    fork(fetchData),
  ]);
}

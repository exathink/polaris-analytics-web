import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import actions from "./actions";
import {getSessionKey} from "../../utils";

const GET_CHART = "http://polaris-services.exathink.localdev:8200/charts";

export const fetchUserData = async (key) => {
    console.log("Fetching data");
    const response = await fetch(`${GET_CHART}/project-summary/Exathink/`, {
        headers: { 'X-XSRF-TOKEN': key }
    });
    const data = await response.json();
    console.log('Fetched: ' + data);
    // Call me redundant-man
    return data.data;
};

export function* fetchData() {
  yield takeEvery(actions.FETCH_DATA, function*() {
    const sessionKey = getSessionKey();
    if (sessionKey) {
      const data = yield call(fetchUserData, sessionKey)
      yield put({
        type: actions.FETCH_DATA_SUCCESS,
        payload: data,
      });
    }
  });
}
export default function* chartSaga() {
  yield all([
    fork(fetchData),
  ]);
}
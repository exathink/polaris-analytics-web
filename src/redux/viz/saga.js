import {all, call, fork, put, takeLatest} from "redux-saga/effects";
import actions from "./actions";
import { getSessionKey } from "../../utils";

const GET_CHART = "http://polaris-services.exathink.localdev:8200/charts";

export const fetchVizData = async (key, viz_domain_id) => {
  console.log(`fetching data for viz_domain: ${viz_domain_id} `);
  const response = await fetch(`${GET_CHART}/${viz_domain_id}/`, {
      headers: { 'X-XSRF-TOKEN': key }
  });
  return await response.json();
};

export function* fetchData() {
  yield takeLatest(actions.FETCH_DATA, function*(action) {
    const sessionKey = getSessionKey();

    if (sessionKey) {
      const data = yield call(fetchVizData, sessionKey, action.payload.viz_domain);

      yield put({
        type: actions.FETCH_DATA_SUCCESS,
        payload: {
          viz_domain: action.payload.viz_domain,
          data: data
        }
      });
    }
  });
}

export default function* visSagas() {
  yield all([
    fork(fetchData),
  ]);
}

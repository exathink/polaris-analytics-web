import {all, call, fork, put, takeLatest} from "redux-saga/effects";
import actions from "./actions";
import { getSessionKey } from "../../utils";
import {PolarisServiceConnection} from "../../viz/dataConnection";

const polarisService = new PolarisServiceConnection("http://polaris-services.exathink.localdev:8200");

export function* fetchData() {
  yield takeLatest(actions.FETCH_DATA, function*(action) {
    const sessionKey = getSessionKey();

    if (sessionKey) {
      const data = yield call(()=>{
        return polarisService.fetchData(action.payload.dataSource, action.payload.params)
      });

      yield put({
        type: actions.FETCH_DATA_SUCCESS,
        payload: {
          dataSource: action.payload.dataSource,
          params: action.payload.params,
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

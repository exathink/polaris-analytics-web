import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import actions from "./actions";
import { getSessionKey } from "../../utils";
import {polarisChartsService} from "../../vizData/api";



export function* fetchData() {
  yield takeEvery(actions.FETCH_DATA, function*(action) {
    const sessionKey = getSessionKey();

    if (sessionKey) {
      const data = yield call(()=>{
        return polarisChartsService.fetchData(action.payload.dataSource, action.payload.params)
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

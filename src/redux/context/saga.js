import {all, fork, put, takeEvery} from "redux-saga/effects";
import actions from "./actions";

export function* push() {
  yield takeEvery(actions.PUSH, function*(action) {
    yield put({
      type: actions.PUSH,
      payload: action.payload
    });
  })
}

export function* pop() {
  yield takeEvery(actions.POP, function*(action) {
    yield put({
      type: actions.POP
    });
  })
}

export default function* contextSagas() {
  yield all([
    fork(push),
    fork(pop)
  ]);
}

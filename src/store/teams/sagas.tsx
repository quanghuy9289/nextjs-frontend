/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { all, call, fork, put, takeEvery, takeLatest } from "redux-saga/effects";
import { callApi } from "../../utils/api";
import { fetchError, fetchSuccess, selectTeam, teamSelected } from "./actions";
import { TeamsActionTypes } from "./types";

const API_ENDPOINT = "https://api.opendota.com";

function* handleFetch() {
  try {
    // To call async functions, use redux-saga's `call()`.
    const res = yield call(callApi, "get", API_ENDPOINT, "/teams");

    if (res.error) {
      yield put(fetchError(res.error));
    } else {
      yield put(fetchSuccess(res));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(fetchError(err.stack!));
    } else {
      yield put(fetchError("An unknown error occured."));
    }
  }
}

function* handleSelect(action: ReturnType<typeof selectTeam>) {
  try {
    const detail = yield call(callApi, "get", API_ENDPOINT, `/teams/${action.payload}`);
    const players = yield call(callApi, "get", API_ENDPOINT, `/teams/${action.payload}/players`);

    if (detail.error || players.error) {
      yield put(fetchError(detail.error || players.error));
    } else {
      yield put(teamSelected({ detail, players }));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(fetchError(err.stack!));
    } else {
      yield put(fetchError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchFetchRequest() {
  yield takeEvery(TeamsActionTypes.FETCH_REQUEST, handleFetch);
}

function* watchSelectTeam() {
  yield takeLatest(TeamsActionTypes.SELECT_TEAM, handleSelect);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* teamsSaga() {
  yield all([fork(watchFetchRequest), fork(watchSelectTeam)]);
}

export default teamsSaga;

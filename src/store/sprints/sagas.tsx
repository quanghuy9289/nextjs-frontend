/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { delay } from "redux-saga";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApi, callApiWithAuthToken } from "../../utils/api";
import { insertOrUpdateSprintBoard } from "../board/actions";
import {
  createSprintRequest,
  createSprintSetResult,
  deleteSprintRequest,
  getSprintRequest,
  getSprints,
  getSprintsError,
  getSprintsResult,
  updateSprintBeginOnRequest,
  updateSprintEndOnRequest,
  updateSprintNameRequest,
} from "./actions";
import { ISprintCommonResult, ISprintGetResult, SprintsActionTypes } from "./types";

const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;
// const API_ENDPOINT = "https://api.opendota.com";

const getAuthToken = (state: IApplicationState) =>
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) =>
  state.cookies.cookies;

function* handleGetSprints(action: ReturnType<typeof getSprints>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/sprint", authToken);

    if (res.error) {
      yield put(getSprintsError(res.error));
    } else {
      yield put(getSprintsResult(res));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(getSprintsError(err.stack!));
    } else {
      yield put(getSprintsError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetSprints() {
  yield takeLatest(SprintsActionTypes.GET_SPRINTS, handleGetSprints);
}

function* handleCreateSprintRequest(action: ReturnType<typeof createSprintRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "put", API_ENDPOINT, "/sprint", authToken, action.payload);
    const cookies = yield select(getCookies);

    const resultData: ISprintCommonResult = res;
    yield put(createSprintSetResult(resultData));
    // Load the sprint
    if (!_.isUndefined(resultData.id)) {
      yield put(getSprintRequest(resultData.id));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(createSprintSetResult({errors: err.stack!}));
    } else {
      yield put(createSprintSetResult({errors: "An unknown error occured."}));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchCreateSprintRequest() {
  yield takeEvery(SprintsActionTypes.CREATE_SPRINT_REQUEST, handleCreateSprintRequest);
}

function* handleGetSprint(action: ReturnType<typeof getSprintRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/sprint/" + action.payload, authToken);

    if (res.error) {
      // yield put(getSprintSetError(res.error));
    } else {
      // yield put(getSprintSetResult(res));
      // Insert to board
      const resultData: ISprintGetResult = res;
      if (!_.isUndefined(resultData.sprint)) {
        yield put(insertOrUpdateSprintBoard(resultData.sprint!));
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getSprintSetError(err.stack!));
    } else {
      // yield put(getSprintSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetSprintRequest() {
  yield takeLatest(SprintsActionTypes.GET_SPRINT_REQUEST, handleGetSprint);
}

function* handleUpdateSprintNameRequest(action: ReturnType<typeof updateSprintNameRequest>) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/sprint/updatename",
      authToken,
      action.payload);

    const resultData: ISprintCommonResult = res;
    // yield put(createSprintSetResult(resultData));
    // // Reload the projects
    // yield put(getSprintsRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createSprintSetError(err.stack!));
    } else {
      // yield put(createSprintSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateSprintNameRequest() {
  yield takeLatest(SprintsActionTypes.UPDATE_SPRINT_NAME_REQUEST, handleUpdateSprintNameRequest);
}

function* handleUpdateSprintBeginOnRequest(action: ReturnType<typeof updateSprintBeginOnRequest>) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/sprint/updatebeginon",
      authToken,
      action.payload);

    const resultData: ISprintCommonResult = res;
    // yield put(createSprintSetResult(resultData));
    // // Reload the projects
    // yield put(getSprintsRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createSprintSetError(err.stack!));
    } else {
      // yield put(createSprintSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateSprintBeginOnRequest() {
  yield takeLatest(SprintsActionTypes.UPDATE_SPRINT_BEGINON_REQUEST, handleUpdateSprintBeginOnRequest);
}

function* handleUpdateSprintEndOnRequest(action: ReturnType<typeof updateSprintEndOnRequest>) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/sprint/updateendon",
      authToken,
      action.payload);

    const resultData: ISprintCommonResult = res;
    // yield put(createSprintSetResult(resultData));
    // // Reload the projects
    // yield put(getSprintsRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createSprintSetError(err.stack!));
    } else {
      // yield put(createSprintSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateSprintEndOnRequest() {
  yield takeLatest(SprintsActionTypes.UPDATE_SPRINT_ENDON_REQUEST, handleUpdateSprintEndOnRequest);
}

function* handleDeleteSprintRequest(action: ReturnType<typeof deleteSprintRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "delete",
      API_ENDPOINT,
      "/sprint",
      authToken,
      action.payload);

    const resultData: ISprintCommonResult = res;
    // yield put(createProjectSetResult(resultData));
    // // Reload the projects
    // yield put(getProjectsRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createProjectSetError(err.stack!));
    } else {
      // yield put(createProjectSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchDeleteSprintRequest() {
  yield takeEvery(SprintsActionTypes.DELETE_SPRINT_REQUEST, handleDeleteSprintRequest);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* sprintsSaga() {
  yield all([
    fork(watchGetSprints),
    fork(watchGetSprintRequest),
    fork(watchCreateSprintRequest),
    fork(watchUpdateSprintNameRequest),
    fork(watchUpdateSprintBeginOnRequest),
    fork(watchUpdateSprintEndOnRequest),
    fork(watchDeleteSprintRequest),
  ]);
}

export default sprintsSaga;

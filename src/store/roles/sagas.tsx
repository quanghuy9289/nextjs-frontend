/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApi, callApiWithAuthToken } from "../../utils/api";
import {
  getRoles,
  getRolesError,
  getRolesResult,
} from "./actions";
import { RolesActionTypes } from "./types";

const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;
// const API_ENDPOINT = "https://api.opendota.com";

const getAuthToken = (state: IApplicationState) =>
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) =>
  state.cookies.cookies;

function* handleGetRoles(action: ReturnType<typeof getRoles>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/role", authToken);

    if (res.error) {
      yield put(getRolesError(res.error));
    } else {
      yield put(getRolesResult(res));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(getRolesError(err.stack!));
    } else {
      yield put(getRolesError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetRoles() {
  yield takeLatest(RolesActionTypes.GET_ROLES, handleGetRoles);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* rolesSaga() {
  yield all([fork(watchGetRoles)]);
}

export default rolesSaga;

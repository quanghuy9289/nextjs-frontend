/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { delay } from "redux-saga";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApi, callApiWithAuthToken } from "../../utils/api";
import { graphqlRequestWithAuthToken } from "../../utils/graphqlAPI";
import {
  createUserRequest,
  createUserSetError,
  createUserSetResult,
  deleteUserRequest,
  deleteUserSetError,
  deleteUserSetResult,
  getUsers,
  getUsersError,
  getUsersResult,
  updateUserRequest,
  updateUserSetError,
  updateUserSetResult,
} from "./actions";
import { CREATE_USER, DELETE_USER, GET_USERS, UPDATE_USER } from "./query";
import { IUser, IUserCommonResult, IUserResult, UsersActionTypes } from "./types";

const API_ENDPOINT: string = process.env.API_ENDPOINT!;
const USER_GRAPHQL_PATH = "/user/query";
// const API_ENDPOINT = "https://api.opendota.com";

const getAuthToken = (state: IApplicationState) =>
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) => state.cookies.cookies;

function* handleGetUsers(action: ReturnType<typeof getUsers>) {
  try {
    yield call(delay, 500); // Debouncing written by takeLatest
    // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    // const authToken = yield select(getAuthToken);
    const variables = {
      input: {
        email: "",
      },
    };
    const res = yield call(graphqlRequestWithAuthToken, GET_USERS, API_ENDPOINT, USER_GRAPHQL_PATH, variables);

    if (res.error) {
      yield put(getUsersError(res.error));
    } else {
      const userResult: IUserResult = {
        users: res.users.list,
      };
      yield put(getUsersResult(userResult));
    }
  } catch (err) {
    if (err instanceof Error) {
      const result: IUserResult = {
        errors: err.stack!,
        users: [],
      };
      yield put(getUsersResult(result));
    } else {
      yield put(getUsersError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetUsers() {
  yield takeLatest(UsersActionTypes.GET_USERS, handleGetUsers);
}

function* handleUpdateUserRequest(action: ReturnType<typeof updateUserRequest>) {
  try {
    yield call(delay, 1000); // Debouncing written by takeLatest
    // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    // const authToken = yield select(getAuthToken);
    // const res = yield call(callApiWithAuthToken, "post", API_ENDPOINT, "/user", authToken, action.payload);
    const variables = {
      id: action.payload.id,
      input: {
        email: action.payload.email,
        fullname: action.payload.fullname,
        nickname: action.payload.nickname,
        avatarBase64: action.payload.avatarBase64,
      },
    };
    const res = yield call(graphqlRequestWithAuthToken, UPDATE_USER, API_ENDPOINT, USER_GRAPHQL_PATH, variables);
    const resultData: IUser = res.updateUser;
    yield put(updateUserSetResult(resultData));
    // // Reload the projects
    // yield put(getProjectsRequest());
  } catch (err) {
    if (err instanceof Error) {
      yield put(updateUserSetError(err.stack!));
    } else {
      yield put(updateUserSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateUserRequest() {
  yield takeEvery(UsersActionTypes.UPDATE_USER_REQUEST, handleUpdateUserRequest);
}

function* handleCreateUserRequest(action: ReturnType<typeof createUserRequest>) {
  try {
    yield call(delay, 1000); // Debouncing written by takeLatest
    // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const variables = {
      input: {
        email: action.payload.email,
        fullname: action.payload.fullname,
        nickname: action.payload.nickname,
        password: action.payload.password,
        avatarBase64: action.payload.avatarBase64,
        roleID: action.payload.roleID,
      },
    };
    const res = yield call(graphqlRequestWithAuthToken, CREATE_USER, API_ENDPOINT, USER_GRAPHQL_PATH, variables);

    const resultData: IUserResult = res;
    yield put(createUserSetResult(resultData));
    // // Reload the projects
    // yield put(getProjectsRequest());
  } catch (err) {
    if (err instanceof Error) {
      yield put(createUserSetError(err.stack!));
    } else {
      yield put(createUserSetError("An unknown error occured."));
    }
  }
}

function* watchCreateUserRequest() {
  yield takeEvery(UsersActionTypes.CREATE_USER_REQUEST, handleCreateUserRequest);
}

function* handleDeleteUserRequest(action: ReturnType<typeof deleteUserRequest>) {
  try {
    yield call(delay, 1000); // Debouncing written by takeLatest
    // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const variables = {
      id: action.payload,
    };
    const res = yield call(graphqlRequestWithAuthToken, DELETE_USER, API_ENDPOINT, USER_GRAPHQL_PATH, variables);

    yield put(deleteUserSetResult(res.deleteUser));
    // // Reload the projects
    // yield put(getProjectsRequest());
  } catch (err) {
    if (err instanceof Error) {
      yield put(deleteUserSetError(err.stack!));
    } else {
      yield put(deleteUserSetError("An unknown error occured."));
    }
  }
}

function* watchDeleteUserRequest() {
  yield takeEvery(UsersActionTypes.DELETE_USER_REQUEST, handleDeleteUserRequest);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* usersSaga() {
  yield all([
    fork(watchGetUsers),
    fork(watchUpdateUserRequest),
    fork(watchCreateUserRequest),
    fork(watchDeleteUserRequest),
  ]);
}

export default usersSaga;

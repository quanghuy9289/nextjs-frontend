/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this column.
 */

import _ from "lodash";
import { delay } from "redux-saga";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApiWithAuthToken } from "../../utils/api";
import {
  CONST_COOKIE_AUTHENTICATION_TOKEN,
} from "../../utils/constants";
import { insertOrUpdateColumnBoard } from "../board/actions";
import { setUserConfigCollapsedColumn } from "../logins/actions";
import {
  addOrRemoveColumnManagerRequest,
  collapseColumnRequest,
  createColumnRequest,
  createColumnSetError,
  createColumnSetResult,
  deleteColumnRequest,
  getColumnRequest,
  updateColumnSortOrderRequest,
  updateColumnTitleRequest,
} from "./actions";
import {
  ColumnsActionTypes,
  IColumnCommonResult,
  IColumnGetResult,
} from "./types";

const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;

const getAuthToken = (state: IApplicationState) =>
  // state.cookies.hasCookies ? state.cookies.cookies!.get(CONST_COOKIE_AUTHENTICATION_TOKEN) : "";
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) =>
  state.cookies.cookies;

// function* handleGetColumns(action: ReturnType<typeof getColumnsRequest>) {
//   try {
//     // To call async functions, use redux-saga's `call()`.
//     const authToken = yield select(getAuthToken);
//     const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/column", authToken);

//     if (res.error) {
//       yield put(getColumnsSetError(res.error));
//     } else {
//       yield put(getColumnsSetResult(res));
//     }
//   } catch (err) {
//     if (err instanceof Error) {
//       yield put(getColumnsSetError(err.stack!));
//     } else {
//       yield put(getColumnsSetError("An unknown error occured."));
//     }
//   }
// }

// // This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// // type, and run our saga
// function* watchGetColumnsRequest() {
//   yield takeLatest(ColumnsActionTypes.GET_COLUMNS_REQUEST, handleGetColumns);
// }

function* handleGetColumn(action: ReturnType<typeof getColumnRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/column/" + action.payload, authToken);

    if (res.error) {
      // yield put(getColumnSetError(res.error));
    } else {
      // yield put(getColumnSetResult(res));
      // Insert to board
      const resultData: IColumnGetResult = res;
      if (!_.isUndefined(resultData.column)) {
        yield put(insertOrUpdateColumnBoard(resultData.column!));
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getColumnSetError(err.stack!));
    } else {
      // yield put(getColumnSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetColumnRequest() {
  yield takeLatest(ColumnsActionTypes.GET_COLUMN_REQUEST, handleGetColumn);
}

function* handleCreateColumnRequest(action: ReturnType<typeof createColumnRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "put", API_ENDPOINT, "/column", authToken, action.payload);
    const cookies = yield select(getCookies);

    const resultData: IColumnCommonResult = res;
    yield put(createColumnSetResult(resultData));
    // Load the column
    if (!_.isUndefined(resultData.id)) {
      yield put(getColumnRequest(resultData.id));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(createColumnSetError(err.stack!));
    } else {
      yield put(createColumnSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchCreateColumnRequest() {
  yield takeEvery(ColumnsActionTypes.CREATE_COLUMN_REQUEST, handleCreateColumnRequest);
}

function* handleUpdateColumnTitleRequest(action: ReturnType<typeof updateColumnTitleRequest>) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/column/updatetitle",
      authToken,
      action.payload);

    const resultData: IColumnCommonResult = res;
    // yield put(createColumnSetResult(resultData));
    // // Reload the projects
    // yield put(getColumnsRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createColumnSetError(err.stack!));
    } else {
      // yield put(createColumnSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateColumnTitleRequest() {
  yield takeLatest(ColumnsActionTypes.UPDATE_COLUMN_TITLE_REQUEST, handleUpdateColumnTitleRequest);
}

function* handleAddOrRemoveColumnManagerRequest(action: ReturnType<typeof addOrRemoveColumnManagerRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/column/addorremovemanager",
      authToken,
      action.payload);

    const resultData: IColumnCommonResult = res;
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
function* watchAddOrRemoveColumnManagerRequest() {
  yield takeEvery(ColumnsActionTypes.ADD_OR_REMOVE_COLUMN_MANAGER_REQUEST, handleAddOrRemoveColumnManagerRequest);
}

function* handleUpdateColumnSortOrderRequest(action: ReturnType<typeof updateColumnSortOrderRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/column/updatesortorder",
      authToken,
      action.payload);

    const resultData: IColumnCommonResult = res;
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
function* watchUpdateColumnSortOrderRequest() {
  yield takeEvery(ColumnsActionTypes.UPDATE_COLUMN_SORT_ORDER_REQUEST, handleUpdateColumnSortOrderRequest);
}

function* handleCollapseColumnRequest(action: ReturnType<typeof collapseColumnRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/column/collapse",
      authToken,
      action.payload);

    const resultData: IColumnCommonResult = res;
    if (resultData.errors === undefined) {
      // Update the user config
      yield(put(setUserConfigCollapsedColumn(action.payload.id, action.payload.collapsed)));
    }
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
function* watchCollapseColumnRequest() {
  yield takeEvery(ColumnsActionTypes.COLLAPSE_COLUMN_REQUEST, handleCollapseColumnRequest);
}

function* handleDeleteColumnRequest(action: ReturnType<typeof deleteColumnRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "delete",
      API_ENDPOINT,
      "/column",
      authToken,
      action.payload);

    const resultData: IColumnCommonResult = res;
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
function* watchDeleteColumnRequest() {
  yield takeEvery(ColumnsActionTypes.DELETE_COLUMN_REQUEST, handleDeleteColumnRequest);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* columnsSaga() {
  yield all([
    fork(watchCreateColumnRequest),
    fork(watchGetColumnRequest),
    fork(watchUpdateColumnTitleRequest),
    fork(watchAddOrRemoveColumnManagerRequest),
    fork(watchUpdateColumnSortOrderRequest),
    fork(watchDeleteColumnRequest),
    fork(watchCollapseColumnRequest),
  ]);
}

export default columnsSaga;

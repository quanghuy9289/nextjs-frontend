/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this priority.
 */

import _ from "lodash";
import { delay } from "redux-saga";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApiWithAuthToken } from "../../utils/api";
import {
  CONST_COOKIE_AUTHENTICATION_TOKEN,
} from "../../utils/constants";
import { insertOrUpdatePriorityBoard } from "../board/actions";
import {
  addOrRemovePriorityManagerRequest,
  createPriorityRequest,
  createPrioritySetError,
  createPrioritySetResult,
  deletePriorityRequest,
  getPriorityRequest,
  updatePrioritySortOrderRequest,
  updatePriorityTitleRequest,
} from "./actions";
import {
  IPriorityCommonResult,
  IPriorityGetResult,
  PrioritiesActionTypes,
} from "./types";

const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;

const getAuthToken = (state: IApplicationState) =>
  // state.cookies.hasCookies ? state.cookies.cookies!.get(CONST_COOKIE_AUTHENTICATION_TOKEN) : "";
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) =>
  state.cookies.cookies;

// function* handleGetPriorities(action: ReturnType<typeof getPrioritiesRequest>) {
//   try {
//     // To call async functions, use redux-saga's `call()`.
//     const authToken = yield select(getAuthToken);
//     const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/priority", authToken);

//     if (res.error) {
//       yield put(getPrioritiesSetError(res.error));
//     } else {
//       yield put(getPrioritiesSetResult(res));
//     }
//   } catch (err) {
//     if (err instanceof Error) {
//       yield put(getPrioritiesSetError(err.stack!));
//     } else {
//       yield put(getPrioritiesSetError("An unknown error occured."));
//     }
//   }
// }

// // This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// // type, and run our saga
// function* watchGetPrioritiesRequest() {
//   yield takeLatest(PrioritiesActionTypes.GET_PRIORITYS_REQUEST, handleGetPriorities);
// }

function* handleGetPriority(action: ReturnType<typeof getPriorityRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/priority/" + action.payload, authToken);

    if (res.error) {
      // yield put(getPrioritySetError(res.error));
    } else {
      // yield put(getPrioritySetResult(res));
      // Insert to board
      const resultData: IPriorityGetResult = res;
      if (!_.isUndefined(resultData.priority)) {
        yield put(insertOrUpdatePriorityBoard(resultData.priority!));
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getPrioritySetError(err.stack!));
    } else {
      // yield put(getPrioritySetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetPriorityRequest() {
  yield takeLatest(PrioritiesActionTypes.GET_PRIORITY_REQUEST, handleGetPriority);
}

function* handleCreatePriorityRequest(action: ReturnType<typeof createPriorityRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "put", API_ENDPOINT, "/priority", authToken, action.payload);
    const cookies = yield select(getCookies);

    const resultData: IPriorityCommonResult = res;
    yield put(createPrioritySetResult(resultData));
    // Load the priority
    if (!_.isUndefined(resultData.id)) {
      yield put(getPriorityRequest(resultData.id));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(createPrioritySetError(err.stack!));
    } else {
      yield put(createPrioritySetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchCreatePriorityRequest() {
  yield takeEvery(PrioritiesActionTypes.CREATE_PRIORITY_REQUEST, handleCreatePriorityRequest);
}

function* handleUpdatePriorityTitleRequest(action: ReturnType<typeof updatePriorityTitleRequest>) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/priority/updatetitle",
      authToken,
      action.payload);

    const resultData: IPriorityCommonResult = res;
    // yield put(createPrioritySetResult(resultData));
    // // Reload the projects
    // yield put(getPrioritiesRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createPrioritySetError(err.stack!));
    } else {
      // yield put(createPrioritySetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdatePriorityTitleRequest() {
  yield takeLatest(PrioritiesActionTypes.UPDATE_PRIORITY_TITLE_REQUEST, handleUpdatePriorityTitleRequest);
}

function* handleAddOrRemovePriorityManagerRequest(action: ReturnType<typeof addOrRemovePriorityManagerRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/priority/addorremovemanager",
      authToken,
      action.payload);

    const resultData: IPriorityCommonResult = res;
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
function* watchAddOrRemovePriorityManagerRequest() {
  yield takeEvery(
    PrioritiesActionTypes.ADD_OR_REMOVE_PRIORITY_MANAGER_REQUEST,
    handleAddOrRemovePriorityManagerRequest,
  );
}

function* handleUpdatePrioritySortOrderRequest(action: ReturnType<typeof updatePrioritySortOrderRequest>) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/priority/updatesortorder",
      authToken,
      action.payload);

    const resultData: IPriorityCommonResult = res;
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
function* watchUpdatePrioritySortOrderRequest() {
  yield takeEvery(PrioritiesActionTypes.UPDATE_PRIORITY_SORT_ORDER_REQUEST, handleUpdatePrioritySortOrderRequest);
}

function* handleDeletePriorityRequest(action: ReturnType<typeof deletePriorityRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "delete",
      API_ENDPOINT,
      "/priority",
      authToken,
      action.payload);

    const resultData: IPriorityCommonResult = res;
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
function* watchDeletePriorityRequest() {
  yield takeEvery(PrioritiesActionTypes.DELETE_PRIORITY_REQUEST, handleDeletePriorityRequest);
}

function* handleUpdatePriorityColorRequest(action: ReturnType<typeof updatePriorityTitleRequest>) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/priority/updatecolor",
      authToken,
      action.payload);

    const resultData: IPriorityCommonResult = res;
    // yield put(createPrioritySetResult(resultData));
    // // Reload the projects
    // yield put(getPrioritiesRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createPrioritySetError(err.stack!));
    } else {
      // yield put(createPrioritySetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdatePriorityColorRequest() {
  yield takeLatest(PrioritiesActionTypes.UPDATE_PRIORITY_COLOR_REQUEST, handleUpdatePriorityColorRequest);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* prioritiesSaga() {
  yield all([
    fork(watchCreatePriorityRequest),
    fork(watchGetPriorityRequest),
    fork(watchUpdatePriorityTitleRequest),
    fork(watchAddOrRemovePriorityManagerRequest),
    fork(watchUpdatePrioritySortOrderRequest),
    fork(watchDeletePriorityRequest),
    fork(watchUpdatePriorityColorRequest),
  ]);
}

export default prioritiesSaga;

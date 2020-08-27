/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this taskdescription.
 */

import _ from "lodash";
import { delay } from "redux-saga";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApiWithAuthToken } from "../../utils/api";
import {
  CONST_COOKIE_AUTHENTICATION_TOKEN,
} from "../../utils/constants";
import { insertOrUpdateTaskDescriptionBoard } from "../board/actions";
import {
  addOrRemoveTaskDescriptionManagerRequest,
  createTaskDescriptionRequest,
  createTaskDescriptionSetError,
  createTaskDescriptionSetResult,
  deleteTaskDescriptionRequest,
  getTaskDescriptionRequest,
  updateTaskDescriptionContentRequest,
  updateTaskDescriptionSortOrderRequest,
} from "./actions";
import {
  ITaskDescriptionCommonResult,
  ITaskDescriptionGetResult,
  TaskDescriptionsActionTypes,
} from "./types";

const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;

const getAuthToken = (state: IApplicationState) =>
  // state.cookies.hasCookies ? state.cookies.cookies!.get(CONST_COOKIE_AUTHENTICATION_TOKEN) : "";
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) =>
  state.cookies.cookies;

// function* handleGetTaskDescriptions(action: ReturnType<typeof getTaskDescriptionsRequest>) {
//   try {
//     // To call async functions, use redux-saga's `call()`.
//     const authToken = yield select(getAuthToken);
//     const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/taskdescription", authToken);

//     if (res.error) {
//       yield put(getTaskDescriptionsSetError(res.error));
//     } else {
//       yield put(getTaskDescriptionsSetResult(res));
//     }
//   } catch (err) {
//     if (err instanceof Error) {
//       yield put(getTaskDescriptionsSetError(err.stack!));
//     } else {
//       yield put(getTaskDescriptionsSetError("An unknown error occured."));
//     }
//   }
// }

// // This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// // type, and run our saga
// function* watchGetTaskDescriptionsRequest() {
//   yield takeLatest(TaskDescriptionsActionTypes.GET_TASKDESCRIPTIONS_REQUEST, handleGetTaskDescriptions);
// }

function* handleGetTaskDescription(action: ReturnType<typeof getTaskDescriptionRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/taskdescription/" + action.payload, authToken);

    // yield put(getTaskDescriptionSetResult(res));
    // Insert to board
    const resultData: ITaskDescriptionGetResult = res;
    if (!_.isUndefined(resultData.taskdescription)) {
      yield put(insertOrUpdateTaskDescriptionBoard(resultData.taskdescription!));
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getTaskDescriptionSetError(err.stack!));
    } else {
      // yield put(getTaskDescriptionSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetTaskDescriptionRequest() {
  yield takeLatest(TaskDescriptionsActionTypes.GET_TASKDESCRIPTION_REQUEST, handleGetTaskDescription);
}

function* handleCreateTaskDescriptionRequest(action: ReturnType<typeof createTaskDescriptionRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "put", API_ENDPOINT, "/taskdescription", authToken, action.payload);
    const cookies = yield select(getCookies);

    const resultData: ITaskDescriptionCommonResult = res;
    yield put(createTaskDescriptionSetResult(resultData));
    // Load the taskdescription
    if (!_.isUndefined(resultData.id)) {
      yield put(getTaskDescriptionRequest(resultData.id));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(createTaskDescriptionSetError(err.stack!));
    } else {
      yield put(createTaskDescriptionSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchCreateTaskDescriptionRequest() {
  yield takeEvery(TaskDescriptionsActionTypes.CREATE_TASKDESCRIPTION_REQUEST, handleCreateTaskDescriptionRequest);
}

function* handleUpdateTaskDescriptionContentRequest(action: ReturnType<typeof updateTaskDescriptionContentRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/taskdescription/updatecontent",
      authToken,
      action.payload);

    const resultData: ITaskDescriptionCommonResult = res;
    // yield put(createTaskDescriptionSetResult(resultData));
    // // Reload the projects
    // yield put(getTaskDescriptionsRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createTaskDescriptionSetError(err.stack!));
    } else {
      // yield put(createTaskDescriptionSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateTaskDescriptionContentRequest() {
  yield takeEvery(
    TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_CONTENT_REQUEST,
    handleUpdateTaskDescriptionContentRequest,
  );
}

function* handleAddOrRemoveTaskDescriptionManagerRequest(
  action: ReturnType<typeof addOrRemoveTaskDescriptionManagerRequest>,
) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/taskdescription/addorremovemanager",
      authToken,
      action.payload);

    const resultData: ITaskDescriptionCommonResult = res;
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
function* watchAddOrRemoveTaskDescriptionManagerRequest() {
  yield takeEvery(
    TaskDescriptionsActionTypes.ADD_OR_REMOVE_TASKDESCRIPTION_MANAGER_REQUEST,
    handleAddOrRemoveTaskDescriptionManagerRequest,
  );
}

function* handleUpdateTaskDescriptionSortOrderRequest(
  action: ReturnType<typeof updateTaskDescriptionSortOrderRequest>,
) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/taskdescription/updatesortorder",
      authToken,
      action.payload);

    const resultData: ITaskDescriptionCommonResult = res;
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
function* watchUpdateTaskDescriptionSortOrderRequest() {
  yield takeEvery(
    TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_SORT_ORDER_REQUEST,
    handleUpdateTaskDescriptionSortOrderRequest,
  );
}

function* handleDeleteTaskDescriptionRequest(action: ReturnType<typeof deleteTaskDescriptionRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "delete",
      API_ENDPOINT,
      "/taskdescription",
      authToken,
      action.payload);

    const resultData: ITaskDescriptionCommonResult = res;
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
function* watchDeleteTaskDescriptionRequest() {
  yield takeEvery(TaskDescriptionsActionTypes.DELETE_TASKDESCRIPTION_REQUEST, handleDeleteTaskDescriptionRequest);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* taskdescriptionsSaga() {
  yield all([
    fork(watchCreateTaskDescriptionRequest),
    fork(watchGetTaskDescriptionRequest),
    fork(watchUpdateTaskDescriptionContentRequest),
    fork(watchAddOrRemoveTaskDescriptionManagerRequest),
    fork(watchUpdateTaskDescriptionSortOrderRequest),
    fork(watchDeleteTaskDescriptionRequest),
  ]);
}

export default taskdescriptionsSaga;

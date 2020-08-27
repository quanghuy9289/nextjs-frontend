/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this comment.
 */

import _ from "lodash";
import { delay } from "redux-saga";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApiWithAuthToken } from "../../utils/api";
import {
  CONST_COOKIE_AUTHENTICATION_TOKEN,
} from "../../utils/constants";
import { insertOrUpdateCommentsBoard } from "../board/actions";
import {
  addOrRemoveCommentManagerRequest,
  createCommentRequest,
  createCommentSetError,
  createCommentSetResult,
  deleteCommentRequest,
  getCommentRequest,
  getCommentsOfTaskRequest,
  getNewerCommentsOfTaskRequest,
  getNewerCommentsOfTaskSetResult,
  getOlderCommentsOfTaskRequest,
  getOlderCommentsOfTaskSetResult,
  updateCommentContentRequest,
  updateCommentSortOrderRequest,
} from "./actions";
import {
  CommentsActionTypes,
  ICommentCommonResult,
  ICommentGetResult,
} from "./types";

const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;

const getAuthToken = (state: IApplicationState) =>
  // state.cookies.hasCookies ? state.cookies.cookies!.get(CONST_COOKIE_AUTHENTICATION_TOKEN) : "";
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) =>
  state.cookies.cookies;

// function* handleGetComments(action: ReturnType<typeof getCommentsRequest>) {
//   try {
//     // To call async functions, use redux-saga's `call()`.
//     const authToken = yield select(getAuthToken);
//     const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/comment", authToken);

//     if (res.error) {
//       yield put(getCommentsSetError(res.error));
//     } else {
//       yield put(getCommentsSetResult(res));
//     }
//   } catch (err) {
//     if (err instanceof Error) {
//       yield put(getCommentsSetError(err.stack!));
//     } else {
//       yield put(getCommentsSetError("An unknown error occured."));
//     }
//   }
// }

// // This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// // type, and run our saga
// function* watchGetCommentsRequest() {
//   yield takeLatest(CommentsActionTypes.GET_COMMENTS_REQUEST, handleGetComments);
// }

function* handleGetComment(action: ReturnType<typeof getCommentRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/comment/" + action.payload, authToken);

    // yield put(getCommentSetResult(res));
    // Insert to board
    const resultData: ICommentGetResult = res;
    if (!_.isUndefined(resultData.comments) && !_.isUndefined(resultData.taskID)) {
      // Add to top of the comments list when loaded
      yield put(insertOrUpdateCommentsBoard(resultData.comments!, resultData.taskID!, true));
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getCommentSetError(err.stack!));
    } else {
      // yield put(getCommentSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetCommentRequest() {
  yield takeLatest(CommentsActionTypes.GET_COMMENT_REQUEST, handleGetComment);
}

function* handleGetCommentsOfTask(action: ReturnType<typeof getCommentsOfTaskRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/comment/oftask/" + action.payload, authToken);
    // yield put(getCommentSetResult(res));
    // Insert to board
    const resultData: ICommentGetResult = res;
    if (!_.isUndefined(resultData.comments) && !_.isUndefined(resultData.taskID)) {
      // Add to bottom of the comments list when loaded
      yield put(insertOrUpdateCommentsBoard(resultData.comments!, resultData.taskID!, false));
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getCommentSetError(err.stack!));
    } else {
      // yield put(getCommentSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetCommentsOfTaskRequest() {
  yield takeLatest(CommentsActionTypes.GET_COMMENTS_OF_TASK_REQUEST, handleGetCommentsOfTask);
}

function* handleGetNewerCommentsOfTask(action: ReturnType<typeof getNewerCommentsOfTaskRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(
      callApiWithAuthToken,
      "get",
      API_ENDPOINT,
      `/comment/neweroftask/${action.payload.taskID}/${action.payload.newerThanEpochSeconds}`,
      authToken);
    // yield put(getCommentSetResult(res));
    // Insert to board
    const resultData: ICommentGetResult = res;
    if (!_.isUndefined(resultData.comments) && !_.isUndefined(resultData.taskID)) {
      // Add to top of the comments list when loaded
      yield put(insertOrUpdateCommentsBoard(resultData.comments!, resultData.taskID!, true));
    }
    yield put(getNewerCommentsOfTaskSetResult(resultData));
  } catch (err) {
    if (err instanceof Error) {
      yield put(getNewerCommentsOfTaskSetResult({errors: err.stack!}));
    } else {
      yield put(getNewerCommentsOfTaskSetResult({errors: "An unknown error occured."}));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetNewerCommentsOfTaskRequest() {
  yield takeLatest(CommentsActionTypes.GET_NEWER_COMMENTS_OF_TASK_REQUEST, handleGetNewerCommentsOfTask);
}

function* handleGetOlderCommentsOfTask(action: ReturnType<typeof getOlderCommentsOfTaskRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(
      callApiWithAuthToken,
      "get",
      API_ENDPOINT,
      `/comment/olderoftask/${action.payload.taskID}/${action.payload.olderThanEpochSeconds}`,
      authToken);
    // yield put(getCommentSetResult(res));
    // Insert to board
    const resultData: ICommentGetResult = res;
    if (!_.isUndefined(resultData.comments) && !_.isUndefined(resultData.taskID)) {
      // Add to bottom of the comments list when loaded
      yield put(insertOrUpdateCommentsBoard(resultData.comments!, resultData.taskID!, false));
    }
    yield put(getOlderCommentsOfTaskSetResult(resultData));
  } catch (err) {
    if (err instanceof Error) {
      yield put(getOlderCommentsOfTaskSetResult({errors: err.stack!}));
    } else {
      yield put(getOlderCommentsOfTaskSetResult({errors: "An unknown error occured."}));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetOlderCommentsOfTaskRequest() {
  yield takeLatest(CommentsActionTypes.GET_OLDER_COMMENTS_OF_TASK_REQUEST, handleGetOlderCommentsOfTask);
}

function* handleCreateCommentRequest(action: ReturnType<typeof createCommentRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "put", API_ENDPOINT, "/comment", authToken, action.payload);
    const cookies = yield select(getCookies);

    const resultData: ICommentCommonResult = res;
    yield put(createCommentSetResult(resultData));
    // Load the comment
    if (!_.isUndefined(resultData.id)) {
      yield put(getCommentRequest(resultData.id));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(createCommentSetError(err.stack!));
    } else {
      yield put(createCommentSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchCreateCommentRequest() {
  yield takeEvery(CommentsActionTypes.CREATE_COMMENT_REQUEST, handleCreateCommentRequest);
}

function* handleUpdateCommentContentRequest(action: ReturnType<typeof updateCommentContentRequest>) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/comment/updatecontent",
      authToken,
      action.payload);

    const resultData: ICommentCommonResult = res;
    // yield put(createCommentSetResult(resultData));
    // // Reload the projects
    // yield put(getCommentsRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createCommentSetError(err.stack!));
    } else {
      // yield put(createCommentSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateCommentContentRequest() {
  yield takeLatest(
    CommentsActionTypes.UPDATE_COMMENT_CONTENT_REQUEST,
    handleUpdateCommentContentRequest,
  );
}

function* handleAddOrRemoveCommentManagerRequest(
  action: ReturnType<typeof addOrRemoveCommentManagerRequest>,
) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/comment/addorremovemanager",
      authToken,
      action.payload);

    const resultData: ICommentCommonResult = res;
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
function* watchAddOrRemoveCommentManagerRequest() {
  yield takeEvery(
    CommentsActionTypes.ADD_OR_REMOVE_COMMENT_MANAGER_REQUEST,
    handleAddOrRemoveCommentManagerRequest,
  );
}

function* handleUpdateCommentSortOrderRequest(
  action: ReturnType<typeof updateCommentSortOrderRequest>,
) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/comment/updatesortorder",
      authToken,
      action.payload);

    const resultData: ICommentCommonResult = res;
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
function* watchUpdateCommentSortOrderRequest() {
  yield takeEvery(
    CommentsActionTypes.UPDATE_COMMENT_SORT_ORDER_REQUEST,
    handleUpdateCommentSortOrderRequest,
  );
}

function* handleDeleteCommentRequest(action: ReturnType<typeof deleteCommentRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "delete",
      API_ENDPOINT,
      "/comment",
      authToken,
      action.payload);

    const resultData: ICommentCommonResult = res;
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
function* watchDeleteCommentRequest() {
  yield takeEvery(CommentsActionTypes.DELETE_COMMENT_REQUEST, handleDeleteCommentRequest);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* commentsSaga() {
  yield all([
    fork(watchCreateCommentRequest),
    fork(watchGetCommentRequest),
    fork(watchUpdateCommentContentRequest),
    fork(watchAddOrRemoveCommentManagerRequest),
    fork(watchUpdateCommentSortOrderRequest),
    fork(watchDeleteCommentRequest),
    fork(watchGetCommentsOfTaskRequest),
    fork(watchGetNewerCommentsOfTaskRequest),
    fork(watchGetOlderCommentsOfTaskRequest),
  ]);
}

export default commentsSaga;

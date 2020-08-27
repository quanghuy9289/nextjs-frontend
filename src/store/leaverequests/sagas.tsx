/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this leaveRequest.
 */

import _ from "lodash";
import { delay } from "redux-saga";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApiWithAuthToken } from "../../utils/api";
import {
  CONST_COOKIE_AUTHENTICATION_TOKEN,
} from "../../utils/constants";
import { insertOrUpdateLeaveRequestsUser } from "../users/actions";
import {
  addOrRemoveLeaveRequestManagerRequest,
  createLeaveRequestRequest,
  createLeaveRequestSetError,
  createLeaveRequestSetResult,
  deleteLeaveRequestRequest,
  getLeaveRequestRequest,
  getLeaveRequestsOfUserRequest,
  getNewerLeaveRequestsOfUserRequest,
  getNewerLeaveRequestsOfUserSetResult,
  getOlderLeaveRequestsOfUserRequest,
  getOlderLeaveRequestsOfUserSetResult,
  updateLeaveRequestContentRequest,
  updateLeaveRequestSortOrderRequest,
} from "./actions";
import {
  ILeaveRequestCommonResult,
  ILeaveRequestGetResult,
  LeaveRequestsActionTypes,
} from "./types";

const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;

const getAuthToken = (state: IApplicationState) =>
  // state.cookies.hasCookies ? state.cookies.cookies!.get(CONST_COOKIE_AUTHENTICATION_TOKEN) : "";
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) =>
  state.cookies.cookies;

// function* handleGetLeaveRequests(action: ReturnType<typeof getLeaveRequestsRequest>) {
//   try {
//     // To call async functions, use redux-saga's `call()`.
//     const authToken = yield select(getAuthToken);
//     const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/leaverequest", authToken);

//     if (res.error) {
//       yield put(getLeaveRequestsSetError(res.error));
//     } else {
//       yield put(getLeaveRequestsSetResult(res));
//     }
//   } catch (err) {
//     if (err instanceof Error) {
//       yield put(getLeaveRequestsSetError(err.stack!));
//     } else {
//       yield put(getLeaveRequestsSetError("An unknown error occured."));
//     }
//   }
// }

// // This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// // type, and run our saga
// function* watchGetLeaveRequestsRequest() {
//   yield takeLatest(LeaveRequestsActionTypes.GET_LEAVEREQUESTS_REQUEST, handleGetLeaveRequests);
// }

function* handleGetLeaveRequest(action: ReturnType<typeof getLeaveRequestRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/leaverequest/" + action.payload, authToken);

    // yield put(getLeaveRequestSetResult(res));
    // Insert to board
    const resultData: ILeaveRequestGetResult = res;
    if (!_.isUndefined(resultData.leaveRequests) && !_.isUndefined(resultData.requesterUserID)) {
      // Add to top of the leaveRequests list when loaded
      yield put(insertOrUpdateLeaveRequestsUser(resultData.leaveRequests!, resultData.requesterUserID!, true));
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getLeaveRequestSetError(err.stack!));
    } else {
      // yield put(getLeaveRequestSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetLeaveRequestRequest() {
  yield takeLatest(LeaveRequestsActionTypes.GET_LEAVEREQUEST_REQUEST, handleGetLeaveRequest);
}

function* handleGetLeaveRequestsOfUser(action: ReturnType<typeof getLeaveRequestsOfUserRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(
      callApiWithAuthToken,
      "get",
      API_ENDPOINT,
      "/leaverequest/ofuser/" + action.payload,
      authToken,
    );
    // yield put(getLeaveRequestSetResult(res));
    // Insert to board
    const resultData: ILeaveRequestGetResult = res;
    if (!_.isUndefined(resultData.leaveRequests) && !_.isUndefined(resultData.requesterUserID)) {
      // Add to bottom of the leaveRequests list when loaded
      yield put(insertOrUpdateLeaveRequestsUser(resultData.leaveRequests!, resultData.requesterUserID!, false));
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getLeaveRequestSetError(err.stack!));
    } else {
      // yield put(getLeaveRequestSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetLeaveRequestsOfUserRequest() {
  yield takeLatest(LeaveRequestsActionTypes.GET_LEAVEREQUESTS_OF_TASK_REQUEST, handleGetLeaveRequestsOfUser);
}

function* handleGetNewerLeaveRequestsOfUser(action: ReturnType<typeof getNewerLeaveRequestsOfUserRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(
      callApiWithAuthToken,
      "get",
      API_ENDPOINT,
      `/leaverequest/newerofuser/${action.payload.userID}/${action.payload.newerThanEpochSeconds}`,
      authToken);
    // yield put(getLeaveRequestSetResult(res));
    // Insert to board
    const resultData: ILeaveRequestGetResult = res;
    if (!_.isUndefined(resultData.leaveRequests) && !_.isUndefined(resultData.requesterUserID)) {
      // Add to top of the leaveRequests list when loaded
      yield put(insertOrUpdateLeaveRequestsUser(resultData.leaveRequests!, resultData.requesterUserID!, true));
    }
    yield put(getNewerLeaveRequestsOfUserSetResult(resultData));
  } catch (err) {
    if (err instanceof Error) {
      yield put(getNewerLeaveRequestsOfUserSetResult({errors: err.stack!}));
    } else {
      yield put(getNewerLeaveRequestsOfUserSetResult({errors: "An unknown error occured."}));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetNewerLeaveRequestsOfUserRequest() {
  yield takeLatest(LeaveRequestsActionTypes.GET_NEWER_LEAVEREQUESTS_OF_TASK_REQUEST, handleGetNewerLeaveRequestsOfUser);
}

function* handleGetOlderLeaveRequestsOfUser(action: ReturnType<typeof getOlderLeaveRequestsOfUserRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(
      callApiWithAuthToken,
      "get",
      API_ENDPOINT,
      `/leaverequest/olderofuser/${action.payload.userID}/${action.payload.olderThanEpochSeconds}`,
      authToken);
    // yield put(getLeaveRequestSetResult(res));
    // Insert to board
    const resultData: ILeaveRequestGetResult = res;
    if (!_.isUndefined(resultData.leaveRequests) && !_.isUndefined(resultData.requesterUserID)) {
      // Add to bottom of the leaveRequests list when loaded
      yield put(insertOrUpdateLeaveRequestsUser(resultData.leaveRequests!, resultData.requesterUserID!, false));
    }
    yield put(getOlderLeaveRequestsOfUserSetResult(resultData));
  } catch (err) {
    if (err instanceof Error) {
      yield put(getOlderLeaveRequestsOfUserSetResult({errors: err.stack!}));
    } else {
      yield put(getOlderLeaveRequestsOfUserSetResult({errors: "An unknown error occured."}));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetOlderLeaveRequestsOfUserRequest() {
  yield takeLatest(LeaveRequestsActionTypes.GET_OLDER_LEAVEREQUESTS_OF_TASK_REQUEST, handleGetOlderLeaveRequestsOfUser);
}

function* handleCreateLeaveRequestRequest(action: ReturnType<typeof createLeaveRequestRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "put", API_ENDPOINT, "/leaverequest", authToken, action.payload);
    const cookies = yield select(getCookies);

    const resultData: ILeaveRequestCommonResult = res;
    yield put(createLeaveRequestSetResult(resultData));
    // Load the leaveRequest
    if (!_.isUndefined(resultData.id)) {
      yield put(getLeaveRequestRequest(resultData.id));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(createLeaveRequestSetError(err.stack!));
    } else {
      yield put(createLeaveRequestSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchCreateLeaveRequestRequest() {
  yield takeEvery(LeaveRequestsActionTypes.CREATE_LEAVEREQUEST_REQUEST, handleCreateLeaveRequestRequest);
}

function* handleUpdateLeaveRequestContentRequest(action: ReturnType<typeof updateLeaveRequestContentRequest>) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/leaverequest/updatecontent",
      authToken,
      action.payload);

    const resultData: ILeaveRequestCommonResult = res;
    // yield put(createLeaveRequestSetResult(resultData));
    // // Reload the projects
    // yield put(getLeaveRequestsRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createLeaveRequestSetError(err.stack!));
    } else {
      // yield put(createLeaveRequestSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateLeaveRequestContentRequest() {
  yield takeLatest(
    LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_CONTENT_REQUEST,
    handleUpdateLeaveRequestContentRequest,
  );
}

function* handleAddOrRemoveLeaveRequestManagerRequest(
  action: ReturnType<typeof addOrRemoveLeaveRequestManagerRequest>,
) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/leaverequest/addorremovemanager",
      authToken,
      action.payload);

    const resultData: ILeaveRequestCommonResult = res;
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
function* watchAddOrRemoveLeaveRequestManagerRequest() {
  yield takeEvery(
    LeaveRequestsActionTypes.ADD_OR_REMOVE_LEAVEREQUEST_MANAGER_REQUEST,
    handleAddOrRemoveLeaveRequestManagerRequest,
  );
}

function* handleUpdateLeaveRequestSortOrderRequest(
  action: ReturnType<typeof updateLeaveRequestSortOrderRequest>,
) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/leaverequest/updatesortorder",
      authToken,
      action.payload);

    const resultData: ILeaveRequestCommonResult = res;
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
function* watchUpdateLeaveRequestSortOrderRequest() {
  yield takeEvery(
    LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_SORT_ORDER_REQUEST,
    handleUpdateLeaveRequestSortOrderRequest,
  );
}

function* handleDeleteLeaveRequestRequest(action: ReturnType<typeof deleteLeaveRequestRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "delete",
      API_ENDPOINT,
      "/leaverequest",
      authToken,
      action.payload);

    const resultData: ILeaveRequestCommonResult = res;
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
function* watchDeleteLeaveRequestRequest() {
  yield takeEvery(LeaveRequestsActionTypes.DELETE_LEAVEREQUEST_REQUEST, handleDeleteLeaveRequestRequest);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* leaveRequestsSaga() {
  yield all([
    fork(watchCreateLeaveRequestRequest),
    fork(watchGetLeaveRequestRequest),
    fork(watchUpdateLeaveRequestContentRequest),
    fork(watchAddOrRemoveLeaveRequestManagerRequest),
    fork(watchUpdateLeaveRequestSortOrderRequest),
    fork(watchDeleteLeaveRequestRequest),
    fork(watchGetLeaveRequestsOfUserRequest),
    fork(watchGetNewerLeaveRequestsOfUserRequest),
    fork(watchGetOlderLeaveRequestsOfUserRequest),
  ]);
}

export default leaveRequestsSaga;

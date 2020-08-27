/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this unit.
 */

import _ from "lodash";
import { delay } from "redux-saga";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApiWithAuthToken } from "../../utils/api";
import {
  CONST_COOKIE_AUTHENTICATION_TOKEN,
} from "../../utils/constants";
import { insertOrUpdateUnitBoard } from "../board/actions";
import {
  addOrRemoveUnitManagerRequest,
  completeUnitRequest,
  completeUnitSetResult,
  createUnitRequest,
  createUnitSetError,
  createUnitSetResult,
  deleteUnitRequest,
  getUnitRequest,
  updateUnitPointsRequest,
  updateUnitSortOrderRequest,
  updateUnitTitleRequest,
} from "./actions";
import {
  IUnitCommonResult,
  IUnitGetResult,
  UnitsActionTypes,
} from "./types";

const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;

const getAuthToken = (state: IApplicationState) =>
  // state.cookies.hasCookies ? state.cookies.cookies!.get(CONST_COOKIE_AUTHENTICATION_TOKEN) : "";
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) =>
  state.cookies.cookies;

// function* handleGetUnits(action: ReturnType<typeof getUnitsRequest>) {
//   try {
//     // To call async functions, use redux-saga's `call()`.
//     const authToken = yield select(getAuthToken);
//     const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/unit", authToken);

//     if (res.error) {
//       yield put(getUnitsSetError(res.error));
//     } else {
//       yield put(getUnitsSetResult(res));
//     }
//   } catch (err) {
//     if (err instanceof Error) {
//       yield put(getUnitsSetError(err.stack!));
//     } else {
//       yield put(getUnitsSetError("An unknown error occured."));
//     }
//   }
// }

// // This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// // type, and run our saga
// function* watchGetUnitsRequest() {
//   yield takeLatest(UnitsActionTypes.GET_UNITS_REQUEST, handleGetUnits);
// }

function* handleGetUnit(action: ReturnType<typeof getUnitRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/unit/" + action.payload, authToken);

    if (res.error) {
      // yield put(getUnitSetError(res.error));
    } else {
      // yield put(getUnitSetResult(res));
      // Insert to board
      const resultData: IUnitGetResult = res;
      if (!_.isUndefined(resultData.unit)) {
        yield put(insertOrUpdateUnitBoard(resultData.unit!, false));
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getUnitSetError(err.stack!));
    } else {
      // yield put(getUnitSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetUnitRequest() {
  yield takeEvery(UnitsActionTypes.GET_UNIT_REQUEST, handleGetUnit);
}

function* handleCreateUnitRequest(action: ReturnType<typeof createUnitRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "put", API_ENDPOINT, "/unit", authToken, action.payload);
    const cookies = yield select(getCookies);

    const resultData: IUnitCommonResult = res;
    yield put(createUnitSetResult(resultData));
    // Load the unit
    if (!_.isUndefined(resultData.id)) {
      yield put(getUnitRequest(resultData.id));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(createUnitSetError(err.stack!));
    } else {
      yield put(createUnitSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchCreateUnitRequest() {
  yield takeEvery(UnitsActionTypes.CREATE_UNIT_REQUEST, handleCreateUnitRequest);
}

function* handleUpdateUnitTitleRequest(action: ReturnType<typeof updateUnitTitleRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/unit/updatetitle",
      authToken,
      action.payload);

    const resultData: IUnitCommonResult = res;
    // yield put(createUnitSetResult(resultData));
    // // Reload the projects
    // yield put(getUnitsRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createUnitSetError(err.stack!));
    } else {
      // yield put(createUnitSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateUnitTitleRequest() {
  yield takeEvery(UnitsActionTypes.UPDATE_UNIT_TITLE_REQUEST, handleUpdateUnitTitleRequest);
}

function* handleUpdateUnitPointsRequest(action: ReturnType<typeof updateUnitPointsRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/unit/updatepoints",
      authToken,
      action.payload);

    const resultData: IUnitCommonResult = res;
    // yield put(createUnitSetResult(resultData));
    // // Reload the projects
    // yield put(getUnitsRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createUnitSetError(err.stack!));
    } else {
      // yield put(createUnitSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateUnitPointsRequest() {
  yield takeEvery(UnitsActionTypes.UPDATE_UNIT_POINTS_REQUEST, handleUpdateUnitPointsRequest);
}

function* handleAddOrRemoveUnitManagerRequest(action: ReturnType<typeof addOrRemoveUnitManagerRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/unit/addorremovemanager",
      authToken,
      action.payload);

    const resultData: IUnitCommonResult = res;
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
function* watchAddOrRemoveUnitManagerRequest() {
  yield takeEvery(UnitsActionTypes.ADD_OR_REMOVE_UNIT_MANAGER_REQUEST, handleAddOrRemoveUnitManagerRequest);
}

function* handleUpdateUnitSortOrderRequest(action: ReturnType<typeof updateUnitSortOrderRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/unit/updatesortorder",
      authToken,
      action.payload);

    const resultData: IUnitCommonResult = res;
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
function* watchUpdateUnitSortOrderRequest() {
  yield takeEvery(UnitsActionTypes.UPDATE_UNIT_SORT_ORDER_REQUEST, handleUpdateUnitSortOrderRequest);
}

function* handleDeleteUnitRequest(action: ReturnType<typeof deleteUnitRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "delete",
      API_ENDPOINT,
      "/unit",
      authToken,
      action.payload);

    const resultData: IUnitCommonResult = res;
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
function* watchDeleteUnitRequest() {
  yield takeEvery(UnitsActionTypes.DELETE_UNIT_REQUEST, handleDeleteUnitRequest);
}

function* handleCompleteUnitRequest(action: ReturnType<typeof completeUnitRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/unit/complete",
      authToken,
      action.payload);

    const resultData: IUnitCommonResult = res;
    yield put(completeUnitSetResult(resultData));
  } catch (err) {
    if (err instanceof Error) {
      yield put(completeUnitSetResult({errors: err.stack!}));
    } else {
      yield put(completeUnitSetResult({errors: "An unknown error occured."}));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchCompleteUnitRequest() {
  yield takeEvery(UnitsActionTypes.COMPLETE_UNIT_REQUEST, handleCompleteUnitRequest);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* unitsSaga() {
  yield all([
    fork(watchCreateUnitRequest),
    fork(watchGetUnitRequest),
    fork(watchUpdateUnitTitleRequest),
    fork(watchUpdateUnitPointsRequest),
    fork(watchAddOrRemoveUnitManagerRequest),
    fork(watchUpdateUnitSortOrderRequest),
    fork(watchDeleteUnitRequest),
    fork(watchCompleteUnitRequest),
  ]);
}

export default unitsSaga;

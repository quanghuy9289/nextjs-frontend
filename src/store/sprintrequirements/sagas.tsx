/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this sprintrequirement.
 */

import _ from "lodash";
import { delay } from "redux-saga";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApiWithAuthToken } from "../../utils/api";
import {
  CONST_COOKIE_AUTHENTICATION_TOKEN,
} from "../../utils/constants";
import { insertOrUpdateSprintRequirementBoard } from "../board/actions";
import {
  addOrRemoveSprintRequirementManagerRequest,
  createSprintRequirementRequest,
  createSprintRequirementSetError,
  createSprintRequirementSetResult,
  deleteSprintRequirementRequest,
  getSprintRequirementRequest,
  getSprintRequirementRequestBySprintAndUser,
  updateSprintRequirementMinUnitPointsRequest,
  updateSprintRequirementSortOrderRequest,
} from "./actions";
import {
  ISprintRequirementCommonResult,
  ISprintRequirementGetResult,
  SprintRequirementsActionTypes,
} from "./types";

const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;

const getAuthToken = (state: IApplicationState) =>
  // state.cookies.hasCookies ? state.cookies.cookies!.get(CONST_COOKIE_AUTHENTICATION_TOKEN) : "";
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) =>
  state.cookies.cookies;

// function* handleGetSprintRequirements(action: ReturnType<typeof getSprintRequirementsRequest>) {
//   try {
//     // To call async functions, use redux-saga's `call()`.
//     const authToken = yield select(getAuthToken);
//     const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/sprintrequirement", authToken);

//     if (res.error) {
//       yield put(getSprintRequirementsSetError(res.error));
//     } else {
//       yield put(getSprintRequirementsSetResult(res));
//     }
//   } catch (err) {
//     if (err instanceof Error) {
//       yield put(getSprintRequirementsSetError(err.stack!));
//     } else {
//       yield put(getSprintRequirementsSetError("An unknown error occured."));
//     }
//   }
// }

// // This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// // type, and run our saga
// function* watchGetSprintRequirementsRequest() {
//   yield takeLatest(SprintRequirementsActionTypes.GET_SPRINTREQUIREMENTS_REQUEST, handleGetSprintRequirements);
// }

function* handleGetSprintRequirement(action: ReturnType<typeof getSprintRequirementRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(
      callApiWithAuthToken,
      "get",
      API_ENDPOINT,
      `/sprintrequirement/${action.payload}`,
      authToken);

    // yield put(getSprintRequirementSetResult(res));
    // Insert to board
    const resultData: ISprintRequirementGetResult = res;
    if (!_.isUndefined(resultData.sprintrequirement)) {
      yield put(insertOrUpdateSprintRequirementBoard(resultData.sprintrequirement!));
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getSprintRequirementSetError(err.stack!));
    } else {
      // yield put(getSprintRequirementSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetSprintRequirementRequest() {
  yield takeEvery(SprintRequirementsActionTypes.GET_SPRINTREQUIREMENT_REQUEST, handleGetSprintRequirement);
}

function* handleGetSprintRequirementBySprintAndUser(
  action: ReturnType<typeof getSprintRequirementRequestBySprintAndUser>,
) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(
      callApiWithAuthToken,
      "get",
      API_ENDPOINT,
      `/sprintrequirement/bysprintanduser/${action.payload.sprintID}/${action.payload.userID}`,
      authToken);

    // yield put(getSprintRequirementSetResult(res));
    // Insert to board
    const resultData: ISprintRequirementGetResult = res;
    if (!_.isUndefined(resultData.sprintrequirement)) {
      yield put(insertOrUpdateSprintRequirementBoard(resultData.sprintrequirement!));
    } else {
      // Add a dummy record
      yield put(insertOrUpdateSprintRequirementBoard({
        id: "_dummy_sprint_requirement_" + action.payload.userID,
        minUnitPoints: 0,
        sprintID: action.payload.sprintID,
        userID: action.payload.userID,
        totalCompletedPoints: resultData.totalCompletedPoints,
      }));
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getSprintRequirementSetError(err.stack!));
    } else {
      // yield put(getSprintRequirementSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetSprintRequirementBySprintAndUserRequest() {
  yield takeEvery(
    SprintRequirementsActionTypes.GET_SPRINTREQUIREMENT_BY_SPRINT_AND_USER_REQUEST,
    handleGetSprintRequirementBySprintAndUser,
  );
}

// function* handleCreateSprintRequirementRequest(action: ReturnType<typeof createSprintRequirementRequest>) {
//   try {
//     // To call async functions, use redux-saga's `call()`.
//     const authToken = yield select(getAuthToken);
//     const res = yield call(
//       callApiWithAuthToken,
//       "put",
//       API_ENDPOINT,
//       "/sprintrequirement",
//       authToken,
//       action.payload
//     );
//     const cookies = yield select(getCookies);

//     const resultData: ISprintRequirementCommonResult = res;
//     yield put(createSprintRequirementSetResult(resultData));
//     // Load the sprintrequirement
//     if (!_.isUndefined(resultData.id)) {
//       yield put(getSprintRequirementRequest(resultData.id));
//     }
//   } catch (err) {
//     if (err instanceof Error) {
//       yield put(createSprintRequirementSetError(err.stack!));
//     } else {
//       yield put(createSprintRequirementSetError("An unknown error occured."));
//     }
//   }
// }

// // This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// // type, and run our saga
// function* watchCreateSprintRequirementRequest() {
//   yield takeEvery(
//     SprintRequirementsActionTypes.CREATE_SPRINTREQUIREMENT_REQUEST,
//     handleCreateSprintRequirementRequest
//   );
// }

function* handleUpdateSprintRequirementMinUnitPointsRequest(
  action: ReturnType<typeof updateSprintRequirementMinUnitPointsRequest>,
) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/sprintrequirement/updateminunitpoints",
      authToken,
      action.payload);

    const resultData: ISprintRequirementCommonResult = res;
    if (resultData.errors === undefined && resultData.id !== undefined) {
      yield put(getSprintRequirementRequest(resultData.id));
    }
    // yield put(createSprintRequirementSetResult(resultData));
    // // Reload the projects
    // yield put(getSprintRequirementsRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createSprintRequirementSetError(err.stack!));
    } else {
      // yield put(createSprintRequirementSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateSprintRequirementMinUnitPointsRequest() {
  yield takeEvery(
    SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_MINUNITPOINTS_REQUEST,
    handleUpdateSprintRequirementMinUnitPointsRequest,
  );
}

function* handleAddOrRemoveSprintRequirementManagerRequest(
  action: ReturnType<typeof addOrRemoveSprintRequirementManagerRequest>,
) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/sprintrequirement/addorremovemanager",
      authToken,
      action.payload);

    const resultData: ISprintRequirementCommonResult = res;
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
function* watchAddOrRemoveSprintRequirementManagerRequest() {
  yield takeEvery(
    SprintRequirementsActionTypes.ADD_OR_REMOVE_SPRINTREQUIREMENT_MANAGER_REQUEST,
    handleAddOrRemoveSprintRequirementManagerRequest,
  );
}

function* handleUpdateSprintRequirementSortOrderRequest(
  action: ReturnType<typeof updateSprintRequirementSortOrderRequest>,
) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/sprintrequirement/updatesortorder",
      authToken,
      action.payload);

    const resultData: ISprintRequirementCommonResult = res;
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
function* watchUpdateSprintRequirementSortOrderRequest() {
  yield takeEvery(
    SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_SORT_ORDER_REQUEST,
    handleUpdateSprintRequirementSortOrderRequest,
  );
}

function* handleDeleteSprintRequirementRequest(action: ReturnType<typeof deleteSprintRequirementRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "delete",
      API_ENDPOINT,
      "/sprintrequirement",
      authToken,
      action.payload);

    const resultData: ISprintRequirementCommonResult = res;
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
function* watchDeleteSprintRequirementRequest() {
  yield takeEvery(SprintRequirementsActionTypes.DELETE_SPRINTREQUIREMENT_REQUEST, handleDeleteSprintRequirementRequest);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* sprintrequirementsSaga() {
  yield all([
    // fork(watchCreateSprintRequirementRequest),
    fork(watchGetSprintRequirementRequest),
    fork(watchUpdateSprintRequirementMinUnitPointsRequest),
    fork(watchAddOrRemoveSprintRequirementManagerRequest),
    fork(watchUpdateSprintRequirementSortOrderRequest),
    fork(watchDeleteSprintRequirementRequest),
    fork(watchGetSprintRequirementBySprintAndUserRequest),
  ]);
}

export default sprintrequirementsSaga;

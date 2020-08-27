/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { delay } from "redux-saga";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApiWithAuthToken } from "../../utils/api";
import {
  CONST_COOKIE_AUTHENTICATION_TOKEN,
} from "../../utils/constants";
import { getBoardRequest } from "../board/actions";
import {
  addOrRemoveProjectMemberRequest,
  createProjectRequest,
  createProjectSetError,
  createProjectSetResult,
  deleteProjectRequest,
  getProjectRequest,
  getProjectsRequest,
  getProjectsSetError,
  getProjectsSetResult,
  insertOrUpdateProject,
  updateProjectCurrentSprintRequest,
  updateProjectCurrentSprintSetResult,
  updateProjectNameRequest,
  updateProjectSortOrderRequest,
} from "./actions";
import {
  ICreateProjectResult,
  IProject,
  IProjectCommonResult,
  IProjectGetResult,
  ProjectsActionTypes,
} from "./types";

const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;

const getAuthToken = (state: IApplicationState) =>
  // state.cookies.hasCookies ? state.cookies.cookies!.get(CONST_COOKIE_AUTHENTICATION_TOKEN) : "";
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) =>
  state.cookies.cookies;

const getCurrentProject = (state: IApplicationState) =>
  state.board.project;

function* handleGetProjects(action: ReturnType<typeof getProjectsRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/project", authToken);

    if (res.error) {
      yield put(getProjectsSetError(res.error));
    } else {
      yield put(getProjectsSetResult(res));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(getProjectsSetError(err.stack!));
    } else {
      yield put(getProjectsSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetProjectsRequest() {
  yield takeLatest(ProjectsActionTypes.GET_PROJECTS_REQUEST, handleGetProjects);
}

function* handleGetProject(action: ReturnType<typeof getProjectRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/project/" + action.payload, authToken);

    if (res.error) {
      // yield put(getProjectSetError(res.error));
    } else {
      // yield put(getProjectSetResult(res));
      // Insert to board
      const resultData: IProjectGetResult = res;
      if (!_.isUndefined(resultData.project)) {
        yield put(insertOrUpdateProject(resultData.project!));
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getProjectSetError(err.stack!));
    } else {
      // yield put(getProjectSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetProjectRequest() {
  yield takeLatest(ProjectsActionTypes.GET_PROJECT_REQUEST, handleGetProject);
}

function* handleCreateProjectRequest(action: ReturnType<typeof createProjectRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "put", API_ENDPOINT, "/project", authToken, action.payload);
    const cookies = yield select(getCookies);

    const resultData: ICreateProjectResult = res;
    yield put(createProjectSetResult(resultData));
    // Get the project
    if (resultData.errors === undefined && resultData.id !== undefined) {
      yield put(getProjectRequest(resultData.id));
    }

  } catch (err) {
    if (err instanceof Error) {
      yield put(createProjectSetError(err.stack!));
    } else {
      yield put(createProjectSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchCreateProjectRequest() {
  yield takeEvery(ProjectsActionTypes.CREATE_PROJECT_REQUEST, handleCreateProjectRequest);
}

function* handleUpdateProjectNameRequest(action: ReturnType<typeof updateProjectNameRequest>) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/project/updateprojectname",
      authToken,
      action.payload);

    const resultData: IProjectCommonResult = res;
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
function* watchUpdateProjectNameRequest() {
  yield takeLatest(ProjectsActionTypes.UPDATE_PROJECT_NAME_REQUEST, handleUpdateProjectNameRequest);
}

function* handleUpdateProjectCurrentSprintRequest(action: ReturnType<typeof updateProjectCurrentSprintRequest>) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/project/updatecurrentsprint",
      authToken,
      action.payload);

    const resultData: IProjectCommonResult = res;
    yield put(updateProjectCurrentSprintSetResult(resultData));
    if (resultData.errors === undefined) {
      // Reload the board
      const currentProject: IProject = yield select(getCurrentProject);
      yield put(getBoardRequest(currentProject.shortcode));
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(createProjectSetError(err.stack!));
      yield put(updateProjectCurrentSprintSetResult({errors: err.stack!}));
    } else {
      // yield put(createProjectSetError("An unknown error occured."));
      yield put(updateProjectCurrentSprintSetResult({errors: "An unknown error occured."}));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateProjectCurrentSprintRequest() {
  yield takeLatest(ProjectsActionTypes.UPDATE_PROJECT_CURRENTSPRINT_REQUEST, handleUpdateProjectCurrentSprintRequest);
}

function* handleAddOrRemoveProjectMemberRequest(action: ReturnType<typeof addOrRemoveProjectMemberRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/project/addorremovemember",
      authToken,
      action.payload);

    const resultData: IProjectCommonResult = res;
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
function* watchAddOrRemoveProjectMemberRequest() {
  yield takeEvery(ProjectsActionTypes.ADD_OR_REMOVE_PROJECT_MEMBER_REQUEST, handleAddOrRemoveProjectMemberRequest);
}

function* handleUpdateProjectSortOrderRequest(action: ReturnType<typeof updateProjectSortOrderRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/project/updatesortorder",
      authToken,
      action.payload);

    const resultData: IProjectCommonResult = res;
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
function* watchUpdateProjectSortOrderRequest() {
  yield takeEvery(ProjectsActionTypes.UPDATE_PROJECT_SORT_ORDER_REQUEST, handleUpdateProjectSortOrderRequest);
}

function* handleUpdateProjectColorRequest(action: ReturnType<typeof updateProjectNameRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/project/updatecolor",
      authToken,
      action.payload);

    const resultData: IProjectCommonResult = res;
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
function* watchUpdateProjectColorRequest() {
  yield takeLatest(ProjectsActionTypes.UPDATE_PROJECT_COLOR_REQUEST, handleUpdateProjectColorRequest);
}

function* handleUpdateProjectUnitPointsRangeRequest(action: ReturnType<typeof updateProjectNameRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/project/updateunitpointsrange",
      authToken,
      action.payload);

    const resultData: IProjectCommonResult = res;
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
function* watchUpdateProjectUnitPointsRangeRequest() {
  yield takeLatest(
    ProjectsActionTypes.UPDATE_PROJECT_UNITPOINTSRANGE_REQUEST,
    handleUpdateProjectUnitPointsRangeRequest,
  );
}

function* handleDeleteProjectRequest(action: ReturnType<typeof deleteProjectRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "delete",
      API_ENDPOINT,
      "/project",
      authToken,
      action.payload);

    const resultData: IProjectCommonResult = res;
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
function* watchDeleteProjectRequest() {
  yield takeEvery(ProjectsActionTypes.DELETE_PROJECT_REQUEST, handleDeleteProjectRequest);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* projectsSaga() {
  yield all([
    fork(watchCreateProjectRequest),
    fork(watchGetProjectsRequest),
    fork(watchUpdateProjectNameRequest),
    fork(watchAddOrRemoveProjectMemberRequest),
    fork(watchUpdateProjectSortOrderRequest),
    fork(watchUpdateProjectColorRequest),
    fork(watchDeleteProjectRequest),
    fork(watchUpdateProjectCurrentSprintRequest),
    fork(watchUpdateProjectUnitPointsRangeRequest),
    fork(watchGetProjectRequest),
  ]);
}

export default projectsSaga;

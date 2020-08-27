/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this task.
 */

import _ from "lodash";
import { delay } from "redux-saga";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApiWithAuthToken } from "../../utils/api";
import {
  CONST_COOKIE_AUTHENTICATION_TOKEN,
} from "../../utils/constants";
import { insertOrUpdateTaskBoard, insertOrUpdateUnitBoard } from "../board/actions";
import { IBoardState } from "../board/types";
import { insertOrUpdateProject } from "../projects/actions";
import { IProject } from "../projects/types";
import {
  addOrRemoveTaskAppointeeRequest,
  addOrRemoveTaskManagerRequest,
  addTaskUnitRequest,
  addTaskUnitSetResult,
  createTaskRequest,
  createTaskSetError,
  createTaskSetResult,
  deleteTaskRequest,
  getTaskRequest,
  getTaskRequestThenLoadTaskUpdate,
  getTasksRequest,
  getTasksSetError,
  getTasksSetResult,
  removeTaskUnitRequest,
  updateTaskSetInput,
  updateTaskSortOrderRequest,
  updateTaskTitleRequest,
} from "./actions";
import {
  IAddTaskUnitResult,
  IGetTasksResult,
  ITaskCommonResult,
  ITaskGetResult,
  TasksActionTypes,
} from "./types";

const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;

const getAuthToken = (state: IApplicationState) =>
  // state.cookies.hasCookies ? state.cookies.cookies!.get(CONST_COOKIE_AUTHENTICATION_TOKEN) : "";
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) =>
  state.cookies.cookies;

const getBoard = (state: IApplicationState) =>
  state.board;

// function* handleGetTasks(action: ReturnType<typeof getTasksRequest>) {
//   try {
//     // To call async functions, use redux-saga's `call()`.
//     const authToken = yield select(getAuthToken);
//     const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/task", authToken);

//     if (res.error) {
//       yield put(getTasksSetError(res.error));
//     } else {
//       yield put(getTasksSetResult(res));
//     }
//   } catch (err) {
//     if (err instanceof Error) {
//       yield put(getTasksSetError(err.stack!));
//     } else {
//       yield put(getTasksSetError("An unknown error occured."));
//     }
//   }
// }

// // This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// // type, and run our saga
// function* watchGetTasksRequest() {
//   yield takeLatest(TasksActionTypes.GET_TASKS_REQUEST, handleGetTasks);
// }

function* handleGetTasks(action: ReturnType<typeof getTasksRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(
      callApiWithAuthToken,
      "get",
      API_ENDPOINT,
      "/task",
      authToken,
    );

    if (res.error) {
      yield put(getTasksSetError(res.error));
    } else {
      const result: IGetTasksResult = res;
      yield put(getTasksSetResult(res));
      if (result.errors === undefined) {
        for (const eachProject of result.projects) {
            yield put(insertOrUpdateProject(eachProject));
        }
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(getTasksSetError(err.stack!));
    } else {
      yield put(getTasksSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetTasksRequest() {
  yield takeLatest(TasksActionTypes.GET_TASKS_REQUEST, handleGetTasks);
}

function* handleGetTask(action: ReturnType<typeof getTaskRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/task/" + action.payload, authToken);

    if (res.error) {
      // yield put(getTaskSetError(res.error));
    } else {
      // yield put(getTaskSetResult(res));
      // Insert to board
      const resultData: ITaskGetResult = res;
      if (!_.isUndefined(resultData.task)) {
        yield put(insertOrUpdateTaskBoard(resultData.task!));
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getTaskSetError(err.stack!));
    } else {
      // yield put(getTaskSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetTaskRequest() {
  yield takeLatest(TasksActionTypes.GET_TASK_REQUEST, handleGetTask);
}

function* handleGetTaskThenLoadTaskUpdate(action: ReturnType<typeof getTaskRequestThenLoadTaskUpdate>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const board: IBoardState = yield select(getBoard);
    const res = yield call(callApiWithAuthToken, "get", API_ENDPOINT, "/task/" + action.payload, authToken);

    if (res.error) {
      // yield put(getTaskSetError(res.error));
    } else {
      // yield put(getTaskSetResult(res));
      // Insert to board
      const resultData: ITaskGetResult = res;
      if (!_.isUndefined(resultData.task)) {
        // Insert task to board
        yield put(insertOrUpdateTaskBoard(resultData.task));
        // Set the task update input
        yield put(updateTaskSetInput({
            ...resultData.task,
            projectID: board.project.id,
            sprintID: board.project.currentSprint.id,
            description: "", // To do
        }));
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      // yield put(getTaskSetError(err.stack!));
    } else {
      // yield put(getTaskSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetTaskRequestThenLoadTaskUpdate() {
  yield takeLatest(TasksActionTypes.GET_TASK_REQUEST_THEN_LOAD_TASK_UPDATE, handleGetTaskThenLoadTaskUpdate);
}

function* handleCreateTaskRequest(action: ReturnType<typeof createTaskRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken, "put", API_ENDPOINT, "/task", authToken, action.payload);
    const cookies = yield select(getCookies);

    const resultData: ITaskCommonResult = res;
    yield put(createTaskSetResult(resultData));
    // Load the task
    if (!_.isUndefined(resultData.id)) {
      yield put(getTaskRequest(resultData.id));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(createTaskSetError(err.stack!));
    } else {
      yield put(createTaskSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchCreateTaskRequest() {
  yield takeEvery(TasksActionTypes.CREATE_TASK_REQUEST, handleCreateTaskRequest);
}

function* handleUpdateTaskTitleRequest(action: ReturnType<typeof updateTaskTitleRequest>) {
  try {
    yield call(delay, 1000);  // Debouncing written by takeLatest
                              // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/task/updatetitle",
      authToken,
      action.payload);

    const resultData: ITaskCommonResult = res;
    // yield put(createTaskSetResult(resultData));
    // // Reload the projects
    // yield put(getTasksRequest());

  } catch (err) {
    if (err instanceof Error) {
      // yield put(createTaskSetError(err.stack!));
    } else {
      // yield put(createTaskSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchUpdateTaskNameRequest() {
  yield takeLatest(TasksActionTypes.UPDATE_TASK_TITLE_REQUEST, handleUpdateTaskTitleRequest);
}

function* handleAddOrRemoveTaskManagerRequest(action: ReturnType<typeof addOrRemoveTaskManagerRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/task/addorremovemanager",
      authToken,
      action.payload);

    const resultData: ITaskCommonResult = res;
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
function* watchAddOrRemoveTaskManagerRequest() {
  yield takeEvery(TasksActionTypes.ADD_OR_REMOVE_TASK_MANAGER_REQUEST, handleAddOrRemoveTaskManagerRequest);
}

function* handleAddOrRemoveTaskAppointeeRequest(action: ReturnType<typeof addOrRemoveTaskAppointeeRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/task/addorremoveappointee",
      authToken,
      action.payload);

    const resultData: ITaskCommonResult = res;
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
function* watchAddOrRemoveTaskAppointeeRequest() {
  yield takeEvery(TasksActionTypes.ADD_OR_REMOVE_TASK_APPOINTEE_REQUEST, handleAddOrRemoveTaskAppointeeRequest);
}

function* handleRemoveTaskUnitRequest(action: ReturnType<typeof removeTaskUnitRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/task/removeunit",
      authToken,
      action.payload);

    const resultData: ITaskCommonResult = res;
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
function* watchRemoveTaskUnitRequest() {
  yield takeEvery(TasksActionTypes.REMOVE_TASK_UNIT_REQUEST, handleRemoveTaskUnitRequest);
}

function* handleAddTaskUnitRequest(action: ReturnType<typeof addTaskUnitRequest>) {
  try {
    // yield call(delay, 1000);  // Debouncing written by takeLatest
    //                           // Credit: https://gist.github.com/Calvin-Huang/698cbb954d714a41c1726d0cee1be629
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/task/addunit",
      authToken,
      action.payload);

    const resultData: IAddTaskUnitResult = res;
    yield put(addTaskUnitSetResult(resultData));
    if (resultData.errors === undefined && resultData.unit !== undefined) {
      yield put(insertOrUpdateUnitBoard(resultData.unit!, false));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(addTaskUnitSetResult({errors: err.stack!}));
    } else {
      yield put(addTaskUnitSetResult({errors: "An unknown error occured."}));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchAddTaskUnitRequest() {
  yield takeEvery(TasksActionTypes.ADD_TASK_UNIT_REQUEST, handleAddTaskUnitRequest);
}

function* handleUpdateTaskSortOrderRequest(action: ReturnType<typeof updateTaskSortOrderRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "post",
      API_ENDPOINT,
      "/task/updatesortorder",
      authToken,
      action.payload);

    const resultData: ITaskCommonResult = res;
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
function* watchUpdateTaskSortOrderRequest() {
  yield takeEvery(TasksActionTypes.UPDATE_TASK_SORT_ORDER_REQUEST, handleUpdateTaskSortOrderRequest);
}

function* handleDeleteTaskRequest(action: ReturnType<typeof deleteTaskRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(callApiWithAuthToken,
      "delete",
      API_ENDPOINT,
      "/task",
      authToken,
      action.payload);

    const resultData: ITaskCommonResult = res;
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
function* watchDeleteTaskRequest() {
  yield takeEvery(TasksActionTypes.DELETE_TASK_REQUEST, handleDeleteTaskRequest);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* tasksSaga() {
  yield all([
    fork(watchCreateTaskRequest),
    fork(watchGetTaskRequest),
    fork(watchGetTaskRequestThenLoadTaskUpdate),
    fork(watchUpdateTaskNameRequest),
    fork(watchAddOrRemoveTaskManagerRequest),
    fork(watchUpdateTaskSortOrderRequest),
    fork(watchDeleteTaskRequest),
    fork(watchAddOrRemoveTaskAppointeeRequest),
    fork(watchRemoveTaskUnitRequest),
    fork(watchAddTaskUnitRequest),
    fork(watchGetTasksRequest),
  ]);
}

export default tasksSaga;

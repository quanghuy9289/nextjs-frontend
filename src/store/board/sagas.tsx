/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this board.
 */

import _ from "lodash";
import { delay } from "redux-saga";
import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IApplicationState } from "..";
import { callApiWithAuthToken } from "../../utils/api";
import {
  CONST_COOKIE_AUTHENTICATION_TOKEN,
} from "../../utils/constants";
import { logout } from "../logins/actions";
import { getTaskRequestThenLoadTaskUpdate, updateTaskSetInput } from "../tasks/actions";
import { ITask } from "../tasks/types";
import {
  getBoardRequest,
  getBoardRequestThenLoadTaskUpdate,
  getBoardSetError,
  getBoardSetResult,
} from "./actions";
import {
  BoardActionTypes, IGetBoardResult,
} from "./types";

const API_ENDPOINT: string = process.env.REACT_APP_TASK_RIPPLE_API!;

const getAuthToken = (state: IApplicationState) =>
  // state.cookies.hasCookies ? state.cookies.cookies!.get(CONST_COOKIE_AUTHENTICATION_TOKEN) : "";
  state.logins.result.authtoken ? state.logins.result.authtoken! : "";

const getCookies = (state: IApplicationState) =>
  state.cookies.cookies;

function* handleGetBoard(action: ReturnType<typeof getBoardRequest>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = action.payload.sprintID === undefined ?
    yield call(
      callApiWithAuthToken,
      "get",
      API_ENDPOINT,
      "/board/" + action.payload.projectShortcode,
      authToken,
    ) :
    yield call(
      callApiWithAuthToken,
      "get",
      API_ENDPOINT,
      `/board/${action.payload.projectShortcode}/${action.payload.sprintID}`,
      authToken,
    );

    if (res.isUnauthorized === true) {
      yield put(logout());
    } else {
      yield put(getBoardSetResult(res));
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(getBoardSetError(err.stack!));
    } else {
      yield put(getBoardSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetBoardRequest() {
  yield takeLatest(BoardActionTypes.GET_BOARD_REQUEST, handleGetBoard);
}

function* handleGetBoardThenLoadTaskUpdate(action: ReturnType<typeof getBoardRequestThenLoadTaskUpdate>) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const authToken = yield select(getAuthToken);
    const res = yield call(
      callApiWithAuthToken,
      "get",
      API_ENDPOINT,
      "/board/" + action.payload.projectShortcode,
      authToken,
    );

    const responseData: IGetBoardResult = res;
    // Set result
    if (res.isUnauthorized === true) {
      yield put(logout());
    } else {
      yield put(getBoardSetResult(res));
      if (responseData.errors === undefined) {
        // const theTask: ITask | undefined = _.find(responseData.board.tasks, (eachTask: ITask) => {
        //   return eachTask.id === action.payload.taskID;
        // });
        // if (theTask !== undefined) {
        //   yield put(updateTaskSetInput({
        //       ...theTask,
        //       projectID: responseData.board.project.id,
        //       sprintID: responseData.board.project.currentSprint.id,
        //       description: "", // To do
        //   }));
        // }
        yield put(getTaskRequestThenLoadTaskUpdate(action.payload.taskID));
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(getBoardSetError(err.stack!));
    } else {
      yield put(getBoardSetError("An unknown error occured."));
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga
function* watchGetBoardRequestThenLoadTaskUpdate() {
  yield takeLatest(BoardActionTypes.GET_BOARD_REQUEST_THEN_LOAD_TASK_UPDATE, handleGetBoardThenLoadTaskUpdate);
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* boardSaga() {
  yield all([
    fork(watchGetBoardRequest),
    fork(watchGetBoardRequestThenLoadTaskUpdate),
  ]);
}

export default boardSaga;

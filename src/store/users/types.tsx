/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Cookies } from "react-cookie";
import { IStringTMap } from "../../utils/types";
import { ILeaveRequest } from "../leaverequests/types";

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.

export interface IUserLeaveType {
  name: UserLeaveTypes;
}

export enum UserLeaveTypes {
  FULL_DAY = "FULL DAY",
  HALF_DAY = "HALF DAY",
  UNPAID = "UNPAID",
}

export interface IUser {
  id: string;
  fullname: string;
  nickname: string;
  email: string;
  roleID?: string;
  avatarBase64: string;
  startDate?: number;
  minDailyUnitPointsRequirement?: number;
  standardNumberOfWorkingDaysPerWeek?: number;
  leaveRequests?: ILeaveRequest[];
}

export interface ICreateUser extends IUser {
  password: string;
}

export interface IUserResult {
  users: IUser[];
  errors?: string;
}

export interface IUserCommonResult {
  id?: string;
  errors?: string;
}

export enum UsersActionTypes {
  GET_USERS = "@@users/GET_USERS",
  GET_USERS_RESULT = "@@users/GET_USERS_RESULT",
  GET_USERS_ERROR = "@@users/GET_USERS_ERROR",
  UPDATE_USER_SET_INPUT = "@@users/UPDATE_USER_SET_INPUT",
  UPDATE_USER_REQUEST = "@@users/UPDATE_USER_REQUEST",
  UPDATE_USER_SET_ERROR = "@@users/UPDATE_USER_SET_ERROR",
  UPDATE_USER_SET_RESULT = "@@users/UPDATE_USER_SET_RESULT",
  INSERT_OR_UPDATE_LEAVE_REQUESTS_USER = "@@users/INSERT_OR_UPDATE_LEAVE_REQUESTS_USER",
  DELETE_LEAVE_REQUEST_FOR_USER = "@@users/DELETE_LEAVE_REQUEST_FOR_USER",
  CREATE_USER_REQUEST = "@@users/CREATE_USER_REQUEST",
  CREATE_USER_SET_ERROR = "@@users/CREATE_USER_SET_ERROR",
  CREATE_USER_SET_RESULT = "@@users/CREATE_USER_SET_RESULT",
  DELETE_USER_REQUEST = "@@users/DELETE_USER_REQUEST",
  DELETE_USER_SET_ERROR = "@@users/DELETE_USER_SET_ERROR",
  DELETE_USER_SET_RESULT = "@@users/DELETE_USER_SET_RESULT",
}

export interface IUsersState {
  readonly loading: boolean;
  readonly result: IUserResult;
  readonly loaded: boolean;
  readonly userMap: IStringTMap<IUser>;
  readonly updateUserLoading: boolean;
  readonly updateUserEdited: boolean;
  readonly updateUserInput: IUser;
  readonly updateUserResult: IUserCommonResult;
  readonly deleteUserResult: IUserCommonResult;
}

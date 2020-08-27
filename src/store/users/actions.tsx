/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { action } from "typesafe-actions";
import { ICreateUser, IUser, IUserCommonResult, IUserResult, UsersActionTypes } from "./types";

import { ILeaveRequest, ILeaveRequestDeleteInput } from "../leaverequests/types";

export const getUsers = () => action(UsersActionTypes.GET_USERS);
export const getUsersResult = (result: IUserResult) => action(UsersActionTypes.GET_USERS_RESULT, result);
export const getUsersError = (error: string) => action(UsersActionTypes.GET_USERS_ERROR, error);

export const updateUserSetInput = (input: IUser, firstLoad?: boolean) =>
  action(UsersActionTypes.UPDATE_USER_SET_INPUT, { input, firstLoad });
export const updateUserRequest = (input: IUser) => action(UsersActionTypes.UPDATE_USER_REQUEST, input);
export const updateUserSetError = (errors: string) => action(UsersActionTypes.UPDATE_USER_SET_ERROR, { errors });
export const updateUserSetResult = (result: IUser) => action(UsersActionTypes.UPDATE_USER_SET_RESULT, result);

export const insertOrUpdateLeaveRequestsUser = (
  leaveRequests: ILeaveRequest[],
  requesterUserID: string,
  addToTop: boolean,
) => action(UsersActionTypes.INSERT_OR_UPDATE_LEAVE_REQUESTS_USER, { leaveRequests, requesterUserID, addToTop });

export const deleteLeaveRequestForUser = (input: ILeaveRequestDeleteInput) =>
  action(UsersActionTypes.DELETE_LEAVE_REQUEST_FOR_USER, input);

export const createUserRequest = (input: ICreateUser) => action(UsersActionTypes.CREATE_USER_REQUEST, input);
export const createUserSetError = (errors: string) => action(UsersActionTypes.CREATE_USER_SET_ERROR, { errors });
export const createUserSetResult = (result: IUserResult) => action(UsersActionTypes.CREATE_USER_SET_RESULT, result);
export const deleteUserRequest = (id: string) => action(UsersActionTypes.DELETE_USER_REQUEST, id);
export const deleteUserSetError = (errors: string) => action(UsersActionTypes.DELETE_USER_SET_ERROR, { errors });
export const deleteUserSetResult = (id: string) => action(UsersActionTypes.DELETE_USER_SET_RESULT, id);

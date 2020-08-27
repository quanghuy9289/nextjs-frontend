/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IPanelProps } from "@blueprintjs/core";
import { action } from "typesafe-actions";
import { IProjectUpdateSortOrderInput } from "../projects/types";
import {
    IAddLeaveRequestState,
    IAddOrRemoveLeaveRequestManagerInput,
    IEditLeaveRequestState,
    ILeaveRequest,
    ILeaveRequestCommonResult,
    ILeaveRequestDeleteInput,
    ILeaveRequestGetResult,
    ILeaveRequestGetResultSimple,
    ILeaveRequestUpdateContentInput,
    ILeaveRequestUpdateInput,
    ILeaveRequestUpdateSortOrderInput,
    LeaveRequestsActionTypes,
} from "./types";

// export const setAddLeaveRequestState = (input: IAddLeaveRequestState) =>
//     action(LeaveRequestsActionTypes.SET_ADD_LEAVEREQUEST_STATE, input);

export const setEditLeaveRequestState = (input: IEditLeaveRequestState) =>
    action(LeaveRequestsActionTypes.SET_EDIT_LEAVEREQUEST_STATE, input);

export const createLeaveRequestSetInput = (input: ILeaveRequest) =>
    action(LeaveRequestsActionTypes.CREATE_LEAVEREQUEST_SET_INPUT, input);
export const createLeaveRequestRequest = (input: ILeaveRequest) =>
    action(LeaveRequestsActionTypes.CREATE_LEAVEREQUEST_REQUEST, input);
export const createLeaveRequestSetError = (errors: string) =>
    action(LeaveRequestsActionTypes.CREATE_LEAVEREQUEST_SET_ERROR, {errors});
export const createLeaveRequestSetResult = (result: ILeaveRequestCommonResult) =>
    action(LeaveRequestsActionTypes.CREATE_LEAVEREQUEST_SET_RESULT, result);

export const getLeaveRequestRequest = (leaveRequestID: string) =>
    action(LeaveRequestsActionTypes.GET_LEAVEREQUEST_REQUEST, leaveRequestID);

export const getLeaveRequestsOfUserRequest = (userID: string) =>
    action(LeaveRequestsActionTypes.GET_LEAVEREQUESTS_OF_TASK_REQUEST, userID);

export const getNewerLeaveRequestsOfUserRequest = (userID: string, newerThanEpochSeconds: number) =>
    action(LeaveRequestsActionTypes.GET_NEWER_LEAVEREQUESTS_OF_TASK_REQUEST, {userID, newerThanEpochSeconds});

export const getNewerLeaveRequestsOfUserSetResult = (result: ILeaveRequestGetResult) =>
    action(LeaveRequestsActionTypes.GET_NEWER_LEAVEREQUESTS_OF_TASK_SET_RESULT, result);

export const getOlderLeaveRequestsOfUserRequest = (userID: string, olderThanEpochSeconds: number) =>
    action(LeaveRequestsActionTypes.GET_OLDER_LEAVEREQUESTS_OF_TASK_REQUEST, {userID, olderThanEpochSeconds});

export const getOlderLeaveRequestsOfUserSetResult = (result: ILeaveRequestGetResultSimple) =>
    action(LeaveRequestsActionTypes.GET_OLDER_LEAVEREQUESTS_OF_TASK_SET_RESULT, result);

export const updateLeaveRequestSetInput = (input: ILeaveRequestUpdateInput) =>
    action(LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_SET_INPUT, input);
export const updateLeaveRequestRequest = (input: ILeaveRequestUpdateInput) =>
    action(LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_REQUEST, input);
export const updateLeaveRequestSetError = (errors: string) =>
    action(LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_SET_ERROR, {errors});
export const updateLeaveRequestSetResult = (result: ILeaveRequestCommonResult) =>
    action(LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_SET_RESULT, result);

export const updateLeaveRequestContentRequest = (input: ILeaveRequestUpdateContentInput) =>
    action(LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_CONTENT_REQUEST, input);

export const addOrRemoveLeaveRequestManagerRequest = (input: IAddOrRemoveLeaveRequestManagerInput) =>
    action(LeaveRequestsActionTypes.ADD_OR_REMOVE_LEAVEREQUEST_MANAGER_REQUEST, input);

export const updateLeaveRequestSortOrderRequest = (input: ILeaveRequestUpdateSortOrderInput) =>
    action(LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_SORT_ORDER_REQUEST, input);

export const deleteLeaveRequestRequest = (input: ILeaveRequestDeleteInput) =>
    action(LeaveRequestsActionTypes.DELETE_LEAVEREQUEST_REQUEST, input);

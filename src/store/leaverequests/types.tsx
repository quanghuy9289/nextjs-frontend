/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import priority from "../../components/priority";
import { UserLeaveTypes } from "../users/types";

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum LeaveRequestsActionTypes {
    SET_ADD_LEAVEREQUEST_STATE = "@@leaveRequests/SET_ADD_LEAVEREQUEST_STATE",
    SET_EDIT_LEAVEREQUEST_STATE = "@@leaveRequests/SET_EDIT_LEAVEREQUEST_STATE",
    CREATE_LEAVEREQUEST_SET_INPUT = "@@leaveRequests/CREATE_LEAVEREQUEST_SET_INPUT",
    CREATE_LEAVEREQUEST_REQUEST = "@@leaveRequests/CREATE_LEAVEREQUEST_REQUEST",
    CREATE_LEAVEREQUEST_SET_ERROR = "@@leaveRequests/CREATE_LEAVEREQUEST_SET_ERROR",
    CREATE_LEAVEREQUEST_SET_RESULT = "@@leaveRequests/CREATE_LEAVEREQUEST_SET_RESULT",
    GET_LEAVEREQUEST_REQUEST = "@@leaveRequests/GET_LEAVEREQUEST_REQUEST",
    GET_LEAVEREQUESTS_OF_TASK_REQUEST = "@@leaveRequests/GET_LEAVEREQUESTS_OF_TASK_REQUEST",
    GET_NEWER_LEAVEREQUESTS_OF_TASK_REQUEST = "@@leaveRequests/GET_NEWER_LEAVEREQUESTS_OF_TASK_REQUEST",
    GET_NEWER_LEAVEREQUESTS_OF_TASK_SET_RESULT = "@@leaveRequests/GET_NEWER_LEAVEREQUESTS_OF_TASK_SET_RESULT",
    GET_OLDER_LEAVEREQUESTS_OF_TASK_REQUEST = "@@leaveRequests/GET_OLDER_LEAVEREQUESTS_OF_TASK_REQUEST",
    GET_OLDER_LEAVEREQUESTS_OF_TASK_SET_RESULT = "@@leaveRequests/GET_OLDER_LEAVEREQUESTS_OF_TASK_SET_RESULT",
    UPDATE_LEAVEREQUEST_SET_INPUT = "@@leaveRequests/UPDATE_LEAVEREQUEST_SET_INPUT",
    UPDATE_LEAVEREQUEST_REQUEST = "@@leaveRequests/UPDATE_LEAVEREQUEST_REQUEST",
    UPDATE_LEAVEREQUEST_SET_ERROR = "@@leaveRequests/UPDATE_LEAVEREQUEST_SET_ERROR",
    UPDATE_LEAVEREQUEST_SET_RESULT = "@@leaveRequests/UPDATE_LEAVEREQUEST_SET_RESULT",
    UPDATE_LEAVEREQUEST_CONTENT_REQUEST =  "@@leaveRequests/UPDATE_LEAVEREQUEST_CONTENT_REQUEST",
    ADD_OR_REMOVE_LEAVEREQUEST_MANAGER_REQUEST = "@@leaveRequests/ADD_OR_REMOVE_LEAVEREQUEST_MANAGER_REQUEST",
    UPDATE_LEAVEREQUEST_SORT_ORDER_REQUEST = "@@leaveRequests/UPDATE_LEAVEREQUEST_SORT_ORDER_REQUEST",
    DELETE_LEAVEREQUEST_REQUEST = "@@leaveRequests/DELETE_LEAVEREQUEST_REQUEST",
}

export interface IAddLeaveRequestState {
    leaveRequest: ILeaveRequest;
}

export interface IEditLeaveRequestState {
    leaveRequest: ILeaveRequest;
}

// export interface ILeaveRequestCreateInput {
//     leaveDate: number;
//     reason: string;
//     hourLeaveAmount: number;
//     requesterUserID: string;
// }

export interface ILeaveRequestUpdateInput {
    id: string;
    leaveDate: number;
    reason: string;
    hourLeaveAmount: number;
    requesterUserID: string;
}

export interface ILeaveRequestCommonResult {
    id?: string;
    errors?: string;
}

export interface ILeaveRequestGetResult {
    leaveRequests?: ILeaveRequest[];
    requesterUserID?: string;
    hasMore?: boolean;
    errors?: string;
}

export interface ILeaveRequestGetResultSimple {
    requesterUserID?: string;
    hasMore?: boolean;
    errors?: string;
}

export interface ILeaveRequestUpdateContentInput {
    id: string;
    content: string;
}

export interface IAddOrRemoveLeaveRequestManagerInput {
    id: string;
    managerUserID: string;
    isAdd: boolean;
}

export interface ILeaveRequestUpdateSortOrderInput {
    id: string;
    beforeLeaveRequestID: string;
    afterLeaveRequestID: string;
}

export interface ILeaveRequestDeleteInput {
    id: string;
    requesterUserID: string;
}

export interface ILeaveRequest {
    id: string;
    leaveDate: number;
    reason: string;
    hourLeaveAmount: number;
    requesterUserID: string;
    leaveType: UserLeaveTypes;
    createdByUserID: string;
    createdOn: number;
}

export interface ILeaveRequestsState {
    readonly addLeaveRequestState: IAddLeaveRequestState;
    readonly editLeaveRequestState: IEditLeaveRequestState;
    readonly createLeaveRequestLoading: boolean;
    readonly createLeaveRequestInput: ILeaveRequest;
    readonly createLeaveRequestResult: ILeaveRequestCommonResult;
    readonly updateLeaveRequestLoading: boolean;
    readonly updateLeaveRequestInput: ILeaveRequestUpdateInput;
    readonly updateLeaveRequestResult: ILeaveRequestCommonResult;
    readonly getNewerLeaveRequestsOfUserLoading: boolean;
    readonly getOlderLeaveRequestsOfUserLoading: boolean;
    // Use simple because we don't want the list of leaveRequests again
    readonly getOlderLeaveRequestsOfUserResult: ILeaveRequestGetResultSimple;
}

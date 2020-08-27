/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import { getDateFromUTCEpoch, getEpochSecondsOfDate } from "../../utils/dates";
import { UserLeaveTypes } from "../users/types";
import {
    ILeaveRequestCommonResult,
    ILeaveRequestGetResultSimple,
    ILeaveRequestsState,
    LeaveRequestsActionTypes,
} from "./types";

const initialState: ILeaveRequestsState = {
    addLeaveRequestState: {
        leaveRequest: {
            id: "",
            hourLeaveAmount: 0,
            leaveDate: 0,
            reason: "",
            requesterUserID: "",
            leaveType: UserLeaveTypes.FULL_DAY,
            createdByUserID: "",
            createdOn: 0,
        },
    },
    editLeaveRequestState: {
        leaveRequest: {
            id: "",
            hourLeaveAmount: 0,
            leaveDate: getEpochSecondsOfDate(new Date()),
            reason: "",
            requesterUserID: "",
            leaveType: UserLeaveTypes.FULL_DAY,
            createdByUserID: "",
            createdOn: 0,
        },
    },
    createLeaveRequestInput: {
        id: "",
        createdByUserID: "",
        createdOn: getEpochSecondsOfDate(new Date()),
        hourLeaveAmount: 0,
        leaveDate: getEpochSecondsOfDate(new Date()),
        leaveType: UserLeaveTypes.FULL_DAY,
        reason: "",
        requesterUserID: "",
    },
    createLeaveRequestLoading: false,
    createLeaveRequestResult: {
        id: undefined,
        errors: undefined,
    },
    updateLeaveRequestLoading: false,
    updateLeaveRequestInput: {
        id: "",
        hourLeaveAmount: 0,
        leaveDate: getEpochSecondsOfDate(new Date()),
        reason: "",
        requesterUserID: "",
    },
    updateLeaveRequestResult: {
        id: undefined,
        errors: undefined,
    },
    getNewerLeaveRequestsOfUserLoading: false,
    getOlderLeaveRequestsOfUserLoading: false,
    getOlderLeaveRequestsOfUserResult: {
        errors: undefined,
        hasMore: undefined,
        requesterUserID: undefined,
    },
};

const reducer: Reducer<ILeaveRequestsState> = (state = initialState, action) => {
    switch (action.type) {
        case LeaveRequestsActionTypes.SET_ADD_LEAVEREQUEST_STATE:
            return {
                ...state,
                addLeaveRequestState: action.payload,
            };
        case LeaveRequestsActionTypes.SET_EDIT_LEAVEREQUEST_STATE:
            return {
                ...state,
                editLeaveRequestState: action.payload,
            };
        case LeaveRequestsActionTypes.CREATE_LEAVEREQUEST_SET_INPUT:
            return {
                ...state,
                createLeaveRequestInput: action.payload,
            };
        case LeaveRequestsActionTypes.CREATE_LEAVEREQUEST_REQUEST:
            return {
                ...state,
                createLeaveRequestLoading: true,
            };
        case LeaveRequestsActionTypes.CREATE_LEAVEREQUEST_SET_ERROR:
            return {
                ...state,
                createLeaveRequestLoading: false,
                createLeaveRequestResult: action.payload,
            };
        case LeaveRequestsActionTypes.CREATE_LEAVEREQUEST_SET_RESULT: {
            const result: ILeaveRequestCommonResult = action.payload;
            return {
                ...state,
                createLeaveRequestLoading: false,
                createLeaveRequestResult: action.payload,
                createLeaveRequestInput: {
                    ...state.createLeaveRequestInput,
                    // Reset leave date for create input if the result is success
                    reason: _.isUndefined(result.errors) ?
                        "" :
                        state.createLeaveRequestInput.reason,
                    leaveDate: _.isUndefined(result.errors) ?
                        getEpochSecondsOfDate(new Date()) :
                        state.createLeaveRequestInput.leaveDate,
                },
            };
        }
        case LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_SET_INPUT:
            return {
                ...state,
                updateLeaveRequestInput: action.payload,
            };
        case LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_REQUEST:
            return {
                ...state,
                updateLeaveRequestLoading: true,
            };
        case LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_SET_ERROR:
            return {
                ...state,
                updateLeaveRequestLoading: false,
                updateLeaveRequestResult: action.payload,
            };
        case LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_SET_RESULT:
            return {
                ...state,
                updateLeaveRequestLoading: false,
                updateLeaveRequestResult: action.payload,
            };
        case LeaveRequestsActionTypes.GET_OLDER_LEAVEREQUESTS_OF_TASK_REQUEST:
            return {
                ...state,
                getOlderLeaveRequestsOfUserLoading: true,
            };
        case LeaveRequestsActionTypes.GET_OLDER_LEAVEREQUESTS_OF_TASK_SET_RESULT: {
            const getOlderLeaveRequestsOfUserResult: ILeaveRequestGetResultSimple = action.payload;
            return {
                ...state,
                getOlderLeaveRequestsOfUserLoading: false,
                getOlderLeaveRequestsOfUserResult,
            };
        }
        case LeaveRequestsActionTypes.GET_NEWER_LEAVEREQUESTS_OF_TASK_REQUEST:
            return {
                ...state,
                getNewerLeaveRequestsOfUserLoading: true,
            };
        case LeaveRequestsActionTypes.GET_NEWER_LEAVEREQUESTS_OF_TASK_SET_RESULT:
            return {
                ...state,
                getNewerLeaveRequestsOfUserLoading: false,
            };
        case LeaveRequestsActionTypes.GET_LEAVEREQUEST_REQUEST:
        case LeaveRequestsActionTypes.GET_LEAVEREQUESTS_OF_TASK_REQUEST:
        case LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_CONTENT_REQUEST:
        case LeaveRequestsActionTypes.UPDATE_LEAVEREQUEST_SORT_ORDER_REQUEST:
        case LeaveRequestsActionTypes.DELETE_LEAVEREQUEST_REQUEST:
        default:
            return state;
    }
};

export { reducer as leaveRequestsReducer };

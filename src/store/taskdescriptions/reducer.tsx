/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import {ITaskDescriptionsState, TaskDescriptionsActionTypes} from "./types";

const initialState: ITaskDescriptionsState = {
    addTaskDescriptionState: {
        taskdescription: {
            id: "",
            content: "",
            taskID: "",
        },
    },
    editTaskDescriptionState: {
        taskdescription: {
            id: "",
            content: "",
            taskID: "",
        },
    },
    createTaskDescriptionInput: {
        title: "",
        managers: [],
        projectID: "",
    },
    createTaskDescriptionLoading: false,
    createTaskDescriptionResult: {
        id: undefined,
        errors: undefined,
    },
    updateTaskDescriptionLoading: false,
    updateTaskDescriptionInput: {
        id: "",
        title: "",
        managers: [],
        projectID: "",
        taskIDs: [],
    },
    updateTaskDescriptionResult: {
        id: undefined,
        errors: undefined,
    },
};

const reducer: Reducer<ITaskDescriptionsState> = (state = initialState, action) => {
    switch (action.type) {
        case TaskDescriptionsActionTypes.SET_ADD_TASKDESCRIPTION_STATE:
            return {
                ...state,
                addTaskDescriptionState: action.payload,
            };
        case TaskDescriptionsActionTypes.SET_EDIT_TASKDESCRIPTION_STATE:
            return {
                ...state,
                editTaskDescriptionState: action.payload,
            };
        case TaskDescriptionsActionTypes.CREATE_TASKDESCRIPTION_SET_INPUT:
            return {
                ...state,
                createTaskDescriptionInput: action.payload,
            };
        case TaskDescriptionsActionTypes.CREATE_TASKDESCRIPTION_REQUEST:
            return {
                ...state,
                createTaskDescriptionLoading: true,
            };
        case TaskDescriptionsActionTypes.CREATE_TASKDESCRIPTION_SET_ERROR:
            return {
                ...state,
                createTaskDescriptionLoading: false,
                createTaskDescriptionResult: action.payload,
            };
        case TaskDescriptionsActionTypes.CREATE_TASKDESCRIPTION_SET_RESULT:
            return {
                ...state,
                createTaskDescriptionLoading: false,
                createTaskDescriptionResult: action.payload,
            };
        case TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_SET_INPUT:
            return {
                ...state,
                updateTaskDescriptionInput: action.payload,
            };
        case TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_REQUEST:
            return {
                ...state,
                updateTaskDescriptionLoading: true,
            };
        case TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_SET_ERROR:
            return {
                ...state,
                updateTaskDescriptionLoading: false,
                updateTaskDescriptionResult: action.payload,
            };
        case TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_SET_RESULT:
            return {
                ...state,
                updateTaskDescriptionLoading: false,
                updateTaskDescriptionResult: action.payload,
            };
        case TaskDescriptionsActionTypes.GET_TASKDESCRIPTION_REQUEST:
        case TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_CONTENT_REQUEST:
        case TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_SORT_ORDER_REQUEST:
        case TaskDescriptionsActionTypes.DELETE_TASKDESCRIPTION_REQUEST:
        default:
            return state;
    }
};

export { reducer as taskdescriptionsReducer };

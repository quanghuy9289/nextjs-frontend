/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import {IPrioritiesState, PrioritiesActionTypes} from "./types";

const initialState: IPrioritiesState = {
    addPriorityState: {
        priority: {
            id: "",
            taskIDs: [],
            title: "",
            managers: [],
            backgroundColor: {
                red: 255,
                green: 255,
                blue: 255,
                alpha: 1.0,
            },
        },
    },
    editPriorityState: {
        priority: {
            id: "",
            taskIDs: [],
            title: "",
            managers: [],
            backgroundColor: {
                red: 255,
                green: 255,
                blue: 255,
                alpha: 1.0,
            },
        },
    },
    createPriorityInput: {
        title: "",
        managers: [],
        projectID: "",
        backgroundColor: {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 1.0,
        },
    },
    createPriorityLoading: false,
    createPriorityResult: {
        id: undefined,
        errors: undefined,
    },
    updatePriorityLoading: false,
    updatePriorityInput: {
        id: "",
        title: "",
        managers: [],
        projectID: "",
        taskIDs: [],
        backgroundColor: {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 1.0,
        },
    },
    updatePriorityResult: {
        id: undefined,
        errors: undefined,
    },
};

const reducer: Reducer<IPrioritiesState> = (state = initialState, action) => {
    switch (action.type) {
        case PrioritiesActionTypes.SET_ADD_PRIORITY_STATE:
            return {
                ...state,
                addPriorityState: action.payload,
            };
        case PrioritiesActionTypes.SET_EDIT_PRIORITY_STATE:
            return {
                ...state,
                editPriorityState: action.payload,
            };
        case PrioritiesActionTypes.CREATE_PRIORITY_SET_INPUT:
            return {
                ...state,
                createPriorityInput: action.payload,
            };
        case PrioritiesActionTypes.CREATE_PRIORITY_REQUEST:
            return {
                ...state,
                createPriorityLoading: true,
            };
        case PrioritiesActionTypes.CREATE_PRIORITY_SET_ERROR:
            return {
                ...state,
                createPriorityLoading: false,
                createPriorityResult: action.payload,
            };
        case PrioritiesActionTypes.CREATE_PRIORITY_SET_RESULT:
            return {
                ...state,
                createPriorityLoading: false,
                createPriorityResult: action.payload,
            };
        case PrioritiesActionTypes.UPDATE_PRIORITY_SET_INPUT:
            return {
                ...state,
                updatePriorityInput: action.payload,
            };
        case PrioritiesActionTypes.UPDATE_PRIORITY_REQUEST:
            return {
                ...state,
                updatePriorityLoading: true,
            };
        case PrioritiesActionTypes.UPDATE_PRIORITY_SET_ERROR:
            return {
                ...state,
                updatePriorityLoading: false,
                updatePriorityResult: action.payload,
            };
        case PrioritiesActionTypes.UPDATE_PRIORITY_SET_RESULT:
            return {
                ...state,
                updatePriorityLoading: false,
                updatePriorityResult: action.payload,
            };
        case PrioritiesActionTypes.GET_PRIORITY_REQUEST:
        case PrioritiesActionTypes.UPDATE_PRIORITY_TITLE_REQUEST:
        case PrioritiesActionTypes.UPDATE_PRIORITY_COLOR_REQUEST:
        case PrioritiesActionTypes.UPDATE_PRIORITY_SORT_ORDER_REQUEST:
        case PrioritiesActionTypes.DELETE_PRIORITY_REQUEST:
        default:
            return state;
    }
};

export { reducer as prioritiesReducer };

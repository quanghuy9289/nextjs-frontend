/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Cookies } from "react-cookie";
import { Reducer } from "redux";
import {ISprintsState, SprintsActionTypes} from "./types";

const initialState: ISprintsState = {
    loading: false,
    loaded: false,
    result: {
        errors: undefined,
        sprints: [],
    },
    createSprintLoading: false,
    createSprintInput: {
        name: "",
        projectID: "",
        beginOn: 0,
        endOn: 0,
    },
    createSprintResult: {
        id: undefined,
        errors: undefined,
    },
    updateSprintLoading: false,
    updateSprintInput: {
        id: "",
        name: "",
        beginOn: 0,
        endOn: 0,
        projectID: "",
    },
    updateSprintResult: {
        id: undefined,
        errors: undefined,
    },
};

const reducer: Reducer<ISprintsState> = (state = initialState, action) => {
    switch (action.type) {
        case SprintsActionTypes.GET_SPRINTS:
            return {
                ...state,
                loading: true,
            };
        case SprintsActionTypes.GET_SPRINTS_RESULT: {
            return {
                ...state,
                loading: false,
                loaded: true,
                result: action.payload,
            };
        }
        case SprintsActionTypes.GET_SPRINTS_ERROR: {
            return {
                ...state,
                loading: false,
                loaded: false,
                result: action.payload,
            };
        }
        case SprintsActionTypes.CREATE_SPRINT_SET_INPUT:
            return {
                ...state,
                createSprintInput: action.payload,
            };
        case SprintsActionTypes.CREATE_SPRINT_REQUEST:
            return {
                ...state,
                createSprintLoading: true,
            };
        case SprintsActionTypes.CREATE_SPRINT_SET_RESULT:
            return {
                ...state,
                createSprintLoading: false,
                createSprintResult: action.payload,
            };
        case SprintsActionTypes.UPDATE_SPRINT_SET_INPUT:
            return {
                ...state,
                updateSprintInput: action.payload,
            };
        case SprintsActionTypes.UPDATE_SPRINT_REQUEST:
            return {
                ...state,
                updateSprintLoading: true,
            };
        case SprintsActionTypes.UPDATE_SPRINT_SET_ERROR:
            return {
                ...state,
                updateSprintLoading: false,
                updateSprintResult: action.payload,
            };
        case SprintsActionTypes.UPDATE_SPRINT_SET_RESULT:
            return {
                ...state,
                updateSprintLoading: false,
                updateSprintResult: action.payload,
            };
        case SprintsActionTypes.GET_SPRINT_REQUEST:
        case SprintsActionTypes.UPDATE_SPRINT_NAME_REQUEST:
        case SprintsActionTypes.DELETE_SPRINT_REQUEST:
        case SprintsActionTypes.UPDATE_SPRINT_BEGINON_REQUEST:
        case SprintsActionTypes.UPDATE_SPRINT_ENDON_REQUEST:
        default: {
            return state;
        }
    }
};

export { reducer as sprintsReducer };

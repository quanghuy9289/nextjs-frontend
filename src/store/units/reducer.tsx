/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import {IUnitsState, UnitsActionTypes} from "./types";

const initialState: IUnitsState = {
    addUnitState: {
        unit: {
            id: "",
            title: "",
            completedByUserID: "",
            points: 1,
            sprintID: "",
            taskID: "",
        },
    },
    editUnitState: {
        unit: {
            id: "",
            title: "",
            completedByUserID: "",
            points: 1,
            sprintID: "",
            taskID: "",
        },
    },
    createUnitInput: {
        title: "",
        managers: [],
        projectID: "",
    },
    createUnitLoading: false,
    createUnitResult: {
        id: undefined,
        errors: undefined,
    },
    updateUnitLoading: false,
    updateUnitInput: {
        id: "",
        title: "",
        managers: [],
        projectID: "",
        taskIDs: [],
    },
    updateUnitResult: {
        id: undefined,
        errors: undefined,
    },
    completeUnitLoading: false,
    completeUnitInput: {
        id: "",
        completed: false,
    },
    completeUnitResult: {
        id: undefined,
        errors: undefined,
    },
};

const reducer: Reducer<IUnitsState> = (state = initialState, action) => {
    switch (action.type) {
        case UnitsActionTypes.SET_ADD_UNIT_STATE:
            return {
                ...state,
                addUnitState: action.payload,
            };
        case UnitsActionTypes.SET_EDIT_UNIT_STATE:
            return {
                ...state,
                editUnitState: action.payload,
            };
        case UnitsActionTypes.CREATE_UNIT_SET_INPUT:
            return {
                ...state,
                createUnitInput: action.payload,
            };
        case UnitsActionTypes.CREATE_UNIT_REQUEST:
            return {
                ...state,
                createUnitLoading: true,
            };
        case UnitsActionTypes.CREATE_UNIT_SET_ERROR:
            return {
                ...state,
                createUnitLoading: false,
                createUnitResult: action.payload,
            };
        case UnitsActionTypes.CREATE_UNIT_SET_RESULT:
            return {
                ...state,
                createUnitLoading: false,
                createUnitResult: action.payload,
            };
        case UnitsActionTypes.UPDATE_UNIT_SET_INPUT:
            return {
                ...state,
                updateUnitInput: action.payload,
            };
        case UnitsActionTypes.UPDATE_UNIT_REQUEST:
            return {
                ...state,
                updateUnitLoading: true,
            };
        case UnitsActionTypes.UPDATE_UNIT_SET_ERROR:
            return {
                ...state,
                updateUnitLoading: false,
                updateUnitResult: action.payload,
            };
        case UnitsActionTypes.UPDATE_UNIT_SET_RESULT:
            return {
                ...state,
                updateUnitLoading: false,
                updateUnitResult: action.payload,
            };
        case UnitsActionTypes.GET_UNIT_REQUEST:
        case UnitsActionTypes.UPDATE_UNIT_TITLE_REQUEST:
        case UnitsActionTypes.UPDATE_UNIT_SORT_ORDER_REQUEST:
        case UnitsActionTypes.DELETE_UNIT_REQUEST:
        default:
            return state;
    }
};

export { reducer as unitsReducer };

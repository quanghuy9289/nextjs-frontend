/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import {ColumnsActionTypes, IColumnsState} from "./types";

const initialState: IColumnsState = {
    addColumnState: {
        column: {
            id: "",
            taskIDs: [],
            title: "",
            managers: [],
        },
    },
    editColumnState: {
        column: {
            id: "",
            taskIDs: [],
            title: "",
            managers: [],
        },
    },
    createColumnInput: {
        title: "",
        managers: [],
        projectID: "",
    },
    createColumnLoading: false,
    createColumnResult: {
        id: undefined,
        errors: undefined,
    },
    updateColumnLoading: false,
    updateColumnInput: {
        id: "",
        title: "",
        managers: [],
        projectID: "",
        taskIDs: [],
    },
    updateColumnResult: {
        id: undefined,
        errors: undefined,
    },
};

const reducer: Reducer<IColumnsState> = (state = initialState, action) => {
    switch (action.type) {
        case ColumnsActionTypes.SET_ADD_COLUMN_STATE:
            return {
                ...state,
                addColumnState: action.payload,
            };
        case ColumnsActionTypes.SET_EDIT_COLUMN_STATE:
            return {
                ...state,
                editColumnState: action.payload,
            };
        case ColumnsActionTypes.CREATE_COLUMN_SET_INPUT:
            return {
                ...state,
                createColumnInput: action.payload,
            };
        case ColumnsActionTypes.CREATE_COLUMN_REQUEST:
            return {
                ...state,
                createColumnLoading: true,
            };
        case ColumnsActionTypes.CREATE_COLUMN_SET_ERROR:
            return {
                ...state,
                createColumnLoading: false,
                createColumnResult: action.payload,
            };
        case ColumnsActionTypes.CREATE_COLUMN_SET_RESULT:
            return {
                ...state,
                createColumnLoading: false,
                createColumnResult: action.payload,
            };
        case ColumnsActionTypes.UPDATE_COLUMN_SET_INPUT:
            return {
                ...state,
                updateColumnInput: action.payload,
            };
        case ColumnsActionTypes.UPDATE_COLUMN_REQUEST:
            return {
                ...state,
                updateColumnLoading: true,
            };
        case ColumnsActionTypes.UPDATE_COLUMN_SET_ERROR:
            return {
                ...state,
                updateColumnLoading: false,
                updateColumnResult: action.payload,
            };
        case ColumnsActionTypes.UPDATE_COLUMN_SET_RESULT:
            return {
                ...state,
                updateColumnLoading: false,
                updateColumnResult: action.payload,
            };
        case ColumnsActionTypes.GET_COLUMN_REQUEST:
        case ColumnsActionTypes.UPDATE_COLUMN_TITLE_REQUEST:
        case ColumnsActionTypes.UPDATE_COLUMN_SORT_ORDER_REQUEST:
        case ColumnsActionTypes.COLLAPSE_COLUMN_REQUEST:
        case ColumnsActionTypes.DELETE_COLUMN_REQUEST:
        default:
            return state;
    }
};

export { reducer as columnsReducer };

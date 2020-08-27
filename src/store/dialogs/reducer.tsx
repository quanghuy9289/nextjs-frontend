/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import {DialogsActionTypes, IDialogsState} from "./types";

const initialState: IDialogsState = {
    isOpenLoginDialog: false,
    isOpenRegisterDialog: false,
    isOpenAddTaskDialog: false,
    isOpenEditTaskDialog: false,
    isOpenEditColumnTitleDialog: false,
    isOpenAddColumnDialog: false,
    isOpenEditColumnDialog: false,
    isOpenAddPriorityDialog: false,
    isOpenEditPriorityDialog: false,
    isOpenCreateProjectDialog: false,
    isOpenAddSprintDialog: false,
    isOpenEditSprintDialog: false,
    isOpenSprintRequirementDialog: false,
    isOpenSprintMoveToDialog: false,
    isOpenEmployeePerformanceReviewDialog: false,
};

const reducer: Reducer<IDialogsState> = (state = initialState, action) => {
    switch (action.type) {
        case DialogsActionTypes.OPEN_LOGIN_DIALOG:
            return {
                ...state,
                isOpenLoginDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_REGISTER_DIALOG:
            return {
                ...state,
                isOpenRegisterDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_ADD_TASK_DIALOG:
            return {
                ...state,
                isOpenAddTaskDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_EDIT_TASK_DIALOG:
            return {
                ...state,
                isOpenEditTaskDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_EDIT_COLUMN_TITLE_DIALOG:
            return {
                ...state,
                isOpenEditColumnTitleDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_ADD_COLUMN_DIALOG:
            return {
                ...state,
                isOpenAddColumnDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_EDIT_COLUMN_DIALOG:
            return {
                ...state,
                isOpenEditColumnDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_ADD_PRIORITY_DIALOG:
            return {
                ...state,
                isOpenAddPriorityDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_EDIT_PRIORITY_DIALOG:
            return {
                ...state,
                isOpenEditPriorityDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_CREATE_PROJECT_DIALOG:
            return {
                ...state,
                isOpenCreateProjectDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_ADD_SPRINT_DIALOG:
            return {
                ...state,
                isOpenAddSprintDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_EDIT_SPRINT_DIALOG:
            return {
                ...state,
                isOpenEditSprintDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_SPRINT_REQUIREMENT_DIALOG:
            return {
                ...state,
                isOpenSprintRequirementDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_SPRINT_MOVE_TO_DIALOG:
            return {
                ...state,
                isOpenSprintMoveToDialog: action.payload,
            };
        case DialogsActionTypes.OPEN_EMPLOYEE_PERFORMANCE_REVIEW_DIALOG:
            return {
                ...state,
                isOpenEmployeePerformanceReviewDialog: action.payload,
            };
        default:
            return state;
    }
};

export { reducer as dialogsReducer };

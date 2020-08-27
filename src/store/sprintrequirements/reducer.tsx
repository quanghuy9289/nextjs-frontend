/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import {ISprintRequirementsState, SprintRequirementsActionTypes} from "./types";

const initialState: ISprintRequirementsState = {
    createSprintRequirementInput: {
        title: "",
        managers: [],
        projectID: "",
    },
    createSprintRequirementLoading: false,
    createSprintRequirementResult: {
        id: undefined,
        errors: undefined,
    },
    updateSprintRequirementLoading: false,
    updateSprintRequirementInput: {
        id: "",
        title: "",
        managers: [],
        projectID: "",
        taskIDs: [],
    },
    updateSprintRequirementResult: {
        id: undefined,
        errors: undefined,
    },
};

const reducer: Reducer<ISprintRequirementsState> = (state = initialState, action) => {
    switch (action.type) {
        case SprintRequirementsActionTypes.SET_ADD_SPRINTREQUIREMENT_STATE:
            return {
                ...state,
                addSprintRequirementState: action.payload,
            };
        case SprintRequirementsActionTypes.SET_EDIT_SPRINTREQUIREMENT_STATE:
            return {
                ...state,
                editSprintRequirementState: action.payload,
            };
        case SprintRequirementsActionTypes.CREATE_SPRINTREQUIREMENT_SET_INPUT:
            return {
                ...state,
                createSprintRequirementInput: action.payload,
            };
        case SprintRequirementsActionTypes.CREATE_SPRINTREQUIREMENT_REQUEST:
            return {
                ...state,
                createSprintRequirementLoading: true,
            };
        case SprintRequirementsActionTypes.CREATE_SPRINTREQUIREMENT_SET_ERROR:
            return {
                ...state,
                createSprintRequirementLoading: false,
                createSprintRequirementResult: action.payload,
            };
        case SprintRequirementsActionTypes.CREATE_SPRINTREQUIREMENT_SET_RESULT:
            return {
                ...state,
                createSprintRequirementLoading: false,
                createSprintRequirementResult: action.payload,
            };
        case SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_SET_INPUT:
            return {
                ...state,
                updateSprintRequirementInput: action.payload,
            };
        case SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_REQUEST:
            return {
                ...state,
                updateSprintRequirementLoading: true,
            };
        case SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_SET_ERROR:
            return {
                ...state,
                updateSprintRequirementLoading: false,
                updateSprintRequirementResult: action.payload,
            };
        case SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_SET_RESULT:
            return {
                ...state,
                updateSprintRequirementLoading: false,
                updateSprintRequirementResult: action.payload,
            };
        case SprintRequirementsActionTypes.GET_SPRINTREQUIREMENT_REQUEST:
        case SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_MINUNITPOINTS_REQUEST:
        case SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_SORT_ORDER_REQUEST:
        case SprintRequirementsActionTypes.DELETE_SPRINTREQUIREMENT_REQUEST:
        default:
            return state;
    }
};

export { reducer as sprintrequirementsReducer };

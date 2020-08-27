/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import priority from "../../components/priority";

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum SprintRequirementsActionTypes {
    SET_ADD_SPRINTREQUIREMENT_STATE = "@@sprintrequirements/SET_ADD_SPRINTREQUIREMENT_STATE",
    SET_EDIT_SPRINTREQUIREMENT_STATE = "@@sprintrequirements/SET_EDIT_SPRINTREQUIREMENT_STATE",
    CREATE_SPRINTREQUIREMENT_SET_INPUT = "@@sprintrequirements/CREATE_SPRINTREQUIREMENT_SET_INPUT",
    CREATE_SPRINTREQUIREMENT_REQUEST = "@@sprintrequirements/CREATE_SPRINTREQUIREMENT_REQUEST",
    CREATE_SPRINTREQUIREMENT_SET_ERROR = "@@sprintrequirements/CREATE_SPRINTREQUIREMENT_SET_ERROR",
    CREATE_SPRINTREQUIREMENT_SET_RESULT = "@@sprintrequirements/CREATE_SPRINTREQUIREMENT_SET_RESULT",
    GET_SPRINTREQUIREMENT_REQUEST = "@@board/GET_SPRINTREQUIREMENT_REQUEST",
    GET_SPRINTREQUIREMENT_BY_SPRINT_AND_USER_REQUEST = "@@board/GET_SPRINTREQUIREMENT_BY_SPRINT_AND_USER_REQUEST",
    UPDATE_SPRINTREQUIREMENT_SET_INPUT = "@@sprintrequirements/UPDATE_SPRINTREQUIREMENT_SET_INPUT",
    UPDATE_SPRINTREQUIREMENT_REQUEST = "@@sprintrequirements/UPDATE_SPRINTREQUIREMENT_REQUEST",
    UPDATE_SPRINTREQUIREMENT_SET_ERROR = "@@sprintrequirements/UPDATE_SPRINTREQUIREMENT_SET_ERROR",
    UPDATE_SPRINTREQUIREMENT_SET_RESULT = "@@sprintrequirements/UPDATE_SPRINTREQUIREMENT_SET_RESULT",
    UPDATE_SPRINTREQUIREMENT_MINUNITPOINTS_REQUEST =
        "@@sprintrequirements/UPDATE_SPRINTREQUIREMENT_MINUNITPOINTS_REQUEST",
    ADD_OR_REMOVE_SPRINTREQUIREMENT_MANAGER_REQUEST =
        "@@sprintrequirements/ADD_OR_REMOVE_SPRINTREQUIREMENT_MANAGER_REQUEST",
    UPDATE_SPRINTREQUIREMENT_SORT_ORDER_REQUEST = "@@sprintrequirements/UPDATE_SPRINTREQUIREMENT_SORT_ORDER_REQUEST",
    DELETE_SPRINTREQUIREMENT_REQUEST = "@@sprintrequirements/DELETE_SPRINTREQUIREMENT_REQUEST",
}

export interface ISprintRequirementCreateInput {
    title: string;
    managers: string[];
    projectID: string;
}

export interface ISprintRequirementUpdateInput {
    id: string;
    title: string;
    managers: string[];
    projectID: string;
    taskIDs: string[];
}

export interface ISprintRequirementCommonResult {
    id?: string;
    errors?: string;
}

export interface ISprintRequirementGetResult {
    sprintrequirement?: ISprintRequirement;
    errors?: string;
    totalCompletedPoints: number;
}

export interface ISprintRequirementUpdateMinUnitPointsInput {
    sprintID: string;
    userID: string;
    minUnitPoints: number;
}

export interface IAddOrRemoveSprintRequirementManagerInput {
    id: string;
    managerUserID: string;
    isAdd: boolean;
}

export interface ISprintRequirementUpdateSortOrderInput {
    id: string;
    beforeSprintRequirementID: string;
    afterSprintRequirementID: string;
}

export interface ISprintRequirementDeleteInput {
    id: string;
}

export interface ISprintRequirement {
    id: string;
    sprintID: string;
    userID: string;
    minUnitPoints: number;
    totalCompletedPoints: number;
}

export interface ISprintRequirementsState {
    readonly createSprintRequirementLoading: boolean;
    readonly createSprintRequirementInput: ISprintRequirementCreateInput;
    readonly createSprintRequirementResult: ISprintRequirementCommonResult;
    readonly updateSprintRequirementLoading: boolean;
    readonly updateSprintRequirementInput: ISprintRequirementUpdateInput;
    readonly updateSprintRequirementResult: ISprintRequirementCommonResult;
}

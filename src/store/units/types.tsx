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
export enum UnitsActionTypes {
    SET_ADD_UNIT_STATE = "@@units/SET_ADD_UNIT_STATE",
    SET_EDIT_UNIT_STATE = "@@units/SET_EDIT_UNIT_STATE",
    CREATE_UNIT_SET_INPUT = "@@units/CREATE_UNIT_SET_INPUT",
    CREATE_UNIT_REQUEST = "@@units/CREATE_UNIT_REQUEST",
    CREATE_UNIT_SET_ERROR = "@@units/CREATE_UNIT_SET_ERROR",
    CREATE_UNIT_SET_RESULT = "@@units/CREATE_UNIT_SET_RESULT",
    GET_UNIT_REQUEST = "@@board/GET_UNIT_REQUEST",
    UPDATE_UNIT_SET_INPUT = "@@units/UPDATE_UNIT_SET_INPUT",
    UPDATE_UNIT_REQUEST = "@@units/UPDATE_UNIT_REQUEST",
    UPDATE_UNIT_SET_ERROR = "@@units/UPDATE_UNIT_SET_ERROR",
    UPDATE_UNIT_SET_RESULT = "@@units/UPDATE_UNIT_SET_RESULT",
    COMPLETE_UNIT_SET_INPUT = "@@units/COMPLETE_UNIT_SET_INPUT",
    COMPLETE_UNIT_REQUEST = "@@units/COMPLETE_UNIT_REQUEST",
    COMPLETE_UNIT_SET_RESULT = "@@units/COMPLETE_UNIT_SET_RESULT",
    UPDATE_UNIT_TITLE_REQUEST =  "@@units/UPDATE_UNIT_TITLE_REQUEST",
    UPDATE_UNIT_POINTS_REQUEST =  "@@units/UPDATE_UNIT_POINTS_REQUEST",
    ADD_OR_REMOVE_UNIT_MANAGER_REQUEST = "@@units/ADD_OR_REMOVE_UNIT_MANAGER_REQUEST",
    UPDATE_UNIT_SORT_ORDER_REQUEST = "@@units/UPDATE_UNIT_SORT_ORDER_REQUEST",
    DELETE_UNIT_REQUEST = "@@units/DELETE_UNIT_REQUEST",
}

export interface IAddUnitState {
    unit: IUnit;
}

export interface IEditUnitState {
    unit: IUnit;
}

export interface IUnitCreateInput {
    title: string;
    managers: string[];
    projectID: string;
}

export interface IUnitUpdateInput {
    id: string;
    title: string;
    managers: string[];
    projectID: string;
    taskIDs: string[];
}

export interface IUnitCommonResult {
    id?: string;
    errors?: string;
}

export interface IUnitGetResult {
    unit?: IUnit;
    errors?: string;
}

export interface IUnitUpdateTitleInput {
    id: string;
    title: string;
}

export interface IUnitUpdatePointsInput {
    id: string;
    points: number;
}

export interface IAddOrRemoveUnitManagerInput {
    id: string;
    managerUserID: string;
    isAdd: boolean;
}

export interface IUnitUpdateSortOrderInput {
    id: string;
    beforeUnitID: string;
    afterUnitID: string;
}

export interface IUnitDeleteInput {
    id: string;
}

export interface IUnitCompleteInput {
    id: string;
    completed: boolean;
}

export interface IUnit {
    id: string;
    title: string;
    completedByUserID: string;
    sprintID: string;
    points: number;
    taskID: string;
}

export interface IUnitsState {
    readonly addUnitState: IAddUnitState;
    readonly editUnitState: IEditUnitState;
    readonly createUnitLoading: boolean;
    readonly createUnitInput: IUnitCreateInput;
    readonly createUnitResult: IUnitCommonResult;
    readonly updateUnitLoading: boolean;
    readonly updateUnitInput: IUnitUpdateInput;
    readonly updateUnitResult: IUnitCommonResult;
    readonly completeUnitLoading: boolean;
    readonly completeUnitInput: IUnitCompleteInput;
    readonly completeUnitResult: IUnitCommonResult;
}

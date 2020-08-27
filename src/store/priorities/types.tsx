/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import priority from "../../components/priority";
import { IStandardColor } from "../colors/types";

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum PrioritiesActionTypes {
    SET_ADD_PRIORITY_STATE = "@@priorities/SET_ADD_PRIORITY_STATE",
    SET_EDIT_PRIORITY_STATE = "@@priorities/SET_EDIT_PRIORITY_STATE",
    CREATE_PRIORITY_SET_INPUT = "@@priorities/CREATE_PRIORITY_SET_INPUT",
    CREATE_PRIORITY_REQUEST = "@@priorities/CREATE_PRIORITY_REQUEST",
    CREATE_PRIORITY_SET_ERROR = "@@priorities/CREATE_PRIORITY_SET_ERROR",
    CREATE_PRIORITY_SET_RESULT = "@@priorities/CREATE_PRIORITY_SET_RESULT",
    GET_PRIORITY_REQUEST = "@@board/GET_PRIORITY_REQUEST",
    UPDATE_PRIORITY_SET_INPUT = "@@priorities/UPDATE_PRIORITY_SET_INPUT",
    UPDATE_PRIORITY_REQUEST = "@@priorities/UPDATE_PRIORITY_REQUEST",
    UPDATE_PRIORITY_SET_ERROR = "@@priorities/UPDATE_PRIORITY_SET_ERROR",
    UPDATE_PRIORITY_SET_RESULT = "@@priorities/UPDATE_PRIORITY_SET_RESULT",
    UPDATE_PRIORITY_TITLE_REQUEST =  "@@priorities/UPDATE_PRIORITY_TITLE_REQUEST",
    UPDATE_PRIORITY_COLOR_REQUEST = "@@priorities/UPDATE_PRIORITY_COLOR_REQUEST",
    ADD_OR_REMOVE_PRIORITY_MANAGER_REQUEST = "@@priorities/ADD_OR_REMOVE_PRIORITY_MANAGER_REQUEST",
    UPDATE_PRIORITY_SORT_ORDER_REQUEST = "@@priorities/UPDATE_PRIORITY_SORT_ORDER_REQUEST",
    DELETE_PRIORITY_REQUEST = "@@priorities/DELETE_PRIORITY_REQUEST",
}

export interface IAddPriorityState {
    priority: IPriority;
}

export interface IEditPriorityState {
    priority: IPriority;
}

export interface IPriorityCreateInput {
    title: string;
    managers: string[];
    projectID: string;
    backgroundColor: IStandardColor;
}

export interface IPriorityUpdateInput {
    id: string;
    title: string;
    managers: string[];
    projectID: string;
    taskIDs: string[];
    backgroundColor: IStandardColor;
}

export interface IPriorityCommonResult {
    id?: string;
    errors?: string;
}

export interface IPriorityGetResult {
    priority?: IPriority;
    errors?: string;
}

export interface IPriorityUpdateTitleInput {
    id: string;
    title: string;
}

export interface IAddOrRemovePriorityManagerInput {
    id: string;
    managerUserID: string;
    isAdd: boolean;
}

export interface IPriorityUpdateSortOrderInput {
    id: string;
    beforePriorityID: string;
    afterPriorityID: string;
}

export interface IPriorityDeleteInput {
    id: string;
}

export interface IPriorityUpdateColorInput {
    id: string;
    backgroundColor: IStandardColor;
}

export interface IPriority {
    taskIDs: string[];
    id: string;
    backgroundColor: IStandardColor;
    title: string;
    managers: string[];
}

export interface IPrioritiesState {
    readonly addPriorityState: IAddPriorityState;
    readonly editPriorityState: IEditPriorityState;
    readonly createPriorityLoading: boolean;
    readonly createPriorityInput: IPriorityCreateInput;
    readonly createPriorityResult: IPriorityCommonResult;
    readonly updatePriorityLoading: boolean;
    readonly updatePriorityInput: IPriorityUpdateInput;
    readonly updatePriorityResult: IPriorityCommonResult;
}

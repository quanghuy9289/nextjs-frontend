/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Cookies } from "react-cookie";

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.

export interface ISprint {
    id: string;
    name: string;
    beginOn: number;
    endOn: number;
    projectID: string;
}

export interface ISprintResult {
    sprints: ISprint[];
    errors?: string;
}

export interface ISprintCreateInput {
    name: string;
    projectID: string;
    beginOn: number;
    endOn: number;
}

export interface ISprintUpdateInput {
    id: string;
    projectID: string;
    name: string;
    beginOn: number;
    endOn: number;
}

export interface ISprintUpdateNameInput {
    id: string;
    name: string;
}

export interface ISprintUpdateBeginOnInput {
    id: string;
    beginOn: number;
}

export interface ISprintUpdateEndOnInput {
    id: string;
    endOn: number;
}

export interface ISprintDeleteInput {
    id: string;
}

export interface ISprintCommonResult {
    id?: string;
    errors?: string;
}

export interface ISprintGetResult {
    sprint?: ISprint;
    errors?: string;
}

export enum SprintsActionTypes {
    GET_SPRINTS = "@@sprints/GET_SPRINTS",
    GET_SPRINTS_RESULT = "@@sprints/GET_SPRINTS_RESULT",
    GET_SPRINTS_ERROR = "@@sprints/GET_SPRINTS_ERROR",
    CREATE_SPRINT_SET_INPUT = "@@sprints/CREATE_SPRINT_SET_INPUT",
    CREATE_SPRINT_REQUEST = "@@sprints/CREATE_SPRINT_REQUEST",
    CREATE_SPRINT_SET_RESULT = "@@sprints/CREATE_SPRINT_SET_RESULT",
    GET_SPRINT_REQUEST = "@@sprints/GET_SPRINT_REQUEST",
    UPDATE_SPRINT_SET_INPUT = "@@sprints/UPDATE_SPRINT_SET_INPUT",
    UPDATE_SPRINT_REQUEST = "@@sprints/UPDATE_SPRINT_REQUEST",
    UPDATE_SPRINT_SET_ERROR = "@@sprints/UPDATE_SPRINT_SET_ERROR",
    UPDATE_SPRINT_SET_RESULT = "@@sprints/UPDATE_SPRINT_SET_RESULT",
    UPDATE_SPRINT_NAME_REQUEST = "@@sprints/UPDATE_SPRINT_NAME_REQUEST",
    UPDATE_SPRINT_BEGINON_REQUEST = "@@sprints/UPDATE_SPRINT_BEGINON_REQUEST",
    UPDATE_SPRINT_ENDON_REQUEST = "@@sprints/UPDATE_SPRINT_ENDON_REQUEST",
    DELETE_SPRINT_REQUEST = "@@sprints/DELETE_SPRINT_REQUEST",
}

export interface ISprintsState {
    readonly loading: boolean;
    readonly result: ISprintResult;
    readonly loaded: boolean;
    readonly createSprintLoading: boolean;
    readonly createSprintInput: ISprintCreateInput;
    readonly createSprintResult: ISprintCommonResult;
    readonly updateSprintLoading: boolean;
    readonly updateSprintInput: ISprintUpdateInput;
    readonly updateSprintResult: ISprintCommonResult;
}

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
export enum TaskDescriptionsActionTypes {
    SET_ADD_TASKDESCRIPTION_STATE = "@@taskdescriptions/SET_ADD_TASKDESCRIPTION_STATE",
    SET_EDIT_TASKDESCRIPTION_STATE = "@@taskdescriptions/SET_EDIT_TASKDESCRIPTION_STATE",
    CREATE_TASKDESCRIPTION_SET_INPUT = "@@taskdescriptions/CREATE_TASKDESCRIPTION_SET_INPUT",
    CREATE_TASKDESCRIPTION_REQUEST = "@@taskdescriptions/CREATE_TASKDESCRIPTION_REQUEST",
    CREATE_TASKDESCRIPTION_SET_ERROR = "@@taskdescriptions/CREATE_TASKDESCRIPTION_SET_ERROR",
    CREATE_TASKDESCRIPTION_SET_RESULT = "@@taskdescriptions/CREATE_TASKDESCRIPTION_SET_RESULT",
    GET_TASKDESCRIPTION_REQUEST = "@@board/GET_TASKDESCRIPTION_REQUEST",
    UPDATE_TASKDESCRIPTION_SET_INPUT = "@@taskdescriptions/UPDATE_TASKDESCRIPTION_SET_INPUT",
    UPDATE_TASKDESCRIPTION_REQUEST = "@@taskdescriptions/UPDATE_TASKDESCRIPTION_REQUEST",
    UPDATE_TASKDESCRIPTION_SET_ERROR = "@@taskdescriptions/UPDATE_TASKDESCRIPTION_SET_ERROR",
    UPDATE_TASKDESCRIPTION_SET_RESULT = "@@taskdescriptions/UPDATE_TASKDESCRIPTION_SET_RESULT",
    UPDATE_TASKDESCRIPTION_CONTENT_REQUEST =  "@@taskdescriptions/UPDATE_TASKDESCRIPTION_CONTENT_REQUEST",
    ADD_OR_REMOVE_TASKDESCRIPTION_MANAGER_REQUEST = "@@taskdescriptions/ADD_OR_REMOVE_TASKDESCRIPTION_MANAGER_REQUEST",
    UPDATE_TASKDESCRIPTION_SORT_ORDER_REQUEST = "@@taskdescriptions/UPDATE_TASKDESCRIPTION_SORT_ORDER_REQUEST",
    DELETE_TASKDESCRIPTION_REQUEST = "@@taskdescriptions/DELETE_TASKDESCRIPTION_REQUEST",
}

export interface IAddTaskDescriptionState {
    taskdescription: ITaskDescription;
}

export interface IEditTaskDescriptionState {
    taskdescription: ITaskDescription;
}

export interface ITaskDescriptionCreateInput {
    title: string;
    managers: string[];
    projectID: string;
}

export interface ITaskDescriptionUpdateInput {
    id: string;
    title: string;
    managers: string[];
    projectID: string;
    taskIDs: string[];
}

export interface ITaskDescriptionCommonResult {
    id?: string;
    errors?: string;
}

export interface ITaskDescriptionGetResult {
    taskdescription?: ITaskDescription;
    errors?: string;
}

export interface ITaskDescriptionUpdateContentInput {
    id: string;
    content: string;
}

export interface IAddOrRemoveTaskDescriptionManagerInput {
    id: string;
    managerUserID: string;
    isAdd: boolean;
}

export interface ITaskDescriptionUpdateSortOrderInput {
    id: string;
    beforeTaskDescriptionID: string;
    afterTaskDescriptionID: string;
}

export interface ITaskDescriptionDeleteInput {
    id: string;
}

export interface ITaskDescription {
    id: string;
    content: string;
    taskID: string;
}

export interface ITaskDescriptionsState {
    readonly addTaskDescriptionState: IAddTaskDescriptionState;
    readonly editTaskDescriptionState: IEditTaskDescriptionState;
    readonly createTaskDescriptionLoading: boolean;
    readonly createTaskDescriptionInput: ITaskDescriptionCreateInput;
    readonly createTaskDescriptionResult: ITaskDescriptionCommonResult;
    readonly updateTaskDescriptionLoading: boolean;
    readonly updateTaskDescriptionInput: ITaskDescriptionUpdateInput;
    readonly updateTaskDescriptionResult: ITaskDescriptionCommonResult;
}

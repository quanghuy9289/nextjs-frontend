/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import priority from "../../components/priority";
import { IStringTMap } from "../../utils/types";
import { IColumn } from "../columns/types";
import { IPriority } from "../priorities/types";
import { IProject } from "../projects/types";
import { IUnit } from "../units/types";
import { IUser } from "../users/types";

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum TasksActionTypes {
    SET_ADD_TASK_STATE = "@@tasks/SET_ADD_TASK_STATE",
    SET_EDIT_TASK_STATE = "@@tasks/SET_EDIT_TASK_STATE",
    CREATE_TASK_SET_INPUT = "@@tasks/CREATE_TASK_SET_INPUT",
    CREATE_TASK_REQUEST = "@@tasks/CREATE_TASK_REQUEST",
    CREATE_TASK_SET_ERROR = "@@tasks/CREATE_TASK_SET_ERROR",
    CREATE_TASK_SET_RESULT = "@@tasks/CREATE_TASK_SET_RESULT",
    GET_TASK_REQUEST = "@@tasks/GET_TASK_REQUEST",
    GET_TASK_REQUEST_THEN_LOAD_TASK_UPDATE = "@@tasks/GET_TASK_REQUEST_THEN_LOAD_TASK_UPDATE",
    UPDATE_TASK_SET_INPUT = "@@tasks/UPDATE_TASK_SET_INPUT",
    UPDATE_TASK_REQUEST = "@@tasks/UPDATE_TASK_REQUEST",
    UPDATE_TASK_SET_ERROR = "@@tasks/UPDATE_TASK_SET_ERROR",
    UPDATE_TASK_SET_RESULT = "@@tasks/UPDATE_TASK_SET_RESULT",
    UPDATE_TASK_TITLE_REQUEST =  "@@tasks/UPDATE_TASK_TITLE_REQUEST",
    ADD_OR_REMOVE_TASK_MANAGER_REQUEST = "@@tasks/ADD_OR_REMOVE_TASK_MANAGER_REQUEST",
    ADD_OR_REMOVE_TASK_APPOINTEE_REQUEST = "@@tasks/ADD_OR_REMOVE_TASK_APPOINTEE_REQUEST",
    REMOVE_TASK_UNIT_REQUEST = "@@tasks/REMOVE_TASK_UNIT_REQUEST",
    ADD_TASK_UNIT_REQUEST = "@@tasks/ADD_TASK_UNIT_REQUEST",
    ADD_TASK_UNIT_SET_RESULT = "@@tasks/ADD_TASK_UNIT_SET_RESULT",
    UPDATE_TASK_SORT_ORDER_REQUEST = "@@tasks/UPDATE_TASK_SORT_ORDER_REQUEST",
    DELETE_TASK_REQUEST = "@@tasks/DELETE_TASK_REQUEST",
    UPDATE_TASK_DESCRIPTION_REQUEST = "@@tasks/UPDATE_TASK_DESCRIPTION_REQUEST",
    GET_TASKS_REQUEST = "@@tasks/GET_TASKS_REQUEST",
    GET_TASKS_SET_RESULT = "@@tasks/GET_TASKS_SET_RESULT",
    GET_TASKS_SET_ERROR = "@@tasks/GET_TASKS_SET_ERROR",
}

export interface IAddTaskState {
    task: ITask;
}

export interface IEditTaskState {
    task: ITask;
}

export interface ITaskCreateInput {
    title: string;
    managers: string[];
    appointees: string[];
    projectID: string;
    columnID: string;
    priorityID: string;
    sprintID: string;
    description: string;
    units: IUnit[];
    plain?: string;
    // unitMap: IStringTMap<IUnit>;
}

export interface ITaskUpdateInput {
    id: string;
    title: string;
    managers: string[];
    appointees: string[];
    projectID: string;
    columnID: string;
    priorityID: string;
    sprintID: string;
    description: string;
    units: string[];
    incrementcode: number;
    createdOn: number;
    createdByUserID: string;
    totalUnitPoints: number;
    totalUnitPointsCompleted: number;
    doesHaveZeroUnit: boolean;
    // comments?: string[];
}

export interface ITaskCommonResult {
    id?: string;
    errors?: string;
}

export interface ITaskGetResult {
    task?: ITask;
    errors?: string;
}

export interface ITaskUpdateTitleInput {
    id: string;
    title: string;
}

export interface ITaskUpdateDescriptionInput {
    id: string;
    description: string;
}

export interface IAddOrRemoveTaskManagerInput {
    id: string;
    managerUserID: string;
    isAdd: boolean;
}

export interface IAddOrRemoveTaskAppointeeInput {
    id: string;
    appointeeUserID: string;
    isAdd: boolean;
}

export interface IRemoveTaskUnitInput {
    id: string;
    unitID: string;
    isAdd: boolean;
}

export interface IAddTaskUnitInput {
    id: string;
    unit: IUnit;
}

export interface IAddTaskUnitResult {
    errors?: string;
    unit?: IUnit;
}

export interface ITaskUpdateSortOrderInput {
    id: string;
    beforeTaskID: string;
    afterTaskID: string;
    toColumnID: string;
    toPriorityID: string;
}

export interface ITaskDeleteInput {
    id: string;
}

export interface ITask {
    id: string;
    title: string;
    managers: string[];
    appointees: string[];
    columnID: string;
    projectID: string;
    priorityID: string;
    sprintID: string;
    units: string[];
    incrementcode: number;
    createdOn: number;
    createdByUserID: string;
    totalUnitPoints: number;
    totalUnitPointsCompleted: number;
    doesHaveZeroUnit: boolean;
    // comments?: string[];
}

export interface ITaskWithUserInfo {
    task: ITask;
    createdBy?: IUser;
}

export interface IGetTasksResult {
    tasks: ITask[];
    projects: IProject[];
    errors?: string;
}

export interface ITasksState {
    readonly addTaskState: IAddTaskState;
    readonly editTaskState: IEditTaskState;
    readonly createTaskLoading: boolean;
    readonly createTaskInput: ITaskCreateInput;
    readonly createTaskResult: ITaskCommonResult;
    readonly updateTaskLoading: boolean;
    readonly updateTaskInput: ITaskUpdateInput;
    readonly updateTaskResult: ITaskCommonResult;
    readonly addTaskUnitLoading: boolean;
    readonly getTasksLoading: boolean;
    readonly getTasksLoaded: boolean;
    readonly getTasksResult: IGetTasksResult;
    readonly taskMap: IStringTMap<ITask>;
    readonly tasksOrder: string[];
    readonly taskColumnMap: IStringTMap<IColumn>;
    readonly taskPriorityMap: IStringTMap<IPriority>;
    readonly taskProjectColumnIDsMap: IStringTMap<string[]>;
    readonly taskProjectPriorityIDsMap: IStringTMap<string[]>;
    readonly taskUnitMap: IStringTMap<IUnit>;
}

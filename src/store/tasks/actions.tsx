/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IPanelProps } from "@blueprintjs/core";
import { action } from "typesafe-actions";
import { IProjectUpdateSortOrderInput } from "../projects/types";
import {
    IAddOrRemoveTaskAppointeeInput,
    IAddOrRemoveTaskManagerInput,
    IAddTaskState,
    IAddTaskUnitInput,
    IAddTaskUnitResult,
    IEditTaskState,
    IRemoveTaskUnitInput,
    ITask,
    ITaskCommonResult,
    ITaskCreateInput,
    ITaskDeleteInput,
    ITaskUpdateDescriptionInput,
    ITaskUpdateInput,
    ITaskUpdateSortOrderInput,
    ITaskUpdateTitleInput,
    TasksActionTypes,
} from "./types";

// export const setAddTaskState = (input: IAddTaskState) =>
//     action(TasksActionTypes.SET_ADD_TASK_STATE, input);

export const setEditTaskState = (input: IEditTaskState) =>
    action(TasksActionTypes.SET_EDIT_TASK_STATE, input);

export const createTaskSetInput = (input: ITaskCreateInput) =>
    action(TasksActionTypes.CREATE_TASK_SET_INPUT, input);
export const createTaskRequest = (input: ITaskCreateInput) =>
    action(TasksActionTypes.CREATE_TASK_REQUEST, input);
export const createTaskSetError = (errors: string) =>
    action(TasksActionTypes.CREATE_TASK_SET_ERROR, {errors});
export const createTaskSetResult = (result: ITaskCommonResult) =>
    action(TasksActionTypes.CREATE_TASK_SET_RESULT, result);

export const getTaskRequest = (taskID: string) =>
    action(TasksActionTypes.GET_TASK_REQUEST, taskID);

export const getTaskRequestThenLoadTaskUpdate = (taskID: string) =>
    action(TasksActionTypes.GET_TASK_REQUEST_THEN_LOAD_TASK_UPDATE, taskID);

export const updateTaskSetInput = (input: ITaskUpdateInput) =>
    action(TasksActionTypes.UPDATE_TASK_SET_INPUT, input);
export const updateTaskRequest = (input: ITaskUpdateInput) =>
    action(TasksActionTypes.UPDATE_TASK_REQUEST, input);
export const updateTaskSetError = (errors: string) =>
    action(TasksActionTypes.UPDATE_TASK_SET_ERROR, {errors});
export const updateTaskSetResult = (result: ITaskCommonResult) =>
    action(TasksActionTypes.UPDATE_TASK_SET_RESULT, result);

export const updateTaskTitleRequest = (input: ITaskUpdateTitleInput) =>
    action(TasksActionTypes.UPDATE_TASK_TITLE_REQUEST, input);

export const addOrRemoveTaskManagerRequest = (input: IAddOrRemoveTaskManagerInput) =>
    action(TasksActionTypes.ADD_OR_REMOVE_TASK_MANAGER_REQUEST, input);

export const addOrRemoveTaskAppointeeRequest = (input: IAddOrRemoveTaskAppointeeInput) =>
    action(TasksActionTypes.ADD_OR_REMOVE_TASK_APPOINTEE_REQUEST, input);

export const removeTaskUnitRequest = (input: IRemoveTaskUnitInput) =>
    action(TasksActionTypes.REMOVE_TASK_UNIT_REQUEST, input);

export const addTaskUnitRequest = (input: IAddTaskUnitInput) =>
    action(TasksActionTypes.ADD_TASK_UNIT_REQUEST, input);

export const addTaskUnitSetResult = (result: IAddTaskUnitResult) =>
    action(TasksActionTypes.ADD_TASK_UNIT_SET_RESULT, result);

export const updateTaskSortOrderRequest = (input: ITaskUpdateSortOrderInput) =>
    action(TasksActionTypes.UPDATE_TASK_SORT_ORDER_REQUEST, input);

export const deleteTaskRequest = (input: ITaskDeleteInput) =>
    action(TasksActionTypes.DELETE_TASK_REQUEST, input);

export const updateTaskDescriptionRequest = (input: ITaskUpdateDescriptionInput) =>
    action(TasksActionTypes.UPDATE_TASK_DESCRIPTION_REQUEST, input);

export const getTasksRequest = () =>
    action(TasksActionTypes.GET_TASKS_REQUEST);
export const getTasksSetResult = (result: ITask) =>
    action(TasksActionTypes.GET_TASKS_SET_RESULT, result);
export const getTasksSetError = (error: string) =>
    action(TasksActionTypes.GET_TASKS_SET_ERROR, error);

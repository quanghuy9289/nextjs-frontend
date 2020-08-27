/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IPanelProps } from "@blueprintjs/core";
import { action } from "typesafe-actions";
import { IProjectUpdateSortOrderInput } from "../projects/types";
import {
    IAddOrRemoveTaskDescriptionManagerInput,
    IAddTaskDescriptionState,
    IEditTaskDescriptionState,
    ITaskDescriptionCommonResult,
    ITaskDescriptionCreateInput,
    ITaskDescriptionDeleteInput,
    ITaskDescriptionUpdateContentInput,
    ITaskDescriptionUpdateInput,
    ITaskDescriptionUpdateSortOrderInput,
    TaskDescriptionsActionTypes,
} from "./types";

// export const setAddTaskDescriptionState = (input: IAddTaskDescriptionState) =>
//     action(TaskDescriptionsActionTypes.SET_ADD_TASKDESCRIPTION_STATE, input);

export const setEditTaskDescriptionState = (input: IEditTaskDescriptionState) =>
    action(TaskDescriptionsActionTypes.SET_EDIT_TASKDESCRIPTION_STATE, input);

export const createTaskDescriptionSetInput = (input: ITaskDescriptionCreateInput) =>
    action(TaskDescriptionsActionTypes.CREATE_TASKDESCRIPTION_SET_INPUT, input);
export const createTaskDescriptionRequest = (input: ITaskDescriptionCreateInput) =>
    action(TaskDescriptionsActionTypes.CREATE_TASKDESCRIPTION_REQUEST, input);
export const createTaskDescriptionSetError = (errors: string) =>
    action(TaskDescriptionsActionTypes.CREATE_TASKDESCRIPTION_SET_ERROR, {errors});
export const createTaskDescriptionSetResult = (result: ITaskDescriptionCommonResult) =>
    action(TaskDescriptionsActionTypes.CREATE_TASKDESCRIPTION_SET_RESULT, result);

export const getTaskDescriptionRequest = (taskID: string) =>
    action(TaskDescriptionsActionTypes.GET_TASKDESCRIPTION_REQUEST, taskID);

export const updateTaskDescriptionSetInput = (input: ITaskDescriptionUpdateInput) =>
    action(TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_SET_INPUT, input);
export const updateTaskDescriptionRequest = (input: ITaskDescriptionUpdateInput) =>
    action(TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_REQUEST, input);
export const updateTaskDescriptionSetError = (errors: string) =>
    action(TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_SET_ERROR, {errors});
export const updateTaskDescriptionSetResult = (result: ITaskDescriptionCommonResult) =>
    action(TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_SET_RESULT, result);

export const updateTaskDescriptionContentRequest = (input: ITaskDescriptionUpdateContentInput) =>
    action(TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_CONTENT_REQUEST, input);

export const addOrRemoveTaskDescriptionManagerRequest = (input: IAddOrRemoveTaskDescriptionManagerInput) =>
    action(TaskDescriptionsActionTypes.ADD_OR_REMOVE_TASKDESCRIPTION_MANAGER_REQUEST, input);

export const updateTaskDescriptionSortOrderRequest = (input: ITaskDescriptionUpdateSortOrderInput) =>
    action(TaskDescriptionsActionTypes.UPDATE_TASKDESCRIPTION_SORT_ORDER_REQUEST, input);

export const deleteTaskDescriptionRequest = (input: ITaskDescriptionDeleteInput) =>
    action(TaskDescriptionsActionTypes.DELETE_TASKDESCRIPTION_REQUEST, input);

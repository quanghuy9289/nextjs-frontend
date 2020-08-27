/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IPanelProps } from "@blueprintjs/core";
import { action } from "typesafe-actions";
import { IProjectUpdateSortOrderInput } from "../projects/types";
import {
    CommentsActionTypes,
    IAddCommentState,
    IAddOrRemoveCommentManagerInput,
    ICommentCommonResult,
    ICommentCreateInput,
    ICommentDeleteInput,
    ICommentGetResult,
    ICommentGetResultSimple,
    ICommentUpdateContentInput,
    ICommentUpdateInput,
    ICommentUpdateSortOrderInput,
    IEditCommentState,
} from "./types";

// export const setAddCommentState = (input: IAddCommentState) =>
//     action(CommentsActionTypes.SET_ADD_COMMENT_STATE, input);

export const setEditCommentState = (input: IEditCommentState) =>
    action(CommentsActionTypes.SET_EDIT_COMMENT_STATE, input);

export const createCommentSetInput = (input: ICommentCreateInput) =>
    action(CommentsActionTypes.CREATE_COMMENT_SET_INPUT, input);
export const createCommentRequest = (input: ICommentCreateInput) =>
    action(CommentsActionTypes.CREATE_COMMENT_REQUEST, input);
export const createCommentSetError = (errors: string) =>
    action(CommentsActionTypes.CREATE_COMMENT_SET_ERROR, {errors});
export const createCommentSetResult = (result: ICommentCommonResult) =>
    action(CommentsActionTypes.CREATE_COMMENT_SET_RESULT, result);

export const getCommentRequest = (commentID: string) =>
    action(CommentsActionTypes.GET_COMMENT_REQUEST, commentID);

export const getCommentsOfTaskRequest = (taskID: string) =>
    action(CommentsActionTypes.GET_COMMENTS_OF_TASK_REQUEST, taskID);

export const getNewerCommentsOfTaskRequest = (taskID: string, newerThanEpochSeconds: number) =>
    action(CommentsActionTypes.GET_NEWER_COMMENTS_OF_TASK_REQUEST, {taskID, newerThanEpochSeconds});

export const getNewerCommentsOfTaskSetResult = (result: ICommentGetResult) =>
    action(CommentsActionTypes.GET_NEWER_COMMENTS_OF_TASK_SET_RESULT, result);

export const getOlderCommentsOfTaskRequest = (taskID: string, olderThanEpochSeconds: number) =>
    action(CommentsActionTypes.GET_OLDER_COMMENTS_OF_TASK_REQUEST, {taskID, olderThanEpochSeconds});

export const getOlderCommentsOfTaskSetResult = (result: ICommentGetResultSimple) =>
    action(CommentsActionTypes.GET_OLDER_COMMENTS_OF_TASK_SET_RESULT, result);

export const updateCommentSetInput = (input: ICommentUpdateInput) =>
    action(CommentsActionTypes.UPDATE_COMMENT_SET_INPUT, input);
export const updateCommentRequest = (input: ICommentUpdateInput) =>
    action(CommentsActionTypes.UPDATE_COMMENT_REQUEST, input);
export const updateCommentSetError = (errors: string) =>
    action(CommentsActionTypes.UPDATE_COMMENT_SET_ERROR, {errors});
export const updateCommentSetResult = (result: ICommentCommonResult) =>
    action(CommentsActionTypes.UPDATE_COMMENT_SET_RESULT, result);

export const updateCommentContentRequest = (input: ICommentUpdateContentInput) =>
    action(CommentsActionTypes.UPDATE_COMMENT_CONTENT_REQUEST, input);

export const addOrRemoveCommentManagerRequest = (input: IAddOrRemoveCommentManagerInput) =>
    action(CommentsActionTypes.ADD_OR_REMOVE_COMMENT_MANAGER_REQUEST, input);

export const updateCommentSortOrderRequest = (input: ICommentUpdateSortOrderInput) =>
    action(CommentsActionTypes.UPDATE_COMMENT_SORT_ORDER_REQUEST, input);

export const deleteCommentRequest = (input: ICommentDeleteInput) =>
    action(CommentsActionTypes.DELETE_COMMENT_REQUEST, input);

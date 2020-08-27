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
export enum CommentsActionTypes {
    SET_ADD_COMMENT_STATE = "@@comments/SET_ADD_COMMENT_STATE",
    SET_EDIT_COMMENT_STATE = "@@comments/SET_EDIT_COMMENT_STATE",
    CREATE_COMMENT_SET_INPUT = "@@comments/CREATE_COMMENT_SET_INPUT",
    CREATE_COMMENT_REQUEST = "@@comments/CREATE_COMMENT_REQUEST",
    CREATE_COMMENT_SET_ERROR = "@@comments/CREATE_COMMENT_SET_ERROR",
    CREATE_COMMENT_SET_RESULT = "@@comments/CREATE_COMMENT_SET_RESULT",
    GET_COMMENT_REQUEST = "@@comments/GET_COMMENT_REQUEST",
    GET_COMMENTS_OF_TASK_REQUEST = "@@comments/GET_COMMENTS_OF_TASK_REQUEST",
    GET_NEWER_COMMENTS_OF_TASK_REQUEST = "@@comments/GET_NEWER_COMMENTS_OF_TASK_REQUEST",
    GET_NEWER_COMMENTS_OF_TASK_SET_RESULT = "@@comments/GET_NEWER_COMMENTS_OF_TASK_SET_RESULT",
    GET_OLDER_COMMENTS_OF_TASK_REQUEST = "@@comments/GET_OLDER_COMMENTS_OF_TASK_REQUEST",
    GET_OLDER_COMMENTS_OF_TASK_SET_RESULT = "@@comments/GET_OLDER_COMMENTS_OF_TASK_SET_RESULT",
    UPDATE_COMMENT_SET_INPUT = "@@comments/UPDATE_COMMENT_SET_INPUT",
    UPDATE_COMMENT_REQUEST = "@@comments/UPDATE_COMMENT_REQUEST",
    UPDATE_COMMENT_SET_ERROR = "@@comments/UPDATE_COMMENT_SET_ERROR",
    UPDATE_COMMENT_SET_RESULT = "@@comments/UPDATE_COMMENT_SET_RESULT",
    UPDATE_COMMENT_CONTENT_REQUEST =  "@@comments/UPDATE_COMMENT_CONTENT_REQUEST",
    ADD_OR_REMOVE_COMMENT_MANAGER_REQUEST = "@@comments/ADD_OR_REMOVE_COMMENT_MANAGER_REQUEST",
    UPDATE_COMMENT_SORT_ORDER_REQUEST = "@@comments/UPDATE_COMMENT_SORT_ORDER_REQUEST",
    DELETE_COMMENT_REQUEST = "@@comments/DELETE_COMMENT_REQUEST",
}

export interface IAddCommentState {
    comment: IComment;
}

export interface IEditCommentState {
    comment: IComment;
}

export interface ICommentCreateInput {
    taskID: string;
    content: string;
    plain: string;
}

export interface ICommentUpdateInput {
    id: string;
    title: string;
    managers: string[];
    projectID: string;
    taskIDs: string[];
}

export interface ICommentCommonResult {
    id?: string;
    errors?: string;
}

export interface ICommentGetResult {
    comments?: IComment[];
    taskID?: string;
    hasMore?: boolean;
    errors?: string;
}

export interface ICommentGetResultSimple {
    taskID?: string;
    hasMore?: boolean;
    errors?: string;
}

export interface ICommentUpdateContentInput {
    id: string;
    content: string;
}

export interface IAddOrRemoveCommentManagerInput {
    id: string;
    managerUserID: string;
    isAdd: boolean;
}

export interface ICommentUpdateSortOrderInput {
    id: string;
    beforeCommentID: string;
    afterCommentID: string;
}

export interface ICommentDeleteInput {
    id: string;
    taskID: string;
}

export interface IComment {
    id: string;
    content: string;
    taskID: string;
    createdByUserID: string;
    createdOn: number;
}

export interface IDraftJSMentionData {
    link: string;
    name: string;
}

export interface IDraftJSEntity {
    type: string;
    data?: any;
}

export interface IDraftJSEditorStateJSON {
    entityMap: IDraftJSEntity[];
}

export interface ICommentsState {
    readonly addCommentState: IAddCommentState;
    readonly editCommentState: IEditCommentState;
    readonly createCommentLoading: boolean;
    readonly createCommentInput: ICommentCreateInput;
    readonly createCommentResult: ICommentCommonResult;
    readonly updateCommentLoading: boolean;
    readonly updateCommentInput: ICommentUpdateInput;
    readonly updateCommentResult: ICommentCommonResult;
    readonly getNewerCommentsOfTaskLoading: boolean;
    readonly getOlderCommentsOfTaskLoading: boolean;
    // Use simple because we don't want the list of comments again
    readonly getOlderCommentsOfTaskResult: ICommentGetResultSimple;
}

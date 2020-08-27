/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import {CommentsActionTypes, ICommentCommonResult, ICommentGetResultSimple, ICommentsState} from "./types";

const initialState: ICommentsState = {
    addCommentState: {
        comment: {
            id: "",
            content: "",
            taskID: "",
            createdByUserID: "",
            createdOn: 0,
        },
    },
    editCommentState: {
        comment: {
            id: "",
            content: "",
            taskID: "",
            createdByUserID: "",
            createdOn: 0,
        },
    },
    createCommentInput: {
        content: "",
        taskID: "",
        plain: "",
    },
    createCommentLoading: false,
    createCommentResult: {
        id: undefined,
        errors: undefined,
    },
    updateCommentLoading: false,
    updateCommentInput: {
        id: "",
        title: "",
        managers: [],
        projectID: "",
        taskIDs: [],
    },
    updateCommentResult: {
        id: undefined,
        errors: undefined,
    },
    getNewerCommentsOfTaskLoading: false,
    getOlderCommentsOfTaskLoading: false,
    getOlderCommentsOfTaskResult: {
        errors: undefined,
        hasMore: undefined,
        taskID: undefined,
    },
};

const reducer: Reducer<ICommentsState> = (state = initialState, action) => {
    switch (action.type) {
        case CommentsActionTypes.SET_ADD_COMMENT_STATE:
            return {
                ...state,
                addCommentState: action.payload,
            };
        case CommentsActionTypes.SET_EDIT_COMMENT_STATE:
            return {
                ...state,
                editCommentState: action.payload,
            };
        case CommentsActionTypes.CREATE_COMMENT_SET_INPUT:
            return {
                ...state,
                createCommentInput: action.payload,
            };
        case CommentsActionTypes.CREATE_COMMENT_REQUEST:
            return {
                ...state,
                createCommentLoading: true,
            };
        case CommentsActionTypes.CREATE_COMMENT_SET_ERROR:
            return {
                ...state,
                createCommentLoading: false,
                createCommentResult: action.payload,
            };
        case CommentsActionTypes.CREATE_COMMENT_SET_RESULT: {
            const result: ICommentCommonResult = action.payload;
            return {
                ...state,
                createCommentLoading: false,
                createCommentResult: action.payload,
                createCommentInput: {
                    ...state.createCommentInput,
                    // Reset content for create input if the result is success
                    content: result.errors === undefined ? "" : state.createCommentInput.content,
                },
            };
        }
        case CommentsActionTypes.UPDATE_COMMENT_SET_INPUT:
            return {
                ...state,
                updateCommentInput: action.payload,
            };
        case CommentsActionTypes.UPDATE_COMMENT_REQUEST:
            return {
                ...state,
                updateCommentLoading: true,
            };
        case CommentsActionTypes.UPDATE_COMMENT_SET_ERROR:
            return {
                ...state,
                updateCommentLoading: false,
                updateCommentResult: action.payload,
            };
        case CommentsActionTypes.UPDATE_COMMENT_SET_RESULT:
            return {
                ...state,
                updateCommentLoading: false,
                updateCommentResult: action.payload,
            };
        case CommentsActionTypes.GET_OLDER_COMMENTS_OF_TASK_REQUEST:
            return {
                ...state,
                getOlderCommentsOfTaskLoading: true,
            };
        case CommentsActionTypes.GET_OLDER_COMMENTS_OF_TASK_SET_RESULT: {
            const getOlderCommentsOfTaskResult: ICommentGetResultSimple = action.payload;
            return {
                ...state,
                getOlderCommentsOfTaskLoading: false,
                getOlderCommentsOfTaskResult,
            };
        }
        case CommentsActionTypes.GET_NEWER_COMMENTS_OF_TASK_REQUEST:
            return {
                ...state,
                getNewerCommentsOfTaskLoading: true,
            };
        case CommentsActionTypes.GET_NEWER_COMMENTS_OF_TASK_SET_RESULT:
            return {
                ...state,
                getNewerCommentsOfTaskLoading: false,
            };
        case CommentsActionTypes.GET_COMMENT_REQUEST:
        case CommentsActionTypes.GET_COMMENTS_OF_TASK_REQUEST:
        case CommentsActionTypes.UPDATE_COMMENT_CONTENT_REQUEST:
        case CommentsActionTypes.UPDATE_COMMENT_SORT_ORDER_REQUEST:
        case CommentsActionTypes.DELETE_COMMENT_REQUEST:
        default:
            return state;
    }
};

export { reducer as commentsReducer };

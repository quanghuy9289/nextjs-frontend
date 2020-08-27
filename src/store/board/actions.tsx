/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this board.
 */

import { action } from "typesafe-actions";
import { IColumn, IColumnDeleteInput } from "../columns/types";
import { IComment, ICommentDeleteInput } from "../comments/types";
import { IPriority, IPriorityDeleteInput } from "../priorities/types";
import { ISprintRequirement } from "../sprintrequirements/types";
import { ISprint, ISprintDeleteInput } from "../sprints/types";
import { ITaskDescription } from "../taskdescriptions/types";
import { ITask, ITaskDeleteInput } from "../tasks/types";
import { IUnit } from "../units/types";
import {
    BoardActionTypes, IGetBoardResult,
} from "./types";

export const clearBoard = () =>
    action(BoardActionTypes.CLEAR_BOARD);

export const getBoardRequest = (projectShortcode: string, sprintID?: string) =>
    action(BoardActionTypes.GET_BOARD_REQUEST, {projectShortcode, sprintID});
export const getBoardRequestThenLoadTaskUpdate = (projectShortcode: string, taskID: string) =>
    action(BoardActionTypes.GET_BOARD_REQUEST_THEN_LOAD_TASK_UPDATE, {projectShortcode, taskID});
export const getBoardSetResult = (result: IGetBoardResult) =>
    action(BoardActionTypes.GET_BOARD_SET_RESULT, result);
export const getBoardSetError = (error: string) =>
    action(BoardActionTypes.GET_BOARD_SET_ERROR, error);

export const setBoardProjectShortcode = (projectShortcode: string) =>
    action(BoardActionTypes.SET_BOARD_PROJECT_SHORTCODE, projectShortcode);

export const insertOrUpdateColumnBoard = (column: IColumn) =>
    action(BoardActionTypes.INSERT_OR_UPDATE_COLUMN_BOARD, column);

export const setColumnsOrder = (columnsOrder: string[]) =>
    action(BoardActionTypes.SET_COLUMNS_ORDER, columnsOrder);

export const deleteColumnFromBoard = (input: IColumnDeleteInput) =>
    action(BoardActionTypes.DELETE_COLUMN_FROM_BOARD, input);

export const insertOrUpdatePriorityBoard = (priority: IPriority) =>
    action(BoardActionTypes.INSERT_OR_UPDATE_PRIORITY_BOARD, priority);

export const deletePriorityFromBoard = (input: IPriorityDeleteInput) =>
    action(BoardActionTypes.DELETE_PRIORITY_FROM_BOARD, input);

export const setPrioritiesOrder = (prioritiesOrder: string[]) =>
    action(BoardActionTypes.SET_PRIORITIES_ORDER, prioritiesOrder);

export const insertOrUpdateTaskBoard = (task: ITask) =>
    action(BoardActionTypes.INSERT_OR_UPDATE_TASK_BOARD, task);

export const deleteTaskFromBoard = (input: ITaskDeleteInput) =>
    action(BoardActionTypes.DELETE_TASK_FROM_BOARD, input);

export const insertOrUpdateUnitBoard = (unit: IUnit, updateOnly: boolean) =>
    action(BoardActionTypes.INSERT_OR_UPDATE_UNIT_BOARD, {unit, updateOnly});

export const insertOrUpdateTaskDescriptionBoard = (taskdescription: ITaskDescription) =>
    action(BoardActionTypes.INSERT_OR_UPDATE_TASKDESCRIPTION_BOARD, taskdescription);

export const insertOrUpdateSprintRequirementBoard = (sprintrequirement: ISprintRequirement) =>
    action(BoardActionTypes.INSERT_OR_UPDATE_SPRINTREQUIREMENT_BOARD, sprintrequirement);

export const insertOrUpdateSprintBoard = (sprint: ISprint) =>
    action(BoardActionTypes.INSERT_OR_UPDATE_SPRINT_BOARD, sprint);

export const deleteSprintFromBoard = (input: ISprintDeleteInput) =>
    action(BoardActionTypes.DELETE_SPRINT_FROM_BOARD, input);

export const setBoardLoadedSprint = (sprintID: string) =>
    action(BoardActionTypes.SET_BOARD_LOADED_SPRINT, sprintID);

export const insertOrUpdateCommentsBoard = (comments: IComment[], taskID: string, addToTop: boolean) =>
    action(BoardActionTypes.INSERT_OR_UPDATE_COMMENTS_BOARD, {comments, taskID, addToTop});

export const deleteCommentFromBoard = (input: ICommentDeleteInput) =>
    action(BoardActionTypes.DELETE_COMMENT_FROM_BOARD, input);

export const setFilterByUserID = (userID?: string) =>
    action(BoardActionTypes.SET_FILTER_BY_USER_ID, userID);

export const setBoardScaleFactor = (boardScaleFactor?: number) =>
    action(BoardActionTypes.SET_BOARD_SCALE_FACTOR, boardScaleFactor);

export const enableDragToScroll = (enableDragToScoll: boolean) =>
    action(BoardActionTypes.ENABLE_DRAG_TO_SCROLL, enableDragToScoll);

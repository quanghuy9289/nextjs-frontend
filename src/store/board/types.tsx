/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this board.
 */

import { IStringTMap } from "../../utils/types";
import { IStandardColor } from "../colors/types";
import { IColumn } from "../columns/types";
import { IComment } from "../comments/types";
import { IPriority } from "../priorities/types";
import { IProject } from "../projects/types";
import { ISprintRequirement } from "../sprintrequirements/types";
import { ISprint } from "../sprints/types";
import { ITaskDescription } from "../taskdescriptions/types";
import { ITask } from "../tasks/types";
import { IUnit } from "../units/types";

export enum BoardActionTypes {
    SET_BOARD_PROJECT_SHORTCODE = "@@board/SET_BOARD_PROJECT_SHORTCODE",
    GET_BOARD_REQUEST = "@@board/GET_BOARD_REQUEST",
    GET_BOARD_REQUEST_THEN_LOAD_TASK_UPDATE = "@@board/GET_BOARD_REQUEST_THEN_LOAD_TASK_UPDATE",
    GET_BOARD_SET_RESULT = "@@board/GET_BOARD_SET_RESULT",
    GET_BOARD_SET_ERROR = "@@board/GET_BOARD_SET_ERROR",
    INSERT_OR_UPDATE_COLUMN_BOARD = "@@board/INSERT_OR_UPDATE_COLUMN_BOARD",
    INSERT_OR_UPDATE_PRIORITY_BOARD = "@@board/INSERT_OR_UPDATE_PRIORITY_BOARD",
    INSERT_OR_UPDATE_TASK_BOARD = "@@board/INSERT_OR_UPDATE_TASK_BOARD",
    INSERT_OR_UPDATE_UNIT_BOARD = "@@board/INSERT_OR_UPDATE_UNIT_BOARD",
    INSERT_OR_UPDATE_TASKDESCRIPTION_BOARD = "@@board/INSERT_OR_UPDATE_TASKDESCRIPTION_BOARD",
    INSERT_OR_UPDATE_SPRINTREQUIREMENT_BOARD = "@@board/INSERT_OR_UPDATE_SPRINTREQUIREMENT_BOARD",
    INSERT_OR_UPDATE_COMMENTS_BOARD = "@@board/INSERT_OR_UPDATE_COMMENTS_BOARD",
    INSERT_OR_UPDATE_SPRINT_BOARD = "@@board/INSERT_OR_UPDATE_SPRINT_BOARD",
    SET_COLUMNS_ORDER = "@@board/SET_COLUMNS_ORDER",
    DELETE_COLUMN_FROM_BOARD = "@@board/DELETE_COLUMN_FROM_BOARD",
    DELETE_PRIORITY_FROM_BOARD = "@@board/DELETE_PRIORITY_FROM_BOARD",
    DELETE_TASK_FROM_BOARD = "@@board/DELETE_TASK_FROM_BOARD",
    DELETE_COMMENT_FROM_BOARD = "@@board/DELETE_COMMENT_FROM_BOARD",
    SET_PRIORITIES_ORDER = "@@board/SET_PRIORITIES_ORDER",
    CLEAR_BOARD = "@@board/CLEAR_BOARD",
    DELETE_SPRINT_FROM_BOARD = "@@board/DELETE_SPRINT_FROM_BOARD",
    SET_BOARD_LOADED_SPRINT = "@@board/SET_BOARD_LOADED_SPRINT",
    SET_FILTER_BY_USER_ID = "@@board/SET_FILTER_BY_USER_ID",
    SET_BOARD_SCALE_FACTOR = "@@board/SET_BOARD_SCALE_FACTOR",
    ENABLE_DRAG_TO_SCROLL = "@@board/ENABLE_DRAG_TO_SCROLL",
}

export interface IGetBoardResult {
    board: IBoard;
    errors?: string;
}

export interface IBoard {
    // Definition of the board
    columns: IColumn[];
    priorities: IPriority[];
    sprints: ISprint[];
    tasks: ITask[];
    projectID: string;
    project: IProject;
    units: IUnit[];
    loadedSprintID?: string;
}

export interface IBoardState {
    readonly projectID: string;
    readonly project: IProject;
    readonly getBoardLoaded: boolean;
    readonly getBoardLoading: boolean;
    readonly getBoardResult: IGetBoardResult;
    readonly priorityMap: IStringTMap<IPriority>;
    readonly prioritiesOrder: string[];
    readonly columnMap: IStringTMap<IColumn>;
    readonly columnsOrder: string[];
    readonly taskMap: IStringTMap<ITask>;
    readonly sprintsOrder: string[];
    readonly sprintMap: IStringTMap<ISprint>;
    readonly unitMap: IStringTMap<IUnit>;
    // Description is large data, so we make a map for loading it later
    readonly taskDescriptionMap: IStringTMap<ITaskDescription>;
    // Comments are large data, so we make a map for loading it later
    readonly commentMap: IStringTMap<IComment[]>;
    readonly sprintRequirementBySprintIDAndUserIDMap: IStringTMap<ISprintRequirement>;
    readonly loadedSprintID?: string; // The sprint the the board is loaded with at the moment
    readonly filterByUserID?: string;
    readonly boardScaleFactor?: number;
    // Scrolling
    readonly enableDragToScroll: boolean;
}

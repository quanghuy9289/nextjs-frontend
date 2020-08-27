/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import {IGetTasksResult, ITask, ITasksState, TasksActionTypes} from "./types";

const initialState: ITasksState = {
    addTaskState: {
        task: {
            id: "",
            title: "",
            managers: [],
            appointees: [],
            projectID: "",
            columnID: "",
            priorityID: "",
            sprintID: "",
            units: [],
            incrementcode: 0,
            createdOn: 0,
            createdByUserID: "",
            totalUnitPoints: 0,
            totalUnitPointsCompleted: 0,
            doesHaveZeroUnit: false,
        },
    },
    editTaskState: {
        task: {
            id: "",
            title: "",
            managers: [],
            appointees: [],
            projectID: "",
            columnID: "",
            priorityID: "",
            sprintID: "",
            units: [],
            incrementcode: 0,
            createdOn: 0,
            createdByUserID: "",
            totalUnitPoints: 0,
            totalUnitPointsCompleted: 0,
            doesHaveZeroUnit: false,
        },
    },
    createTaskInput: {
        title: "",
        managers: [],
        appointees: [],
        projectID: "",
        columnID: "",
        priorityID: "",
        sprintID: "",
        description: "",
        units: [],
        // unitMap: {},
    },
    createTaskLoading: false,
    createTaskResult: {
        id: undefined,
        errors: undefined,
    },
    updateTaskLoading: false,
    updateTaskInput: {
        id: "",
        title: "",
        managers: [],
        appointees: [],
        projectID: "",
        columnID: "",
        priorityID: "",
        sprintID: "",
        description: "",
        units: [],
        incrementcode: 0,
        createdOn: 0,
        createdByUserID: "",
        totalUnitPoints: 0,
        totalUnitPointsCompleted: 0,
        doesHaveZeroUnit: false,
    },
    updateTaskResult: {
        id: undefined,
        errors: undefined,
    },
    addTaskUnitLoading: false,
    getTasksLoading: false,
    getTasksLoaded: false,
    getTasksResult: {
        tasks: [],
        projects: [],
        errors: undefined,
    },
    taskMap: {
    },
    tasksOrder: [],
    taskColumnMap: {},
    taskPriorityMap: {},
    taskProjectColumnIDsMap: {},
    taskProjectPriorityIDsMap: {},
    taskUnitMap: {},
};

const reducer: Reducer<ITasksState> = (state = initialState, action) => {
    switch (action.type) {
        case TasksActionTypes.SET_ADD_TASK_STATE:
            return {
                ...state,
                addTaskState: action.payload,
            };
        case TasksActionTypes.SET_EDIT_TASK_STATE:
            return {
                ...state,
                editTaskState: action.payload,
            };
        case TasksActionTypes.CREATE_TASK_SET_INPUT:
            return {
                ...state,
                createTaskInput: action.payload,
            };
        case TasksActionTypes.CREATE_TASK_REQUEST:
            return {
                ...state,
                createTaskLoading: true,
            };
        case TasksActionTypes.CREATE_TASK_SET_ERROR:
            return {
                ...state,
                createTaskLoading: false,
                createTaskResult: action.payload,
            };
        case TasksActionTypes.CREATE_TASK_SET_RESULT:
            return {
                ...state,
                createTaskLoading: false,
                createTaskResult: action.payload,
            };
        case TasksActionTypes.UPDATE_TASK_SET_INPUT:
            return {
                ...state,
                updateTaskInput: action.payload,
            };
        case TasksActionTypes.UPDATE_TASK_REQUEST:
            return {
                ...state,
                updateTaskLoading: true,
            };
        case TasksActionTypes.UPDATE_TASK_SET_ERROR:
            return {
                ...state,
                updateTaskLoading: false,
                updateTaskResult: action.payload,
            };
        case TasksActionTypes.UPDATE_TASK_SET_RESULT:
            return {
                ...state,
                updateTaskLoading: false,
                updateTaskResult: action.payload,
            };
        case TasksActionTypes.ADD_TASK_UNIT_REQUEST:
            return {
                ...state,
                addTaskUnitLoading: true,
            };
        case TasksActionTypes.ADD_TASK_UNIT_SET_RESULT:
            return {
                ...state,
                addTaskUnitLoading: false,
            };
        case TasksActionTypes.GET_TASKS_REQUEST:
            return {
                ...state,
                getTasksLoading: true,
            };
        case TasksActionTypes.GET_TASKS_SET_RESULT: {
            const getTasksResult: IGetTasksResult = action.payload;
            const taskMap = {};
            if (getTasksResult.errors === undefined) {
                getTasksResult.tasks.map((eachTask: ITask, index: number) => {
                    taskMap[eachTask.id] = eachTask;
                });
            }
            return {
                ...state,
                getTasksLoading: false,
                getTasksLoaded: true,
                getTasksResult,
                taskMap,
                tasksOrder: _.keys(taskMap),
            };
        }
        case TasksActionTypes.GET_TASKS_SET_ERROR: {
            return {
                ...state,
                getTasksLoading: false,
                getTasksResult: action.payload,
            };
        }
        case TasksActionTypes.GET_TASK_REQUEST:
        case TasksActionTypes.GET_TASK_REQUEST_THEN_LOAD_TASK_UPDATE:
        case TasksActionTypes.UPDATE_TASK_TITLE_REQUEST:
        case TasksActionTypes.UPDATE_TASK_SORT_ORDER_REQUEST:
        case TasksActionTypes.DELETE_TASK_REQUEST:
        case TasksActionTypes.ADD_OR_REMOVE_TASK_MANAGER_REQUEST:
        case TasksActionTypes.ADD_OR_REMOVE_TASK_APPOINTEE_REQUEST:
        case TasksActionTypes.REMOVE_TASK_UNIT_REQUEST:
        default:
            return state;
    }
};

export { reducer as tasksReducer };

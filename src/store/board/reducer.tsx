/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this board.
 */

import _ from "lodash";
import { Reducer } from "redux";
import { combineIDs } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import { IColumn, IColumnDeleteInput } from "../columns/types";
import { IComment, ICommentDeleteInput } from "../comments/types";
import { IPriority, IPriorityDeleteInput } from "../priorities/types";
import { ISprintRequirement } from "../sprintrequirements/types";
import { ISprint, ISprintDeleteInput } from "../sprints/types";
import { ITaskDescription } from "../taskdescriptions/types";
import { ITask, ITaskDeleteInput } from "../tasks/types";
import { IUnit } from "../units/types";
import { insertOrUpdateUnitBoard } from "./actions";
import { BoardActionTypes, IBoardState, IGetBoardResult } from "./types";

const initialState: IBoardState = {
    getBoardLoaded: false,
    getBoardLoading: true,
    projectID: "", // Test
    project: {
        id: "",
        color: {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 1.0,
        },
        currentSprint: {
            id: "",
            name: "",
            beginOn: 0,
            endOn: 0,
            projectID: "",
        },
        memberUserIDs: [],
        name: "",
        shortcode: "",
        sortOrder: 0,
        minUnitPoints: 0,
        maxUnitPoints: 100,
    },
    getBoardResult: {
        board: {
            columns: [],
            priorities: [],
            sprints: [],
            tasks: [],
            projectID: "",
            project: {
                id: "",
                color: {
                    red: 255,
                    green: 255,
                    blue: 255,
                    alpha: 1.0,
                },
                currentSprint: {
                    id: "",
                    name: "",
                    beginOn: 0,
                    endOn: 0,
                    projectID: "",
                },
                memberUserIDs: [],
                name: "",
                shortcode: "",
                sortOrder: 0,
                minUnitPoints: 0,
                maxUnitPoints: 100,
            },
            units: [],
        },
        errors: undefined,
    },
    priorityMap: {},
    prioritiesOrder: [],
    columnMap: {},
    columnsOrder: [],
    taskMap: {},
    sprintsOrder: [],
    sprintMap: {},
    unitMap: {},
    taskDescriptionMap: {},
    commentMap: {},
    sprintRequirementBySprintIDAndUserIDMap: {},
    loadedSprintID: undefined,
    filterByUserID: undefined,
    boardScaleFactor: undefined,
    enableDragToScroll: true,
};

const reducer: Reducer<IBoardState> = (state = initialState, action) => {
    switch (action.type) {
        case BoardActionTypes.GET_BOARD_REQUEST:
            return {
                ...initialState,
                getBoardLoading: true,
                filterByUserID: state.filterByUserID,
                boardScaleFactor: state.boardScaleFactor,

            };
        case BoardActionTypes.GET_BOARD_REQUEST_THEN_LOAD_TASK_UPDATE:
            return {
                ...initialState,
                getBoardLoading: true,
                filterByUserID: state.filterByUserID,
                boardScaleFactor: state.boardScaleFactor,
            };
        case BoardActionTypes.GET_BOARD_SET_RESULT: {
            const getBoardResult: IGetBoardResult = action.payload;
            const columnMap: IStringTMap<IColumn> = {};
            if (getBoardResult.errors === undefined) {
                getBoardResult.board.columns.map((eachColumn: IColumn, index: number) => {
                    columnMap[eachColumn.id] = eachColumn;
                });
            }

            const priorityMap: IStringTMap<IPriority> = {};
            if (getBoardResult.errors === undefined) {
                getBoardResult.board.priorities.map((eachPriority: IPriority, index: number) => {
                    priorityMap[eachPriority.id] = eachPriority;
                });
            }

            const taskMap: IStringTMap<ITask> = {};
            if (getBoardResult.errors === undefined) {
                getBoardResult.board.tasks.map((eachTask: ITask, index: number) => {
                    taskMap[eachTask.id] = eachTask;
                });
            }

            const sprintMap: IStringTMap<ISprint> = {};
            if (getBoardResult.errors === undefined) {
                getBoardResult.board.sprints.map((eachSprint: ISprint, index: number) => {
                    sprintMap[eachSprint.id] = eachSprint;
                });
            }

            const unitMap: IStringTMap<IUnit> = {};
            if (getBoardResult.errors === undefined) {
                getBoardResult.board.units.map((eachUnit: IUnit, index: number) => {
                    unitMap[eachUnit.id] = eachUnit;
                });
            }

            return {
                ...state,
                projectID: getBoardResult.errors ? "" : getBoardResult.board.projectID,
                project: getBoardResult.errors ? initialState.project : getBoardResult.board.project,
                getBoardLoading: false,
                getBoardLoaded: true,
                getBoardResult,
                columnMap,
                columnsOrder: _.keys(columnMap),
                priorityMap,
                prioritiesOrder: _.keys(priorityMap),
                sprintsOrder: _.keys(sprintMap),
                sprintMap,
                taskMap,
                unitMap,
                loadedSprintID: getBoardResult.errors ? undefined : getBoardResult.board.loadedSprintID,
            };
        }
        case BoardActionTypes.GET_BOARD_SET_ERROR: {
            return {
                ...state,
                loading: false,
                getBoardResult: action.payload,
            };
        }
        case BoardActionTypes.SET_BOARD_PROJECT_SHORTCODE: {
            return {
                ...state,
                projectShortcode: action.payload,
            };
        }
        case BoardActionTypes.INSERT_OR_UPDATE_COLUMN_BOARD: {
            const insertedColumn: IColumn = action.payload;
            let isInsertColumn: boolean = false;
            if (state.columnsOrder.indexOf(insertedColumn.id) < 0) {
                isInsertColumn = true;
            }
            return {
                ...state,
                columnMap : {
                    ...state.columnMap,
                    [insertedColumn.id] : insertedColumn,
                },
                columnsOrder: isInsertColumn ? [...state.columnsOrder, insertedColumn.id] : [...state.columnsOrder],
            };
        }
        case BoardActionTypes.INSERT_OR_UPDATE_PRIORITY_BOARD: {
            const insertedPriority: IPriority = action.payload;
            let isInsertPriority: boolean = false;
            if (state.prioritiesOrder.indexOf(insertedPriority.id) < 0) {
                isInsertPriority = true;
            }
            return {
                ...state,
                priorityMap : {
                    ...state.priorityMap,
                    [insertedPriority.id] : insertedPriority,
                },
                prioritiesOrder: isInsertPriority ?
                    [...state.prioritiesOrder, insertedPriority.id] :
                    [...state.prioritiesOrder],
            };
        }
        case BoardActionTypes.INSERT_OR_UPDATE_TASK_BOARD: {
            const insertedTask: ITask = action.payload;
            // let isInsertTask: boolean = false;
            // if (state.prioritiesOrder.indexOf(insertedTask.id) < 0) {
            //     isInsertTask = true;
            // }

            // Insert to column
            const editedColumn: IColumn | undefined = state.columnMap[insertedTask.columnID];
            const newColumnMap: IStringTMap<IColumn> = {
                ...state.columnMap,
            };
            if (editedColumn !== undefined &&
                editedColumn.taskIDs.indexOf(insertedTask.id) < 0) {
                editedColumn.taskIDs.push(insertedTask.id);
                newColumnMap[editedColumn.id] = editedColumn;
            }

            // Insert to priority
            const editedPriority: IPriority | undefined = state.priorityMap[insertedTask.priorityID];
            const newPriorityMap: IStringTMap<IPriority> = {
                ...state.priorityMap,
            };
            if (editedPriority !== undefined &&
                editedPriority.taskIDs.indexOf(insertedTask.id) < 0) {
                editedPriority.taskIDs.push(insertedTask.id);
                newPriorityMap[editedPriority.id] = editedPriority;
            }

            return {
                ...state,
                taskMap : {
                    ...state.taskMap,
                    [insertedTask.id] : insertedTask,
                },
                columnMap : newColumnMap,
                priorityMap : newPriorityMap,
            };
        }
        case BoardActionTypes.INSERT_OR_UPDATE_UNIT_BOARD: {
            const actionData: ReturnType<typeof insertOrUpdateUnitBoard> = {
                payload : action.payload,
                type: BoardActionTypes.INSERT_OR_UPDATE_UNIT_BOARD,
            };
            const insertedUnit: IUnit = actionData.payload.unit;
            const taskOfUnit: ITask = state.taskMap[insertedUnit.taskID];
            const units = [...taskOfUnit.units];
            if (!actionData.payload.updateOnly && units.indexOf(insertedUnit.id) < 0) {
                units.push(insertedUnit.id);
            }

            let totalUnitPoints: number = 0;
            let totalUnitPointsCompleted: number = 0;
            let doesHaveZeroUnit: boolean = false;
            units.forEach((eachUnitID: string) => {
                if (eachUnitID === insertedUnit.id) {
                    totalUnitPoints += insertedUnit.points;
                    if (!_.isEmpty(insertedUnit.completedByUserID)) {
                        totalUnitPointsCompleted += insertedUnit.points;
                    }
                    if (insertedUnit.points === 0) {
                        doesHaveZeroUnit = true;
                    }
                } else if (state.unitMap[eachUnitID] !== undefined) {
                    const eachUnit: IUnit = state.unitMap[eachUnitID];
                    totalUnitPoints += eachUnit.points;
                    if (!_.isEmpty(eachUnit.completedByUserID)) {
                        totalUnitPointsCompleted += eachUnit.points;
                    }
                    if (eachUnit.points === 0) {
                        doesHaveZeroUnit = true;
                    }
                }
            });

            return {
                ...state,
                taskMap : {
                    ...state.taskMap,
                    [taskOfUnit.id] : {
                        ...taskOfUnit,
                        units,
                        totalUnitPoints,
                        totalUnitPointsCompleted,
                        doesHaveZeroUnit,
                    },
                },
                unitMap: {
                    ...state.unitMap,
                    [insertedUnit.id] : insertedUnit,
                },
            };
        }
        case BoardActionTypes.INSERT_OR_UPDATE_TASKDESCRIPTION_BOARD: {
            const insertedTaskDescription: ITaskDescription = action.payload;

            return {
                ...state,
                taskDescriptionMap: {
                    ...state.taskDescriptionMap,
                    [insertedTaskDescription.taskID] : insertedTaskDescription,
                },
            };
        }
        case BoardActionTypes.INSERT_OR_UPDATE_SPRINTREQUIREMENT_BOARD: {
            const insertedSprintRequirement: ISprintRequirement = action.payload;

            return {
                ...state,
                sprintRequirementBySprintIDAndUserIDMap: {
                    ...state.sprintRequirementBySprintIDAndUserIDMap,
                    [combineIDs(insertedSprintRequirement.sprintID, insertedSprintRequirement.userID)] :
                        insertedSprintRequirement,
                },
            };
        }
        case BoardActionTypes.INSERT_OR_UPDATE_COMMENTS_BOARD: {
            const insertedComments: IComment[] = action.payload.comments;
            const taskID: string = action.payload.taskID;
            const addToTop: boolean = action.payload.addToTop;
            let currentComments = state.commentMap[taskID];
            if (currentComments === undefined) {
                currentComments = [];
            }

            if (addToTop) {
                return {
                    ...state,
                    commentMap: {
                        ...state.commentMap,
                        [taskID] : [
                            ...insertedComments,
                            ...currentComments,
                        ],
                    },
                };
            } else {
                return {
                    ...state,
                    commentMap: {
                        ...state.commentMap,
                        [taskID] : [
                            ...currentComments,
                            ...insertedComments,
                        ],
                    },
                };
            }
        }
        case BoardActionTypes.INSERT_OR_UPDATE_SPRINT_BOARD: {
            const insertedSprint: ISprint = action.payload;
            const sprintsOrder = [...state.sprintsOrder];
            if (sprintsOrder.indexOf(insertedSprint.id) < 0) {
                sprintsOrder.push(insertedSprint.id);
            }
            return {
                ...state,
                sprintsOrder,
                sprintMap: {
                    ...state.sprintMap,
                    [insertedSprint.id] : insertedSprint,
                },
            };
        }
        case BoardActionTypes.SET_COLUMNS_ORDER: {
            return {
                ...state,
                columnsOrder: action.payload,
            };
        }
        case BoardActionTypes.SET_PRIORITIES_ORDER: {
            return {
                ...state,
                prioritiesOrder: action.payload,
            };
        }
        case BoardActionTypes.DELETE_COLUMN_FROM_BOARD: {
            const deleteColumnInput: IColumnDeleteInput = action.payload;
            return {
                ...state,
                columnsOrder: _.remove(state.columnsOrder, (eachColumnID: string) => {
                    return eachColumnID !== deleteColumnInput.id;
                }),
            };
        }
        case BoardActionTypes.DELETE_PRIORITY_FROM_BOARD: {
            const deletePriorityInput: IPriorityDeleteInput = action.payload;
            return {
                ...state,
                prioritiesOrder: _.remove(state.prioritiesOrder, (eachPriorityID: string) => {
                    return eachPriorityID !== deletePriorityInput.id;
                }),
            };
        }
        case BoardActionTypes.DELETE_TASK_FROM_BOARD: {
            const deletedTaskInput: ITaskDeleteInput = action.payload;
            const deletedTask: ITask = state.taskMap[deletedTaskInput.id];
            const column: IColumn = state.columnMap[deletedTask.columnID];
            column.taskIDs = _.remove(column.taskIDs, (eachTaskID: string) => {
                return eachTaskID !== deletedTask.id;
            });

            return {
                ...state,
                // To do
                columnMap: {
                    ...state.columnMap,
                    [column.id] : column,
                },
            };
        }
        case BoardActionTypes.DELETE_SPRINT_FROM_BOARD: {
            const deleteSprintInput: ISprintDeleteInput = action.payload;
            return {
                ...state,
                sprintsOrder: _.remove(state.sprintsOrder, (eachSprintID: string) => {
                    return eachSprintID !== deleteSprintInput.id;
                }),
            };
        }
        case BoardActionTypes.DELETE_COMMENT_FROM_BOARD: {
            const input: ICommentDeleteInput = action.payload;
            const comments: IComment[] = state.commentMap[input.taskID];
            if (comments !== undefined) {
                _.remove(
                    comments,
                    (eachComment: IComment) => {
                    return eachComment.id === input.id;
                });

                return {
                    ...state,
                    commentMap: {
                        ...state.commentMap,
                        [input.taskID] : comments,
                    },
                };
            }
        }
        case BoardActionTypes.SET_BOARD_LOADED_SPRINT: {
            return {
                ...state,
                loadedSprintID: action.payload,
            };
        }
        case BoardActionTypes.CLEAR_BOARD: {
            return {
                ...initialState,
            };
        }
        case BoardActionTypes.SET_FILTER_BY_USER_ID: {
            return {
                ...state,
                filterByUserID: action.payload,
            };
        }
        case BoardActionTypes.SET_BOARD_SCALE_FACTOR: {
            return {
                ...state,
                boardScaleFactor: action.payload,
            };
        }
        case BoardActionTypes.ENABLE_DRAG_TO_SCROLL: {
            return {
                ...state,
                enableDragToScroll: action.payload,
            };
        }
        default:
            return state;
    }
};

export { reducer as boardReducer };

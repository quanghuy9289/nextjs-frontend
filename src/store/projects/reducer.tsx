/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import {
    ADD_NEW_PROJECT,
    IAddOrRemoveProjectMemberInput,
    ICreateProjectResult,
    IGetProjectsResult,
    IProject,
    IProjectDeleteInput,
    IProjectGetResult,
    IProjectsState,
    IProjectUpdateUnitPointsRangeInput,
    ProjectsActionTypes,
} from "./types";

const initialState: IProjectsState = {
    projects: {
        "project-1": {id: "project-1", title: "Cooking the Books"},
        "project-2": {id: "project-2", title: "Drinking the Profit"},
        "project-3": {id: "project-3", title: "Keeping it cool"},
    },
    // Facilitate reordering of the projects
    projectOrder: ["project-1", "project-2", "project-3"],
    projectsLoading: false,
    defaultProjectColor: {
        alpha: 1.0,
        red: 57,
        green: 75,
        blue: 89,
    },
    createProjectLoading: false,
    createProjectInput: {
        name: "",
        members: [],
        color: {
            alpha: 1.0,
            red: 57,
            green: 75,
            blue: 89,
        },
        minUnitPoints: 0,
        maxUnitPoints: 100,
    },
    createProjectResult: {
        id: undefined,
        errors: undefined,
    },
    getProjectsLoading: false,
    getProjectsResult: {
        projects: [],
    },
    projectMap: {},
    projectsOrder: [],
    updateProjectCurrentSprintLoading: false,
};

const reducer: Reducer<IProjectsState> = (state = initialState, action) => {
    switch (action.type) {
        case ADD_NEW_PROJECT:
            const addNewProject = () => {
                const projects = _.clone(state.projects);
                const projectOrder = _.clone(state.projectOrder);
                // const newProjectID = uuid
                // projects['project']
                return {
                    ...state,
                };
            };
            return addNewProject();
        case ProjectsActionTypes.CREATE_PROJECT_SET_INPUT:
            return {
                ...state,
                createProjectInput: action.payload,
            };
        case ProjectsActionTypes.CREATE_PROJECT_REQUEST:
            return {
                ...state,
                createProjectLoading: true,
            };
        case ProjectsActionTypes.CREATE_PROJECT_SET_ERROR:
            return {
                ...state,
                createProjectLoading: false,
                createProjectResult: action.payload,
            };
        case ProjectsActionTypes.CREATE_PROJECT_SET_RESULT:
            return {
                ...state,
                createProjectLoading: false,
                createProjectResult: action.payload,
            };
        case ProjectsActionTypes.SET_PROJECTS_LOADING:
            return {
                ...state,
                projectsLoading: action.payload,
            };
        case ProjectsActionTypes.GET_PROJECTS_REQUEST:
            return {
                ...state,
                getProjectsLoading: true,
            };
        case ProjectsActionTypes.GET_PROJECTS_SET_RESULT: {
            const getProjectsResult: IGetProjectsResult = action.payload;
            const projectMap = {};
            if (getProjectsResult.errors === undefined) {
                getProjectsResult.projects.map((eachProject: IProject, index: number) => {
                    projectMap[eachProject.id] = eachProject;
                });
            }
            return {
                ...state,
                getProjectsLoading: false,
                getProjectsResult,
                projectMap,
                projectsOrder: _.keys(projectMap),
            };
        }
        case ProjectsActionTypes.GET_PROJECTS_SET_ERROR: {
            return {
                ...state,
                getProjectsLoading: false,
                getProjectsResult: action.payload,
            };
        }
        case ProjectsActionTypes.UPDATE_PROJECT_NAME_REQUEST: {
            return {
                ...state,
                projectMap: {
                    ...state.projectMap,
                    [action.payload.id] : {
                        ...state.projectMap[action.payload.id],
                        name: action.payload.name,
                    },
                },
            };
        }
        case ProjectsActionTypes.UPDATE_PROJECT_COLOR_REQUEST: {
            return {
                ...state,
                projectMap: {
                    ...state.projectMap,
                    [action.payload.id] : {
                        ...state.projectMap[action.payload.id],
                        color: action.payload.color,
                    },
                },
            };
        }
        case ProjectsActionTypes.UPDATE_PROJECT_UNITPOINTSRANGE_REQUEST: {
            const input: IProjectUpdateUnitPointsRangeInput = action.payload;
            return {
                ...state,
                projectMap: {
                    ...state.projectMap,
                    [action.payload.id] : {
                        ...state.projectMap[action.payload.id],
                        minUnitPoints: input.minUnitPoints,
                        maxUnitPoints: input.maxUnitPoints,
                    },
                },
            };
        }
        case ProjectsActionTypes.ADD_OR_REMOVE_PROJECT_MEMBER_REQUEST: {
            const addOrRemoveProjectMemberInput: IAddOrRemoveProjectMemberInput = action.payload;
            const memberUserIDs = addOrRemoveProjectMemberInput.isAdd ?
            [
                ...state.projectMap[addOrRemoveProjectMemberInput.id].memberUserIDs,
                addOrRemoveProjectMemberInput.memberUserID,
            ] :
            _.filter(state.projectMap[addOrRemoveProjectMemberInput.id].memberUserIDs, (eachUserID: string) => {
                return eachUserID !== addOrRemoveProjectMemberInput.memberUserID;
            });
            return {
                ...state,
                projectMap: {
                    ...state.projectMap,
                    [action.payload.id] : {
                        ...state.projectMap[action.payload.id],
                        memberUserIDs,
                    },
                },
            };
        }
        case ProjectsActionTypes.SET_PROJECTS_ORDER: {
            return {
                ...state,
                projectsOrder: action.payload,
            };
        }
        case ProjectsActionTypes.DELETE_PROJECT_REQUEST: {
            const deleteProjectInput: IProjectDeleteInput = action.payload;
            return {
                ...state,
                projectsOrder: _.remove(state.projectsOrder, (eachProjectID: string) => {
                    return eachProjectID !== deleteProjectInput.id;
                }),
            };
        }
        case ProjectsActionTypes.UPDATE_PROJECT_CURRENTSPRINT_REQUEST: {
            return {
                ...state,
                updateProjectCurrentSprintLoading: true,
            };
        }
        case ProjectsActionTypes.UPDATE_PROJECT_CURRENTSPRINT_SET_RESULT: {
            return {
                ...state,
                updateProjectCurrentSprintLoading: false,
            };
        }
        case ProjectsActionTypes.INSERT_OR_UPDATE_PROJECT: {
            const insertedProject: IProject = action.payload;
            let isInsertProject: boolean = false;
            if (state.projectsOrder.indexOf(insertedProject.id) < 0) {
                isInsertProject = true;
            }
            return {
                ...state,
                projectMap : {
                    ...state.projectMap,
                    [insertedProject.id] : insertedProject,
                },
                projectsOrder: isInsertProject ?
                    [...state.projectsOrder, insertedProject.id] :
                    [...state.projectsOrder],
            };
        }
        case ProjectsActionTypes.GET_PROJECT_REQUEST:
        case ProjectsActionTypes.GET_PROJECT_SET_RESULT:
        case ProjectsActionTypes.UPDATE_PROJECT_SORT_ORDER_REQUEST:
        default:
            return state;
    }
};

export { reducer as projectsReducer };

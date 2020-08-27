/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { action } from "typesafe-actions";
import {
    ADD_NEW_PROJECT,
    IAddOrRemoveProjectMemberInput,
    ICreateProjectInput,
    ICreateProjectResult,
    IProject,
    IProjectCommonResult,
    IProjectDeleteInput,
    IProjectUpdateColorInput,
    IProjectUpdateCurrentSprintInput,
    IProjectUpdateSortOrderInput,
    IProjectUpdateUnitPointsRangeInput,
    IUpdateProjectNameInput,
    ProjectsActionTypes,
} from "./types";

export const addNewProject = () => ({
    type: ADD_NEW_PROJECT,
    payload: null,
});

export const setProjectsLoading = (loading: boolean) =>
    action(ProjectsActionTypes.SET_PROJECTS_LOADING);

export const createProjectSetInput = (input: ICreateProjectInput) =>
    action(ProjectsActionTypes.CREATE_PROJECT_SET_INPUT, input);
export const createProjectRequest = (input: ICreateProjectInput) =>
    action(ProjectsActionTypes.CREATE_PROJECT_REQUEST, input);
export const createProjectSetError = (errors: string) =>
    action(ProjectsActionTypes.CREATE_PROJECT_SET_ERROR, {errors});
export const createProjectSetResult = (result: ICreateProjectResult) =>
    action(ProjectsActionTypes.CREATE_PROJECT_SET_RESULT, result);

export const getProjectsRequest = () =>
    action(ProjectsActionTypes.GET_PROJECTS_REQUEST);
export const getProjectsSetResult = (result: IProject) =>
    action(ProjectsActionTypes.GET_PROJECTS_SET_RESULT, result);
export const getProjectsSetError = (error: string) =>
    action(ProjectsActionTypes.GET_PROJECTS_SET_ERROR, error);

export const getProjectRequest = (projectID: string) =>
    action(ProjectsActionTypes.GET_PROJECT_REQUEST, projectID);
export const getProjectSetResult = (result: IProject) =>
    action(ProjectsActionTypes.GET_PROJECT_SET_RESULT, result);

export const updateProjectNameRequest = (input: IUpdateProjectNameInput) =>
    action(ProjectsActionTypes.UPDATE_PROJECT_NAME_REQUEST, input);

export const addOrRemoveProjectMemberRequest = (input: IAddOrRemoveProjectMemberInput) =>
    action(ProjectsActionTypes.ADD_OR_REMOVE_PROJECT_MEMBER_REQUEST, input);

export const updateProjectSortOrderRequest = (input: IProjectUpdateSortOrderInput) =>
    action(ProjectsActionTypes.UPDATE_PROJECT_SORT_ORDER_REQUEST, input);

export const updateProjectCurrentSprintRequest = (input: IProjectUpdateCurrentSprintInput) =>
    action(ProjectsActionTypes.UPDATE_PROJECT_CURRENTSPRINT_REQUEST, input);

export const updateProjectCurrentSprintSetResult = (input: IProjectCommonResult) =>
    action(ProjectsActionTypes.UPDATE_PROJECT_CURRENTSPRINT_SET_RESULT, input);

export const setProjectsOrder = (projectsOrder: string[]) =>
    action(ProjectsActionTypes.SET_PROJECTS_ORDER, projectsOrder);

export const updateProjectColorRequest = (input: IProjectUpdateColorInput) =>
    action(ProjectsActionTypes.UPDATE_PROJECT_COLOR_REQUEST, input);

export const updateProjectUnitPointsRangeRequest = (input: IProjectUpdateUnitPointsRangeInput) =>
    action(ProjectsActionTypes.UPDATE_PROJECT_UNITPOINTSRANGE_REQUEST, input);

export const deleteProjectRequest = (input: IProjectDeleteInput) =>
    action(ProjectsActionTypes.DELETE_PROJECT_REQUEST, input);

export const insertOrUpdateProject = (project: IProject) =>
    action(ProjectsActionTypes.INSERT_OR_UPDATE_PROJECT, project);

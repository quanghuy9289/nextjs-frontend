/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IStringTMap } from "../../utils/types";
import { IStandardColor } from "../colors/types";
import { ISprint } from "../sprints/types";

export const ADD_NEW_PROJECT = "ADD_NEW_PROJECT";

export enum ProjectsActionTypes {
    SET_PROJECTS_LOADING = "@@projects/SET_PROJECTS_LOADING",
    CREATE_PROJECT_SET_INPUT = "@@projects/CREATE_PROJECT_SET_INPUT",
    CREATE_PROJECT_REQUEST = "@@projects/CREATE_PROJECT_REQUEST",
    CREATE_PROJECT_SET_ERROR = "@@projects/CREATE_PROJECT_SET_ERROR",
    CREATE_PROJECT_SET_RESULT = "@@projects/CREATE_PROJECT_SET_RESULT",
    GET_PROJECT_REQUEST = "@@projects/GET_PROJECT_REQUEST",
    GET_PROJECT_SET_RESULT = "@@projects/GET_PROJECT_SET_RESULT",
    GET_PROJECTS_REQUEST = "@@projects/GET_PROJECTS_REQUEST",
    GET_PROJECTS_SET_RESULT = "@@projects/GET_PROJECTS_SET_RESULT",
    GET_PROJECTS_SET_ERROR = "@@projects/GET_PROJECTS_SET_ERROR",
    UPDATE_PROJECT_NAME_REQUEST =  "@@projects/UPDATE_PROJECT_NAME_REQUEST",
    UPDATE_PROJECT_CURRENTSPRINT_REQUEST = "@@projects/UPDATE_PROJECT_CURRENTSPRINT_REQUEST",
    UPDATE_PROJECT_CURRENTSPRINT_SET_RESULT = "@@projects/UPDATE_PROJECT_CURRENTSPRINT_SET_RESULT",
    ADD_OR_REMOVE_PROJECT_MEMBER_REQUEST = "@@projects/ADD_OR_REMOVE_PROJECT_MEMBER_REQUEST",
    UPDATE_PROJECT_SORT_ORDER_REQUEST = "@@projects/UPDATE_PROJECT_SORT_ORDER_REQUEST",
    SET_PROJECTS_ORDER = "@@projects/SET_PROJECTS_ORDER",
    UPDATE_PROJECT_COLOR_REQUEST = "@@projects/UPDATE_PROJECT_COLOR_REQUEST",
    UPDATE_PROJECT_UNITPOINTSRANGE_REQUEST = "@@projects/UPDATE_PROJECT_UNITPOINTSRANGE_REQUEST",
    DELETE_PROJECT_REQUEST = "@@projects/DELETE_PROJECT_REQUEST",
    INSERT_OR_UPDATE_PROJECT = "@@projects/INSERT_OR_UPDATE_PROJECT",
}

export interface ICreateProjectInput {
    name: string;
    members: string[];
    color: IStandardColor;
    minUnitPoints: number;
    maxUnitPoints: number;
}

export interface ICreateProjectResult {
    id?: string;
    errors?: string;
}

export interface IUpdateProjectNameInput {
    id: string;
    name: string;
}

export interface IAddOrRemoveProjectMemberInput {
    id: string;
    memberUserID: string;
    isAdd: boolean;
}

export interface IProjectUpdateSortOrderInput {
    id: string;
    beforeProjectID: string;
    afterProjectID: string;
}

export interface IProjectUpdateColorInput {
    id: string;
    color: IStandardColor;
}

export interface IProjectUpdateUnitPointsRangeInput {
    id: string;
    minUnitPoints: number;
    maxUnitPoints: number;
}

export interface IProjectUpdateCurrentSprintInput {
    id: string;
    sprintID: string;
    stayedColumnIDs: string[];
}

export interface IProjectCommonResult {
    id?: string;
    errors?: string;
}

export interface IProject {
    id: string;
    name: string;
    memberUserIDs: string[];
    sortOrder: number;
    shortcode: string;
    color: IStandardColor;
    currentSprint: ISprint;
    minUnitPoints: number;
    maxUnitPoints: number;
}

export interface IGetProjectsResult {
    projects: IProject[];
    errors?: string;
}

export interface IProjectDeleteInput {
    id: string;
}

export interface IProjectGetResult {
    project?: IProject;
    errors?: string;
}

export interface IProjectsState {
    readonly projects: any[any];
    readonly projectOrder: string[];
    readonly projectsLoading: boolean;
    readonly defaultProjectColor: IStandardColor;
    readonly createProjectLoading: boolean;
    readonly createProjectInput: ICreateProjectInput;
    readonly createProjectResult: ICreateProjectResult;
    readonly getProjectsLoading: boolean;
    readonly getProjectsResult: IGetProjectsResult;
    readonly projectMap: IStringTMap<IProject>;
    readonly projectsOrder: string[];
    readonly updateProjectCurrentSprintLoading: boolean;
}

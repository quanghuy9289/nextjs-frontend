/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { action } from "typesafe-actions";
import {
    ISprint,
    ISprintCommonResult,
    ISprintCreateInput,
    ISprintDeleteInput,
    ISprintUpdateBeginOnInput,
    ISprintUpdateEndOnInput,
    ISprintUpdateInput,
    ISprintUpdateNameInput,
    SprintsActionTypes,
} from "./types";

export const getSprints = () => action(SprintsActionTypes.GET_SPRINTS);
export const getSprintsResult = (result: ISprint) => action(SprintsActionTypes.GET_SPRINTS_RESULT, result);
export const getSprintsError = (error: string) => action(SprintsActionTypes.GET_SPRINTS_ERROR, error);

export const createSprintSetInput = (input: ISprintCreateInput) =>
    action(SprintsActionTypes.CREATE_SPRINT_SET_INPUT, input);
export const createSprintRequest = (input: ISprintCreateInput) =>
    action(SprintsActionTypes.CREATE_SPRINT_REQUEST, input);
export const createSprintSetResult = (result: ISprintCommonResult) =>
    action(SprintsActionTypes.CREATE_SPRINT_SET_RESULT, result);

export const updateSprintSetInput = (input: ISprintUpdateInput) =>
    action(SprintsActionTypes.UPDATE_SPRINT_SET_INPUT, input);
export const updateSprintRequest = (input: ISprintUpdateInput) =>
    action(SprintsActionTypes.UPDATE_SPRINT_REQUEST, input);
export const updateSprintSetResult = (result: ISprintCommonResult) =>
    action(SprintsActionTypes.UPDATE_SPRINT_SET_RESULT, result);

export const getSprintRequest = (sprintID: string) =>
    action(SprintsActionTypes.GET_SPRINT_REQUEST, sprintID);

export const updateSprintNameRequest = (input: ISprintUpdateNameInput) =>
    action(SprintsActionTypes.UPDATE_SPRINT_NAME_REQUEST, input);

export const updateSprintBeginOnRequest = (input: ISprintUpdateBeginOnInput) =>
    action(SprintsActionTypes.UPDATE_SPRINT_BEGINON_REQUEST, input);

export const updateSprintEndOnRequest = (input: ISprintUpdateEndOnInput) =>
    action(SprintsActionTypes.UPDATE_SPRINT_ENDON_REQUEST, input);

export const deleteSprintRequest = (input: ISprintDeleteInput) =>
    action(SprintsActionTypes.DELETE_SPRINT_REQUEST, input);

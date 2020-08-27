/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IPanelProps } from "@blueprintjs/core";
import { action } from "typesafe-actions";
import { IProjectUpdateSortOrderInput } from "../projects/types";
import {
    IAddOrRemoveSprintRequirementManagerInput,
    ISprintRequirementCommonResult,
    ISprintRequirementCreateInput,
    ISprintRequirementDeleteInput,
    ISprintRequirementUpdateInput,
    ISprintRequirementUpdateMinUnitPointsInput,
    ISprintRequirementUpdateSortOrderInput,
    SprintRequirementsActionTypes,
} from "./types";

export const createSprintRequirementSetInput = (input: ISprintRequirementCreateInput) =>
    action(SprintRequirementsActionTypes.CREATE_SPRINTREQUIREMENT_SET_INPUT, input);
export const createSprintRequirementRequest = (input: ISprintRequirementCreateInput) =>
    action(SprintRequirementsActionTypes.CREATE_SPRINTREQUIREMENT_REQUEST, input);
export const createSprintRequirementSetError = (errors: string) =>
    action(SprintRequirementsActionTypes.CREATE_SPRINTREQUIREMENT_SET_ERROR, {errors});
export const createSprintRequirementSetResult = (result: ISprintRequirementCommonResult) =>
    action(SprintRequirementsActionTypes.CREATE_SPRINTREQUIREMENT_SET_RESULT, result);

export const getSprintRequirementRequest = (sprintRequirementID: string) =>
    action(SprintRequirementsActionTypes.GET_SPRINTREQUIREMENT_REQUEST, sprintRequirementID);

export const getSprintRequirementRequestBySprintAndUser = (sprintID: string, userID: string) =>
    action(SprintRequirementsActionTypes.GET_SPRINTREQUIREMENT_BY_SPRINT_AND_USER_REQUEST, {sprintID, userID});

export const updateSprintRequirementSetInput = (input: ISprintRequirementUpdateInput) =>
    action(SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_SET_INPUT, input);
export const updateSprintRequirementRequest = (input: ISprintRequirementUpdateInput) =>
    action(SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_REQUEST, input);
export const updateSprintRequirementSetError = (errors: string) =>
    action(SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_SET_ERROR, {errors});
export const updateSprintRequirementSetResult = (result: ISprintRequirementCommonResult) =>
    action(SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_SET_RESULT, result);

export const updateSprintRequirementMinUnitPointsRequest = (input: ISprintRequirementUpdateMinUnitPointsInput) =>
    action(SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_MINUNITPOINTS_REQUEST, input);

export const addOrRemoveSprintRequirementManagerRequest = (input: IAddOrRemoveSprintRequirementManagerInput) =>
    action(SprintRequirementsActionTypes.ADD_OR_REMOVE_SPRINTREQUIREMENT_MANAGER_REQUEST, input);

export const updateSprintRequirementSortOrderRequest = (input: ISprintRequirementUpdateSortOrderInput) =>
    action(SprintRequirementsActionTypes.UPDATE_SPRINTREQUIREMENT_SORT_ORDER_REQUEST, input);

export const deleteSprintRequirementRequest = (input: ISprintRequirementDeleteInput) =>
    action(SprintRequirementsActionTypes.DELETE_SPRINTREQUIREMENT_REQUEST, input);

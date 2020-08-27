/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IPanelProps } from "@blueprintjs/core";
import { action } from "typesafe-actions";
import { IProjectUpdateSortOrderInput } from "../projects/types";
import {
    IAddOrRemovePriorityManagerInput,
    IAddPriorityState,
    IEditPriorityState,
    IPriorityCommonResult,
    IPriorityCreateInput,
    IPriorityDeleteInput,
    IPriorityUpdateColorInput,
    IPriorityUpdateInput,
    IPriorityUpdateSortOrderInput,
    IPriorityUpdateTitleInput,
    PrioritiesActionTypes,
} from "./types";

// export const setAddPriorityState = (input: IAddPriorityState) =>
//     action(PrioritiesActionTypes.SET_ADD_PRIORITY_STATE, input);

export const setEditPriorityState = (input: IEditPriorityState) =>
    action(PrioritiesActionTypes.SET_EDIT_PRIORITY_STATE, input);

export const createPrioritySetInput = (input: IPriorityCreateInput) =>
    action(PrioritiesActionTypes.CREATE_PRIORITY_SET_INPUT, input);
export const createPriorityRequest = (input: IPriorityCreateInput) =>
    action(PrioritiesActionTypes.CREATE_PRIORITY_REQUEST, input);
export const createPrioritySetError = (errors: string) =>
    action(PrioritiesActionTypes.CREATE_PRIORITY_SET_ERROR, {errors});
export const createPrioritySetResult = (result: IPriorityCommonResult) =>
    action(PrioritiesActionTypes.CREATE_PRIORITY_SET_RESULT, result);

export const getPriorityRequest = (priorityID: string) =>
    action(PrioritiesActionTypes.GET_PRIORITY_REQUEST, priorityID);

export const updatePrioritySetInput = (input: IPriorityUpdateInput) =>
    action(PrioritiesActionTypes.UPDATE_PRIORITY_SET_INPUT, input);
export const updatePriorityRequest = (input: IPriorityUpdateInput) =>
    action(PrioritiesActionTypes.UPDATE_PRIORITY_REQUEST, input);
export const updatePrioritySetError = (errors: string) =>
    action(PrioritiesActionTypes.UPDATE_PRIORITY_SET_ERROR, {errors});
export const updatePrioritySetResult = (result: IPriorityCommonResult) =>
    action(PrioritiesActionTypes.UPDATE_PRIORITY_SET_RESULT, result);

export const updatePriorityTitleRequest = (input: IPriorityUpdateTitleInput) =>
    action(PrioritiesActionTypes.UPDATE_PRIORITY_TITLE_REQUEST, input);

export const updatePriorityColorRequest = (input: IPriorityUpdateColorInput) =>
    action(PrioritiesActionTypes.UPDATE_PRIORITY_COLOR_REQUEST, input);

export const addOrRemovePriorityManagerRequest = (input: IAddOrRemovePriorityManagerInput) =>
    action(PrioritiesActionTypes.ADD_OR_REMOVE_PRIORITY_MANAGER_REQUEST, input);

export const updatePrioritySortOrderRequest = (input: IPriorityUpdateSortOrderInput) =>
    action(PrioritiesActionTypes.UPDATE_PRIORITY_SORT_ORDER_REQUEST, input);

export const deletePriorityRequest = (input: IPriorityDeleteInput) =>
    action(PrioritiesActionTypes.DELETE_PRIORITY_REQUEST, input);

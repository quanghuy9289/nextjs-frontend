/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IPanelProps } from "@blueprintjs/core";
import { action } from "typesafe-actions";
import { IProjectUpdateSortOrderInput } from "../projects/types";
import {
    IAddOrRemoveUnitManagerInput,
    IAddUnitState,
    IEditUnitState,
    IUnitCommonResult,
    IUnitCompleteInput,
    IUnitCreateInput,
    IUnitDeleteInput,
    IUnitUpdateInput,
    IUnitUpdatePointsInput,
    IUnitUpdateSortOrderInput,
    IUnitUpdateTitleInput,
    UnitsActionTypes,
} from "./types";

// export const setAddUnitState = (input: IAddUnitState) =>
//     action(UnitsActionTypes.SET_ADD_UNIT_STATE, input);

export const setEditUnitState = (input: IEditUnitState) =>
    action(UnitsActionTypes.SET_EDIT_UNIT_STATE, input);

export const createUnitSetInput = (input: IUnitCreateInput) =>
    action(UnitsActionTypes.CREATE_UNIT_SET_INPUT, input);
export const createUnitRequest = (input: IUnitCreateInput) =>
    action(UnitsActionTypes.CREATE_UNIT_REQUEST, input);
export const createUnitSetError = (errors: string) =>
    action(UnitsActionTypes.CREATE_UNIT_SET_ERROR, {errors});
export const createUnitSetResult = (result: IUnitCommonResult) =>
    action(UnitsActionTypes.CREATE_UNIT_SET_RESULT, result);

export const getUnitRequest = (unitID: string) =>
    action(UnitsActionTypes.GET_UNIT_REQUEST, unitID);

export const updateUnitSetInput = (input: IUnitUpdateInput) =>
    action(UnitsActionTypes.UPDATE_UNIT_SET_INPUT, input);
export const updateUnitRequest = (input: IUnitUpdateInput) =>
    action(UnitsActionTypes.UPDATE_UNIT_REQUEST, input);
export const updateUnitSetError = (errors: string) =>
    action(UnitsActionTypes.UPDATE_UNIT_SET_ERROR, {errors});
export const updateUnitSetResult = (result: IUnitCommonResult) =>
    action(UnitsActionTypes.UPDATE_UNIT_SET_RESULT, result);

export const updateUnitTitleRequest = (input: IUnitUpdateTitleInput) =>
    action(UnitsActionTypes.UPDATE_UNIT_TITLE_REQUEST, input);

export const updateUnitPointsRequest = (input: IUnitUpdatePointsInput) =>
    action(UnitsActionTypes.UPDATE_UNIT_POINTS_REQUEST, input);

export const addOrRemoveUnitManagerRequest = (input: IAddOrRemoveUnitManagerInput) =>
    action(UnitsActionTypes.ADD_OR_REMOVE_UNIT_MANAGER_REQUEST, input);

export const updateUnitSortOrderRequest = (input: IUnitUpdateSortOrderInput) =>
    action(UnitsActionTypes.UPDATE_UNIT_SORT_ORDER_REQUEST, input);

export const deleteUnitRequest = (input: IUnitDeleteInput) =>
    action(UnitsActionTypes.DELETE_UNIT_REQUEST, input);

export const completeUnitSetInput = (input: IUnitCompleteInput) =>
    action(UnitsActionTypes.COMPLETE_UNIT_SET_INPUT, input);
export const completeUnitRequest = (input: IUnitCompleteInput) =>
    action(UnitsActionTypes.COMPLETE_UNIT_REQUEST, input);
export const completeUnitSetResult = (result: IUnitCommonResult) =>
    action(UnitsActionTypes.COMPLETE_UNIT_SET_RESULT, result);

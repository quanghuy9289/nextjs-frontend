/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IPanelProps } from "@blueprintjs/core";
import { action } from "typesafe-actions";
import { IProjectUpdateSortOrderInput } from "../projects/types";
import {
    ColumnsActionTypes,
    IAddColumnState,
    IAddOrRemoveColumnManagerInput,
    IColumnCollapseInput,
    IColumnCommonResult,
    IColumnCreateInput,
    IColumnDeleteInput,
    IColumnUpdateInput,
    IColumnUpdateSortOrderInput,
    IColumnUpdateTitleInput,
    IEditColumnState,
} from "./types";

// export const setAddColumnState = (input: IAddColumnState) =>
//     action(ColumnsActionTypes.SET_ADD_COLUMN_STATE, input);

export const setEditColumnState = (input: IEditColumnState) =>
    action(ColumnsActionTypes.SET_EDIT_COLUMN_STATE, input);

export const createColumnSetInput = (input: IColumnCreateInput) =>
    action(ColumnsActionTypes.CREATE_COLUMN_SET_INPUT, input);
export const createColumnRequest = (input: IColumnCreateInput) =>
    action(ColumnsActionTypes.CREATE_COLUMN_REQUEST, input);
export const createColumnSetError = (errors: string) =>
    action(ColumnsActionTypes.CREATE_COLUMN_SET_ERROR, {errors});
export const createColumnSetResult = (result: IColumnCommonResult) =>
    action(ColumnsActionTypes.CREATE_COLUMN_SET_RESULT, result);

export const getColumnRequest = (columnID: string) =>
    action(ColumnsActionTypes.GET_COLUMN_REQUEST, columnID);

export const updateColumnSetInput = (input: IColumnUpdateInput) =>
    action(ColumnsActionTypes.UPDATE_COLUMN_SET_INPUT, input);
export const updateColumnRequest = (input: IColumnUpdateInput) =>
    action(ColumnsActionTypes.UPDATE_COLUMN_REQUEST, input);
export const updateColumnSetError = (errors: string) =>
    action(ColumnsActionTypes.UPDATE_COLUMN_SET_ERROR, {errors});
export const updateColumnSetResult = (result: IColumnCommonResult) =>
    action(ColumnsActionTypes.UPDATE_COLUMN_SET_RESULT, result);

export const updateColumnTitleRequest = (input: IColumnUpdateTitleInput) =>
    action(ColumnsActionTypes.UPDATE_COLUMN_TITLE_REQUEST, input);

export const addOrRemoveColumnManagerRequest = (input: IAddOrRemoveColumnManagerInput) =>
    action(ColumnsActionTypes.ADD_OR_REMOVE_COLUMN_MANAGER_REQUEST, input);

export const updateColumnSortOrderRequest = (input: IColumnUpdateSortOrderInput) =>
    action(ColumnsActionTypes.UPDATE_COLUMN_SORT_ORDER_REQUEST, input);

export const deleteColumnRequest = (input: IColumnDeleteInput) =>
    action(ColumnsActionTypes.DELETE_COLUMN_REQUEST, input);

export const collapseColumnRequest = (input: IColumnCollapseInput) =>
    action(ColumnsActionTypes.COLLAPSE_COLUMN_REQUEST, input);

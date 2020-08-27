/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import priority from "../../components/priority";

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum ColumnsActionTypes {
    SET_ADD_COLUMN_STATE = "@@columns/SET_ADD_COLUMN_STATE",
    SET_EDIT_COLUMN_STATE = "@@columns/SET_EDIT_COLUMN_STATE",
    CREATE_COLUMN_SET_INPUT = "@@columns/CREATE_COLUMN_SET_INPUT",
    CREATE_COLUMN_REQUEST = "@@columns/CREATE_COLUMN_REQUEST",
    CREATE_COLUMN_SET_ERROR = "@@columns/CREATE_COLUMN_SET_ERROR",
    CREATE_COLUMN_SET_RESULT = "@@columns/CREATE_COLUMN_SET_RESULT",
    GET_COLUMN_REQUEST = "@@board/GET_COLUMN_REQUEST",
    UPDATE_COLUMN_SET_INPUT = "@@columns/UPDATE_COLUMN_SET_INPUT",
    UPDATE_COLUMN_REQUEST = "@@columns/UPDATE_COLUMN_REQUEST",
    UPDATE_COLUMN_SET_ERROR = "@@columns/UPDATE_COLUMN_SET_ERROR",
    UPDATE_COLUMN_SET_RESULT = "@@columns/UPDATE_COLUMN_SET_RESULT",
    UPDATE_COLUMN_TITLE_REQUEST =  "@@columns/UPDATE_COLUMN_TITLE_REQUEST",
    ADD_OR_REMOVE_COLUMN_MANAGER_REQUEST = "@@columns/ADD_OR_REMOVE_COLUMN_MANAGER_REQUEST",
    UPDATE_COLUMN_SORT_ORDER_REQUEST = "@@columns/UPDATE_COLUMN_SORT_ORDER_REQUEST",
    COLLAPSE_COLUMN_REQUEST = "@@columns/COLLAPSE_COLUMN_REQUEST",
    DELETE_COLUMN_REQUEST = "@@columns/DELETE_COLUMN_REQUEST",
}

export interface IAddColumnState {
    column: IColumn;
}

export interface IEditColumnState {
    column: IColumn;
}

export interface IColumnCreateInput {
    title: string;
    managers: string[];
    projectID: string;
}

export interface IColumnUpdateInput {
    id: string;
    title: string;
    managers: string[];
    projectID: string;
    taskIDs: string[];
}

export interface IColumnCommonResult {
    id?: string;
    errors?: string;
}

export interface IColumnGetResult {
    column?: IColumn;
    errors?: string;
}

export interface IColumnUpdateTitleInput {
    id: string;
    title: string;
}

export interface IAddOrRemoveColumnManagerInput {
    id: string;
    managerUserID: string;
    isAdd: boolean;
}

export interface IColumnUpdateSortOrderInput {
    id: string;
    beforeColumnID: string;
    afterColumnID: string;
}

export interface IColumnCollapseInput {
    id: string;
    collapsed: boolean;
}

export interface IColumnDeleteInput {
    id: string;
}

export interface IColumn {
    id: string;
    title: string;
    taskIDs: string[];
    managers: string[];
}

export interface IColumnsState {
    readonly addColumnState: IAddColumnState;
    readonly editColumnState: IEditColumnState;
    readonly createColumnLoading: boolean;
    readonly createColumnInput: IColumnCreateInput;
    readonly createColumnResult: IColumnCommonResult;
    readonly updateColumnLoading: boolean;
    readonly updateColumnInput: IColumnUpdateInput;
    readonly updateColumnResult: IColumnCommonResult;
}

/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Cookies } from "react-cookie";

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.

export interface IRole {
    id: string;
    name: string;
}

export interface IRoleResult {
    roles: IRole[];
    errors?: string;
}

export enum RolesActionTypes {
    GET_ROLES = "@@roles/GET_ROLES",
    GET_ROLES_RESULT = "@@roles/GET_ROLES_RESULT",
    GET_ROLES_ERROR = "@@roles/GET_ROLES_ERROR",
}

export interface IRolesState {
    readonly loading: boolean;
    readonly result: IRoleResult;
    readonly loaded: boolean;
}

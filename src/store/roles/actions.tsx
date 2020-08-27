/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { action } from "typesafe-actions";
import {
    IRole,
    RolesActionTypes,
} from "./types";

export const getRoles = () => action(RolesActionTypes.GET_ROLES);
export const getRolesResult = (result: IRole) => action(RolesActionTypes.GET_ROLES_RESULT, result);
export const getRolesError = (error: string) => action(RolesActionTypes.GET_ROLES_ERROR, error);

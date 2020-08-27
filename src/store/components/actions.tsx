/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { action } from "typesafe-actions";
import { IStringTMap } from "../../utils/types";
import {
    ComponentsActionTypes,
    IComponentUserImageState,
} from "./types";

export const addUserImageState = (componentID: string, userImageState: IComponentUserImageState) =>
    action(ComponentsActionTypes.ADD_USER_IMAGE_STATE, { componentID, userImageState });

export const setUserImageState = (componentID: string, userImageState: IComponentUserImageState) =>
    action(ComponentsActionTypes.SET_USER_IMAGE_STATE, { componentID, userImageState });

export const removeUserImageState = (componentID: string) =>
    action(ComponentsActionTypes.REMOVE_USER_IMAGE_STATE, componentID);

/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import priority from "../../components/priority";
import { IStringTMap } from "../../utils/types";

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum ComponentsActionTypes {
    ADD_USER_IMAGE_STATE = "@@components/ADD_USER_IMAGE_STATE", // Why need add and set ? Add allow to add
                                                                // (should put in constructor of the component)
    SET_USER_IMAGE_STATE = "@@components/SET_USER_IMAGE_STATE", // Set is only allow to update
                                                                // but not add new component's state
    REMOVE_USER_IMAGE_STATE = "@@components/REMOVE_USER_IMAGE_STATE",
}

export interface IComponentUserImageState {
    isContextMenuOpen: boolean;
    imgURL?: string;
}

export interface IComponentsState {
    readonly userImagesMap: IStringTMap<IComponentUserImageState>;
}

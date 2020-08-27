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
export enum ColorsActionTypes {

}

export interface IStandardColor {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

export interface IStandardColorGroup {
    name: string;
    colors: IStandardColor[];
}

export interface IColorsState {
    colorgroups: IStandardColorGroup[];
}

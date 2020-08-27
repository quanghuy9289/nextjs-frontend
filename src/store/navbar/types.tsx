/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum NavbarActionTypes {
    ENABLE_DARK_THEME = "@@navbar/ENABLE_DARK_THEME",
    SHOW_DRAWER = "@@navbar/SHOW_DRAWER",
    CHANGE_TITLE = "@@navbar/CHANGE_TITLE",
    CHANGE_BOARD_TITLE = "@@navbar/CHANGE_BOARD_TITLE",
    // SELECT_TEAM = '@@teams/SELECT_TEAM',
    // SELECTED = '@@teams/SELECTED',
    // CLEAR_SELECTED = '@@teams/CLEAR_SELECTED'
}

export interface INavbarState {
    isUsingDarkTheme: boolean;
    isShowingDrawer: boolean;
    title?: string;
    boardTitle?: string;
}

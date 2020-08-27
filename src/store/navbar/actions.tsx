/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IPanelProps } from "@blueprintjs/core";
import { action } from "typesafe-actions";
import {
    NavbarActionTypes,
} from "./types";

// export const pushNavBarPath = (title:string, activePanel:IPanelProps) => ({
//     type: PUSH_NAVBAR_PATH,
//     payload: {
//         title,
//         activePanel
//     }
// });

// export const popNavBarPath = () => ({
//     type: POP_NAVBAR_PATH,
//     payload: null
// });

// export const enableDarkTheme = (enableDarkTheme:boolean) => ({
//     type: ENABLE_DARK_THEME,
//     payload: enableDarkTheme
// });

export const enableDarkTheme = (enableDarkThemeVal: boolean) =>
    action(NavbarActionTypes.ENABLE_DARK_THEME, enableDarkThemeVal);
export const showDrawer = (show: boolean) =>
    action(NavbarActionTypes.SHOW_DRAWER, show);
export const changeTitle = (title: string) => action(NavbarActionTypes.CHANGE_TITLE, title);
export const changeBoardTitle = (title: string) => action(NavbarActionTypes.CHANGE_BOARD_TITLE, title);

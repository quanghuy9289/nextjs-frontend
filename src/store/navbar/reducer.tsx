/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import { enableDarkTheme, showDrawer } from "./actions";
import {INavbarState, NavbarActionTypes} from "./types";

const initialState: INavbarState = {
    isUsingDarkTheme: false,
    isShowingDrawer: false,
    title: "TASK RIPPLE",
};

const reducer: Reducer<INavbarState> = (state = initialState, action) => {
    switch (action.type) {
        case NavbarActionTypes.ENABLE_DARK_THEME: {
            const actionData: ReturnType<typeof enableDarkTheme> = {
                payload : action.payload,
                type: NavbarActionTypes.ENABLE_DARK_THEME,
            };
            // if (actionData.payload) {
            //     document.body.classList.add("bp3-dark");
            // } else {
            //     document.body.classList.remove("bp3-dark");
            // }
            return {
                ...state,
                isUsingDarkTheme: actionData.payload,
            };
        }
        case NavbarActionTypes.SHOW_DRAWER: {
            const actionData: ReturnType<typeof showDrawer> = {
                payload : action.payload,
                type: NavbarActionTypes.SHOW_DRAWER,
            };
            return {
                ...state,
                isShowingDrawer: actionData.payload,
            };
        }
        case NavbarActionTypes.CHANGE_TITLE:
            return {
                ...state,
                title: action.payload,
            };
        case NavbarActionTypes.CHANGE_BOARD_TITLE:
            return {
                ...state,
                boardTitle: action.payload,
            };
        default:
            return state;
    }
};

export { reducer as navbarReducer };

/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import {CookiesActionTypes, ICookiesState} from "./types";

const initialState: ICookiesState = {
    cookies: undefined,
    hasCookies: false,
};

const reducer: Reducer<ICookiesState> = (state = initialState, action) => {
    switch (action.type) {
        case CookiesActionTypes.SET_COOKIES_SHARED_OBJECT:
            return {
                ...state,
                cookies: action.payload,
                hasCookies: true,
            };
        default:
            return state;
    }
};

export { reducer as cookiesReducer };

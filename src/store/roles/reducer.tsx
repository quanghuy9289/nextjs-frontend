/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Cookies } from "react-cookie";
import { Reducer } from "redux";
import {IRolesState, RolesActionTypes} from "./types";

const initialState: IRolesState = {
    loading: false,
    loaded: false,
    result: {
        errors: undefined,
        roles: [],
    },
};

const reducer: Reducer<IRolesState> = (state = initialState, action) => {
    switch (action.type) {
        case RolesActionTypes.GET_ROLES:
            return {
                ...state,
                loading: true,
            };
        case RolesActionTypes.GET_ROLES_RESULT: {
            return {
                ...state,
                loading: false,
                loaded: true,
                result: action.payload,
            };
        }
        case RolesActionTypes.GET_ROLES_ERROR: {
            return {
                ...state,
                loading: false,
                loaded: false,
                result: action.payload,
            };
        }
        default: {
            return state;
        }
    }
};

export { reducer as rolesReducer };

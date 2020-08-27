/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import { CONST_DEFAULT_COMPONENT_ID } from "../../utils/constants";
import {ComponentsActionTypes, IComponentsState} from "./types";

const initialState: IComponentsState = {
    userImagesMap: {
        [CONST_DEFAULT_COMPONENT_ID] : {
            imgURL: undefined,
            isContextMenuOpen: false,
        },
    },
};

const reducer: Reducer<IComponentsState> = (state = initialState, action) => {
    switch (action.type) {
        case ComponentsActionTypes.ADD_USER_IMAGE_STATE:
            return {
                ...state,
                userImagesMap: {
                    ...state.userImagesMap,
                    [action.payload.componentID] : action.payload.userImageState,
                },
            };
        case ComponentsActionTypes.SET_USER_IMAGE_STATE:
            if (state.userImagesMap[action.payload.componentID] !== undefined) {
                return {
                    ...state,
                    userImagesMap: {
                        ...state.userImagesMap,
                        [action.payload.componentID] : action.payload.userImageState,
                    },
                };
            }
        case ComponentsActionTypes.REMOVE_USER_IMAGE_STATE:
            return {
                ...state,
                userImagesMap: _.omit({...state.userImagesMap}, [action.payload]),
            };
        default:
            return state;
    }
};

export { reducer as componentsReducer };

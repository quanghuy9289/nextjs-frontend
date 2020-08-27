/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { Reducer } from "redux";
import {ColorsActionTypes, IColorsState, IStandardColor, IStandardColorGroup} from "./types";

const initialState: IColorsState = {
    colorgroups: [
        {
            name: "Default",
            colors: [
                {red: 255, green: 199, blue: 234, alpha: 1},
                {red: 255, green: 239, blue: 151, alpha: 1},
                {red: 230, green: 230, blue: 230, alpha: 1},
                {red: 230, green: 247, blue: 204, alpha: 1},
                {red: 230, green: 0, blue: 0, alpha: 1},
            ],
        },
        {
            name: "Group 1",
            colors: [
                {red: 255, green: 201, blue: 64, alpha: 1}, // rgb(255, 201, 64)
                {red: 233, green: 161, blue: 51, alpha: 1}, // rgb(233, 161, 51)
                {red: 210, green: 123, blue: 39, alpha: 1}, // rgb(210, 123, 39)
                {red: 185, green: 84, blue: 26, alpha: 1}, // rgb(185, 84, 26)
                {red: 158, green: 43, blue: 14, alpha: 1}, // rgb(158, 43, 14)
            ],
        },
        {
            name: "Group 2",
            colors: [
                {red: 255, green: 227, blue: 159, alpha: 1}, // rgb(255, 227, 159)
                {red: 238, green: 180, blue: 108, alpha: 1}, // rgb(238, 180, 108)
                {red: 215, green: 135, blue: 66, alpha: 1}, // rgb(215, 135, 66)
                {red: 188, green: 91, blue: 34, alpha: 1}, // rgb(188, 91, 34)
                {red: 158, green: 43, blue: 14, alpha: 1}, // rgb(158, 43, 14)
            ],
        },
        {
            name: "Group 3",
            colors: [
                {red: 255, green: 238, blue: 197, alpha: 1}, // rgb(255, 238, 197)
                {red: 241, green: 174, blue: 164, alpha: 1}, // rgb(241, 174, 164)
                {red: 211, green: 115, blue: 135, alpha: 1}, // rgb(211, 115, 135)
                {red: 163, green: 65, blue: 110, alpha: 1}, // rgb(163, 65, 110)
                {red: 92, green: 37, blue: 92, alpha: 1}, // rgb(92, 37, 92)
            ],
        },
        {
            name: "Group 4",
            colors: [
                {red: 255, green: 227, blue: 159, alpha: 1}, // rgb(255, 227, 159)
                {red: 171, green: 196, blue: 162, alpha: 1}, // rgb(171, 196, 162)
                {red: 107, green: 159, blue: 161, alpha: 1}, // rgb(107, 159, 161)
                {red: 62, green: 118, blue: 158, alpha: 1}, // rgb(62, 118, 158)
                {red: 31, green: 75, blue: 153, alpha: 1}, // rgb(31, 75, 153)
            ],
        },
        {
            name: "Group 5",
            colors: [
                {red: 207, green: 243, blue: 210, alpha: 1}, // rgb(207, 243, 210)
                {red: 139, green: 205, blue: 188, alpha: 1}, // rgb(139, 205, 188)
                {red: 89, green: 163, blue: 172, alpha: 1}, // rgb(89, 163, 172)
                {red: 56, green: 120, blue: 161, alpha: 1}, // rgb(56, 120, 161)
                {red: 31, green: 75, blue: 153, alpha: 1}, // rgb(31, 75, 153)
            ],
        },
        {
            name: "Group 6",
            colors: [
                {red: 255, green: 227, blue: 159, alpha: 1}, // rgb(255, 227, 159)
                {red: 178, green: 203, blue: 154, alpha: 1}, // rgb(178, 203, 154)
                {red: 111, green: 176, blue: 132, alpha: 1}, // rgb(111, 176, 132)
                {red: 59, green: 146, blue: 93, alpha: 1}, // rgb(59, 146, 93)
                {red: 29, green: 115, blue: 36, alpha: 1}, // rgb(29, 115, 36)
            ],
        },
        {
            name: "Group 7",
            colors: [
                {red: 232, green: 248, blue: 182, alpha: 1}, // rgb(232, 248, 182)
                {red: 164, green: 216, blue: 168, alpha: 1}, // rgb(164, 216, 168)
                {red: 104, green: 183, blue: 140, alpha: 1}, // rgb(104, 183, 140)
                {red: 57, green: 149, blue: 97, alpha: 1}, // rgb(57, 149, 97)
                {red: 29, green: 115, blue: 36, alpha: 1}, // rgb(29, 115, 36)
            ],
        },
        {
            name: "Group 8",
            colors: [
                {red: 209, green: 225, blue: 255, alpha: 1}, // rgb(209, 225, 255)
                {red: 180, green: 180, blue: 242, alpha: 1}, // rgb(180, 180, 242)
                {red: 145, green: 138, blue: 223, alpha: 1}, // rgb(145, 138, 223)
                {red: 101, green: 101, blue: 197, alpha: 1}, // rgb(101, 101, 197)
                {red: 31, green: 75, blue: 153, alpha: 1}, // rgb(31, 75, 153)
            ],
        },
        {
            name: "Group 9",
            colors: [
                {red: 209, green: 225, blue: 255, alpha: 1}, // rgb(209, 225, 255)
                {red: 178, green: 173, blue: 237, alpha: 1}, // rgb(178, 173, 237)
                {red: 146, green: 124, blue: 207, alpha: 1}, // rgb(146, 124, 207)
                {red: 118, green: 78, blue: 162, alpha: 1}, // rgb(118, 78, 162)
                {red: 92, green: 37, blue: 92, alpha: 1}, // rgb(92, 37, 92)
            ],
        },
        {
            name: "Group 10",
            colors: [
                {red: 225, green: 186, blue: 225, alpha: 1}, // rgb(225, 186, 225)
                {red: 221, green: 134, blue: 175, alpha: 1}, // rgb(221, 134, 175)
                {red: 195, green: 89, blue: 137, alpha: 1}, // rgb(195, 89, 137)
                {red: 152, green: 54, blue: 109, alpha: 1}, // rgb(152, 54, 109)
                {red: 92, green: 37, blue: 92, alpha: 1}, // rgb(92, 37, 92)
            ],
        },
    ],
};

const reducer: Reducer<IColorsState> = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export { reducer as colorsReducer };

/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Cookies } from "react-cookie";
import { action } from "typesafe-actions";
import {
    CookiesActionTypes,
} from "./types";

export const setCookiesSharedObject = (cookies: Cookies) =>
    action(CookiesActionTypes.SET_COOKIES_SHARED_OBJECT, cookies);

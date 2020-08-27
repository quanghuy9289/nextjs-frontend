/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Cookies } from "react-cookie";
import priority from "../../components/priority";

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum CookiesActionTypes {
    SET_COOKIES_SHARED_OBJECT = "@@cookies/SET_COOKIES_SHARED_OBJECT",
}

export interface ICookiesState {
    cookies?: Cookies;
    hasCookies: boolean;
}

/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    ContentState,
    convertFromRaw,
    convertToRaw,
} from "draft-js";
import _ from "lodash";
import { IUser } from "../store/users/types";

export function stringToBoolean(value) {
    switch (value) {
         case true:
         case "true":
         case 1:
         case "1":
         case "on":
         case "yes":
             return true;
         default:
             return false;
     }
 }

export function isUndefinedOrEmpty(stringValue?: string) {
     return _.isUndefined(stringValue) || _.isEmpty(stringValue);
}

export function generateUUID() { // Public Domain/MIT
    let d = new Date().getTime();
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
        d += performance.now(); // use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function getUserPresentationName(user: IUser | undefined) {
    if (user !== undefined) {
        return `${user.fullname} (${user.nickname})`;
    }
    return "...";
}

export function getHostAndProtocol() {
    // const url = window.location.href;
    // const arr = url.split("/")
    // Credit: https://stackoverflow.com/questions/6941533/get-protocol-domain-and-port-from-url
    const hostAndProtocol = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
    return hostAndProtocol;
}

// Credit: https://stackoverflow.com/questions/38923376/return-a-new-string-that-sorts-between-two-given-strings
export function generateMidString(prev: string, next: string) {
    let p: number = 0;
    let n: number = 0;
    let pos: number;
    let str: string;
    for (pos = 0; p === n; pos++) {               // find leftmost non-matching character
        p = pos < prev.length ? prev.charCodeAt(pos) : 96;
        n = pos < next.length ? next.charCodeAt(pos) : 123;
    }
    str = prev.slice(0, pos - 1);                // copy identical part of string
    if (p === 96) {                               // prev string equals beginning of next
        while (n === 97) {                        // next character is 'a'
            n = pos < next.length ? next.charCodeAt(pos++) : 123;  // get char from next
            str += "a";                          // insert an 'a' to match the 'a'
        }
        if (n === 98) {                           // next character is 'b'
            str += "a";                          // insert an 'a' to match the 'b'
            n = 123;                             // set to end of alphabet
        }
    } else if (p + 1 === n) {                       // found consecutive characters
        str += String.fromCharCode(p);           // insert character from prev
        n = 123;                                 // set to end of alphabet
        while (true) {  // p='z'
            const charCode: number = (p = pos < prev.length ? prev.charCodeAt(pos++) : 96);
            if (charCode !== 122) { break; }
            str += "z"; // insert 'z' to match 'z';
        }
    }
    if (str.localeCompare(prev) > 0 && str.localeCompare(next) === 0) {
        if (str.length - 1 > 0) {
            return str.slice(0, str.length - 1);
        }
    }
    return str + String.fromCharCode(Math.ceil((p + n) / 2)); // append middle character
}

export function combineIDs(sprintID: string, userID: string) {
    return `${sprintID}/${userID}`;
}

export function getDraftJSEditorJSONStringFromText(text: string) {
    return JSON.stringify(
        convertToRaw(
            ContentState.createFromText(text),
        ),
    );
}

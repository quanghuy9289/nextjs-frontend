/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { IUser } from "../store/users/types";

// Credit: https://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date
export function getDateFromUTCEpoch(utcSeconds: number) {
    const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utcSeconds);
    return d;
}

export function getEpochSecondsOfDate(d: Date) {
    return Math.round(d.getTime() / 1000);
}

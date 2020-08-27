/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { action } from "typesafe-actions";
import { ITeam, ITeamSelectedPayload, TeamsActionTypes } from "./types";

// Here we use the `action` helper function provided by `typesafe-actions`.
// This library provides really useful helpers for writing Redux actions in a type-safe manner.
// For more info: https://github.com/piotrwitek/typesafe-actions
export const fetchRequest = () => action(TeamsActionTypes.FETCH_REQUEST);
export const clearSelected = () => action(TeamsActionTypes.CLEAR_SELECTED);

// Remember, you can also pass parameters into an action creator. Make sure to
// type them properly as well.
export const fetchSuccess = (data: ITeam[]) => action(TeamsActionTypes.FETCH_SUCCESS, data);
export const fetchError = (message: string) => action(TeamsActionTypes.FETCH_ERROR, message);
export const selectTeam = (teamId: string) => action(TeamsActionTypes.SELECT_TEAM, teamId);
export const teamSelected = (team: ITeamSelectedPayload) => action(TeamsActionTypes.SELECTED, team);

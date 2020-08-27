/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { action } from "typesafe-actions";
import {
    DialogsActionTypes,
} from "./types";

export const openLoginDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_LOGIN_DIALOG, isOpen);
export const openRegisterDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_REGISTER_DIALOG, isOpen);
export const openAddTaskDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_ADD_TASK_DIALOG, isOpen);
export const openEditTaskDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_EDIT_TASK_DIALOG, isOpen);
export const openEditColumnTitleDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_EDIT_COLUMN_TITLE_DIALOG, isOpen);
export const openAddColumnDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_ADD_COLUMN_DIALOG, isOpen);
export const openEditColumnDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_EDIT_COLUMN_DIALOG, isOpen);
export const openAddPriorityDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_ADD_PRIORITY_DIALOG, isOpen);
export const openEditPriorityDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_EDIT_PRIORITY_DIALOG, isOpen);
export const openCreateProjectDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_CREATE_PROJECT_DIALOG, isOpen);
export const openAddSprintDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_ADD_SPRINT_DIALOG, isOpen);
export const openEditSprintDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_EDIT_SPRINT_DIALOG, isOpen);
export const openSprintRequirementDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_SPRINT_REQUIREMENT_DIALOG, isOpen);
export const openSprintMoveToDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_SPRINT_MOVE_TO_DIALOG, isOpen);
export const openEmployeePerformanceReviewDialog = (isOpen: boolean) =>
    action(DialogsActionTypes.OPEN_EMPLOYEE_PERFORMANCE_REVIEW_DIALOG, isOpen);

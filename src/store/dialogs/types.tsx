/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// Use `const enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum DialogsActionTypes {
    OPEN_LOGIN_DIALOG = "@@dialogs/OPEN_LOGIN_DIALOG",
    OPEN_REGISTER_DIALOG = "@@dialogs/OPEN_REGISTER_DIALOG",
    OPEN_ADD_TASK_DIALOG = "@@dialogs/OPEN_ADD_TASK_DIALOG",
    OPEN_EDIT_TASK_DIALOG = "@@dialogs/OPEN_EDIT_TASK_DIALOG",
    OPEN_EDIT_COLUMN_TITLE_DIALOG = "@@dialogs/OPEN_EDIT_COLUMN_TITLE_DIALOG",
    OPEN_ADD_COLUMN_DIALOG = "@@dialogs/OPEN_ADD_COLUMN_DIALOG",
    OPEN_EDIT_COLUMN_DIALOG = "@@dialogs/OPEN_EDIT_COLUMN_DIALOG",
    OPEN_ADD_PRIORITY_DIALOG = "@@dialogs/OPEN_ADD_PRIORITY_DIALOG",
    OPEN_EDIT_PRIORITY_DIALOG = "@@dialogs/OPEN_EDIT_PRIORITY_DIALOG",
    OPEN_CREATE_PROJECT_DIALOG = "@@dialogs/OPEN_CREATE_PROJECT_DIALOG",
    OPEN_ADD_SPRINT_DIALOG = "@@dialogs/OPEN_ADD_SPRINT_DIALOG",
    OPEN_EDIT_SPRINT_DIALOG = "@@dialogs/OPEN_EDIT_SPRINT_DIALOG",
    OPEN_SPRINT_REQUIREMENT_DIALOG = "@@dialogs/OPEN_SPRINT_REQUIREMENT_DIALOG",
    OPEN_SPRINT_MOVE_TO_DIALOG = "@@dialogs/OPEN_SPRINT_MOVE_TO_DIALOG",
    OPEN_EMPLOYEE_PERFORMANCE_REVIEW_DIALOG = "@@dialogs/OPEN_EMPLOYEE_PERFORMANCE_REVIEW_DIALOG",
}

export interface IDialogsState {
    isOpenLoginDialog: boolean;
    isOpenRegisterDialog: boolean;
    isOpenAddTaskDialog: boolean;
    isOpenEditTaskDialog: boolean;
    isOpenEditColumnTitleDialog: boolean;
    isOpenAddColumnDialog: boolean;
    isOpenEditColumnDialog: boolean;
    isOpenAddPriorityDialog: boolean;
    isOpenEditPriorityDialog: boolean;
    isOpenCreateProjectDialog: boolean;
    isOpenAddSprintDialog: boolean;
    isOpenEditSprintDialog: boolean;
    isOpenSprintRequirementDialog: boolean;
    isOpenSprintMoveToDialog: boolean;
    isOpenEmployeePerformanceReviewDialog: boolean;
}

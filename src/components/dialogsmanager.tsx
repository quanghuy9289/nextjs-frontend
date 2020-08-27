/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// tslint:disable max-classes-per-file

import classNames from "classnames";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";

import {
    Button,
    Classes,
    ContextMenu,
    ContextMenuTarget,
    Dialog,
    InputGroup,
    Intent,
    Menu,
    MenuDivider,
    MenuItem,
    Position,
    Spinner,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState } from "../store";
import { IAddColumnState, IEditColumnState } from "../store/columns/types";
import * as dialogsActions from "../store/dialogs/actions";
import * as loginsActions from "../store/logins/actions";
import { ILoginInput, ILoginResult } from "../store/logins/types";
import { IAddPriorityState, IEditPriorityState } from "../store/priorities/types";
import * as tasksActions from "../store/tasks/actions";
import { isUndefinedOrEmpty } from "../utils/strings";
import ColumnDetailDialog from "./board/column-detail-dialog";
import PriorityDetailDialog from "./board/priority-detail-dialog";
import SprintDetailDialog from "./board/sprint-detail-dialog";
import TaskDetailDialog from "./board/task-detail-dialog";
import PriorityDetailPanel from "./prioritydetailpanel";
import CreateProjectDialog from "./projects/project-detail-dialog";
import SprintMoveToDialog from "./sprints/sprint-move-to-dialog";
import SprintRequirementDialog from "./sprints/sprint-requirement-dialog";
import TaskDetailPanel from "./taskdetailpanel";
import UserLoginDialog from "./userlogindialog";
import UserLoginPanel from "./userloginpanel";
import UserRegisterDialog from "./userregisterdialog";
import EmployeePerformanceReviewDialog from "./users/employee-performance-review-dialog";

const Container = styled.div`
`;

interface IDialogsManagerState {

}

interface IPropsFromState {
    isOpenLoginDialog: boolean;
    isLoginLoading: boolean;
    loginInput: ILoginInput;
    loginResult: ILoginResult;
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
    addColumnState: IAddColumnState;
    editColumnState: IEditColumnState;
    addPriorityState: IAddPriorityState;
    editPriorityState: IEditPriorityState;
}

interface IPropsFromDispatch {
    openLoginDialog: typeof dialogsActions.openLoginDialog;
    openRegisterDialog: typeof dialogsActions.openRegisterDialog;
    openAddTaskDialog: typeof dialogsActions.openAddTaskDialog;
    openEditTaskDialog: typeof dialogsActions.openEditTaskDialog;
    openEditColumnTitleDialog: typeof dialogsActions.openEditColumnTitleDialog;
    openAddColumnDialog: typeof dialogsActions.openAddColumnDialog;
    openEditColumnDialog: typeof dialogsActions.openEditColumnDialog;
    openAddPriorityDialog: typeof dialogsActions.openAddPriorityDialog;
    openEditPriorityDialog: typeof dialogsActions.openEditPriorityDialog;
    openSprintRequirementDialog: typeof dialogsActions.openSprintRequirementDialog;
    openEmployeePerformanceReviewDialog: typeof dialogsActions.openEmployeePerformanceReviewDialog;
    loginRequest: typeof loginsActions.loginRequest;
}

interface IOwnProps {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

/**
 * This component uses the imperative ContextMenu API.
 */
class DialogsManager extends React.PureComponent<AllProps, IDialogsManagerState> {
    public state = {

    };

    public render() {
        const spinner = (
            <Spinner
                size={12}
            />
        );
        return (
            <Container>
                {/*Login dialog*/}
                <UserLoginDialog
                    isOpen={
                        !this.props.isOpenRegisterDialog && // Only show when register dialog is hidden
                        (
                            // If open login dialog flag is ON, the auth token need to be unset
                            (this.props.isOpenLoginDialog && isUndefinedOrEmpty(this.props.loginResult.authtoken)) ||
                            // If the auth token is unset, always show
                            isUndefinedOrEmpty(this.props.loginResult.authtoken)
                        )
                    }
                    // isOpen={ // DEVELOPMENT_ONLY
                    //     (!this.props.isOpenRegisterDialog && // Only show when register dialog is hidden
                    //     this.props.isOpenLoginDialog) ||
                    //     isUndefinedOrEmpty(this.props.loginResult.authtoken) ||
                    //     !isUndefinedOrEmpty(this.props.loginResult.authtoken)
                    // }
                />
                {/*Register dialog*/}
                <UserRegisterDialog
                    isOpen={this.props.isOpenRegisterDialog && !this.props.isOpenLoginDialog}
                />
                {/*Create project dialog*/}
                <CreateProjectDialog
                    isOpen={this.props.isOpenCreateProjectDialog}
                />
                {/* Add new task dialog */}
                <TaskDetailDialog
                    title="Add task"
                    isOpen={this.props.isOpenAddTaskDialog}
                    isAdd={true}
                />
                {/* <Dialog
                    icon={IconNames.INFO_SIGN}
                    onClose={this.handleCloseAddNewTaskDialog}
                    title="Add new task"
                    isOpen={this.props.isOpenAddTaskDialog}
                    style={{
                        width: "80%",
                    }}
                >
                    <div className={Classes.DIALOG_BODY}>
                        <TaskDetailPanel
                            columnID={this.props.addNewTaskState.columnID}
                            priorityID={this.props.addNewTaskState.priorityID}
                            closePanel={() => {
                            // To do
                            }}
                            openPanel={() => {
                            // To do
                            }}
                        />
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Tooltip
                                position={Position.BOTTOM_RIGHT}
                                content="Close without save"
                            >
                                <Button
                                    onClick={this.handleCloseAddNewTaskDialog}
                                >
                                    Close
                                </Button>
                            </Tooltip>
                            <Tooltip
                                position={Position.BOTTOM_RIGHT}
                                content="Save new task"
                            >
                                <Button
                                    intent={Intent.PRIMARY}
                                    onClick={this.handleCloseAddNewTaskDialog}
                                >
                                    Add
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </Dialog> */}
                {/* Edit task dialog */}
                <TaskDetailDialog
                    title="Edit task"
                    isOpen={this.props.isOpenEditTaskDialog}
                    isAdd={false}
                />
                {/* <Dialog
                    icon={IconNames.INFO_SIGN}
                    onClose={this.handleCloseEditTaskDialog}
                    title="Edit task"
                    isOpen={this.props.isOpenEditTaskDialog}
                    style={{
                        width: "80%",
                    }}
                >
                    <div className={Classes.DIALOG_BODY}>
                        <TaskDetailPanel
                            columnID={this.props.editTaskState.columnID}
                            priorityID={this.props.editTaskState.priorityID}
                            task={this.props.editTaskState.task}
                            closePanel={() => {
                            // To do
                            }}
                            openPanel={() => {
                            // To do
                            }}
                        />
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Tooltip
                                position={Position.BOTTOM_RIGHT}
                                content="Close without save"
                            >
                                <Button
                                    onClick={this.handleCloseEditTaskDialog}
                                >
                                    Close
                                </Button>
                            </Tooltip>
                            <Tooltip
                                position={Position.BOTTOM_RIGHT}
                                content="Save new task"
                            >
                                <Button
                                    intent={Intent.PRIMARY}
                                    onClick={this.handleCloseEditTaskDialog}
                                >
                                    Add
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </Dialog> */}
                {/* Edit column title dialog */}
                <Dialog
                    icon={IconNames.INFO_SIGN}
                    onClose={this.handleCloseEditColumnTitleDialog}
                    title="Edit title"
                    isOpen={this.props.isOpenEditColumnTitleDialog}
                >
                    <div className={Classes.DIALOG_BODY}>
                        <InputGroup
                            disabled={false}
                            large={true}
                            // leftIcon="filter"
                            // onChange={this.handleTitleChange}
                            placeholder="Column title..."
                            // rightElement={maybeSpinner}
                            // small={small}
                            // value={this.state.title}
                            value="Test - Replace by props"
                        />
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Tooltip
                                position={Position.BOTTOM_RIGHT}
                                content="Close without save"
                            >
                                <Button onClick={this.handleCloseEditColumnTitleDialog}>Close</Button>
                            </Tooltip>
                            <Tooltip
                                position={Position.BOTTOM_RIGHT}
                                content="Save the change"
                            >
                                <Button
                                    intent={Intent.PRIMARY}
                                    onClick={this.handleCloseEditColumnTitleDialog}
                                >
                                    Save
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </Dialog>
                {/* Add column dialog */}
                <ColumnDetailDialog
                    title="Add new column"
                    isOpen={this.props.isOpenAddColumnDialog}
                    isAdd={true}
                />
                {/* Edit column dialog */}
                <ColumnDetailDialog
                    title="Edit column"
                    isOpen={this.props.isOpenEditColumnDialog}
                    isAdd={false}
                />
                {/* Add priority dialog */}
                <PriorityDetailDialog
                    title="Add new priority"
                    isOpen={this.props.isOpenAddPriorityDialog}
                    isAdd={true}
                />
                {/* Edit priority dialog */}
                <PriorityDetailDialog
                    title="Edit priority"
                    isOpen={this.props.isOpenEditPriorityDialog}
                    isAdd={false}
                />
                {/* Add sprint dialog */}
                <SprintDetailDialog
                    title="Add new sprint"
                    isOpen={this.props.isOpenAddSprintDialog}
                    isAdd={true}
                />
                {/* Edit sprint dialog */}
                <SprintDetailDialog
                    title="Edit sprint"
                    isOpen={this.props.isOpenEditSprintDialog}
                    isAdd={false}
                />
                {/* Edit sprint dialog */}
                <SprintRequirementDialog
                    isOpen={this.props.isOpenSprintRequirementDialog}
                />
                <SprintMoveToDialog
                    isOpen={this.props.isOpenSprintMoveToDialog}
                />
                <EmployeePerformanceReviewDialog
                    isOpen={this.props.isOpenEmployeePerformanceReviewDialog}
                />
            </Container>
        );
    }

    private handleLogin = () => {
        this.props.loginRequest(this.props.loginInput);
    }

    private handleCloseLoginDialog = () => {
        this.props.openLoginDialog(false);
    }

    private handleOpenAddNewTaskDialog = () => {
        this.props.openAddTaskDialog(true);
    }

    private handleCloseAddNewTaskDialog = () => {
        this.props.openAddTaskDialog(false);
    }

    private handleOpenEditTaskDialog = () => {
        this.props.openEditTaskDialog(true);
    }

    private handleCloseEditTaskDialog = () => {
        this.props.openEditTaskDialog(false);
    }

    private handleCloseEditColumnTitleDialog = () => {
        this.props.openEditColumnTitleDialog(false);
    }

    private handleCloseAddColumnDialog = () => {
        this.props.openAddColumnDialog(false);
    }

    private handleCloseEditColumnDialog = () => {
        this.props.openEditColumnDialog(false);
    }

    private handleCloseAddPriorityDialog = () => {
        this.props.openAddPriorityDialog(false);
    }

    private handleCloseEditPriorityDialog = () => {
        this.props.openEditPriorityDialog(false);
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ dialogs, tasks, columns, priorities, logins }: IApplicationState) => ({
    isOpenLoginDialog: dialogs.isOpenLoginDialog,
    isLoginLoading: logins.loading,
    loginInput: logins.input,
    loginResult: logins.result,
    isOpenRegisterDialog: dialogs.isOpenRegisterDialog,
    isOpenAddTaskDialog: dialogs.isOpenAddTaskDialog,
    isOpenEditTaskDialog: dialogs.isOpenEditTaskDialog,
    isOpenEditColumnTitleDialog: dialogs.isOpenEditColumnTitleDialog,
    isOpenAddColumnDialog: dialogs.isOpenAddColumnDialog,
    isOpenEditColumnDialog: dialogs.isOpenEditColumnDialog,
    isOpenAddPriorityDialog: dialogs.isOpenAddPriorityDialog,
    isOpenEditPriorityDialog: dialogs.isOpenEditPriorityDialog,
    isOpenCreateProjectDialog: dialogs.isOpenCreateProjectDialog,
    isOpenAddSprintDialog: dialogs.isOpenAddSprintDialog,
    isOpenEditSprintDialog: dialogs.isOpenEditSprintDialog,
    isOpenSprintRequirementDialog: dialogs.isOpenSprintRequirementDialog,
    isOpenSprintMoveToDialog: dialogs.isOpenSprintMoveToDialog,
    isOpenEmployeePerformanceReviewDialog: dialogs.isOpenEmployeePerformanceReviewDialog,
    editTaskState: tasks.editTaskState,
    addColumnState: columns.addColumnState,
    editColumnState: columns.editColumnState,
    addPriorityState: priorities.addPriorityState,
    editPriorityState: priorities.editPriorityState,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openLoginDialog: (isOpen: boolean) => dispatch(dialogsActions.openLoginDialog(isOpen)),
    openRegisterDialog: (isOpen: boolean) => dispatch(dialogsActions.openRegisterDialog(isOpen)),
    openAddTaskDialog: (isOpen: boolean) => dispatch(dialogsActions.openAddTaskDialog(isOpen)),
    openEditTaskDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditTaskDialog(isOpen)),
    openEditColumnTitleDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditColumnTitleDialog(isOpen)),
    openAddColumnDialog: (isOpen: boolean) => dispatch(dialogsActions.openAddColumnDialog(isOpen)),
    openEditColumnDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditColumnDialog(isOpen)),
    openAddPriorityDialog: (isOpen: boolean) => dispatch(dialogsActions.openAddPriorityDialog(isOpen)),
    openEditPriorityDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditPriorityDialog(isOpen)),
    openSprintRequirementDialog: (isOpen: boolean) => dispatch(dialogsActions.openSprintRequirementDialog(isOpen)),
    openEmployeePerformanceReviewDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openEmployeePerformanceReviewDialog(isOpen)),
    loginRequest: (input: ILoginInput) => dispatch(loginsActions.loginRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DialogsManager);

/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import {
    Button,
    Callout,
    Classes,
    Dialog,
    Intent,
    Position,
    Slider,
    Spinner,
    Switch,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import _ from "lodash";
import React, { FormEvent } from "react";
import { Cookies } from "react-cookie";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as boardActions from "../../store/board/actions";
import { IColumn } from "../../store/columns/types";
import * as dialogsActions from "../../store/dialogs/actions";
import * as loginsActions from "../../store/logins/actions";
import { IEmailNotificationInput } from "../../store/logins/types";
import { IPriority } from "../../store/priorities/types";
import { IProject } from "../../store/projects/types";
import * as tasksActions from "../../store/tasks/actions";
import {
    IAddTaskState,
    IEditTaskState,
    ITask,
    ITaskCommonResult,
    ITaskCreateInput,
    ITaskDeleteInput,
    ITaskUpdateInput,
} from "../../store/tasks/types";
import { getMentionedUserIDsFromDraftJSRawState } from "../../utils/data";
import { getHostAndProtocol } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import TaskDetailPanel from "./task-detail-panel";

const Container = styled.div`
    // display: flex;
    flex-direction: task;
    flex-grow: 1;
    padding-left: 20px;
    padding-top: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    overflow: auto;
`;

interface ITaskDetailState {
    isConfirmingDelete: boolean;
}

interface IPropsFromState {
    editTaskState: IEditTaskState;
    // addTaskState: IAddTaskState;
    createTaskInput: ITaskCreateInput;
    createTaskLoading: boolean;
    createTaskResult: ITaskCommonResult;
    updateTaskInput: ITaskUpdateInput;
    currentProject: IProject;
    columnMap: IStringTMap<IColumn>;
    priorityMap: IStringTMap<IPriority>;
}

interface IPropsFromDispatch {
    openAddTaskDialog: typeof dialogsActions.openAddTaskDialog;
    openEditTaskDialog: typeof dialogsActions.openEditTaskDialog;
    createTaskRequest: typeof tasksActions.createTaskRequest;
    createTaskSetInput: typeof tasksActions.createTaskSetInput;
    createTaskSetResult: typeof tasksActions.createTaskSetResult;
    deleteTaskRequest: typeof tasksActions.deleteTaskRequest;
    deleteTaskFromBoard: typeof boardActions.deleteTaskFromBoard;
    sendEmailNotificationRequest: typeof loginsActions.sendEmailNotificationRequest;
}

interface IOwnProps {
    isOpen: boolean;
    title: string;
    isAdd: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class TaskDetailDialog extends React.PureComponent<AllProps, ITaskDetailState> {
    public state: ITaskDetailState = {
        isConfirmingDelete: false,
    };
    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // To do
    }

    public render() {
        // const {role} = this.state;
        return (
            <Dialog
                icon={IconNames.INFO_SIGN}
                onClose={this.handleCloseDialog}
                title={this.props.title}
                isOpen={this.props.isOpen}
                style={{
                    width: "80%",
                }}
            // transitionDuration={0}
            >
                <div className={Classes.DIALOG_BODY}>
                    <TaskDetailPanel
                        isAdd={this.props.isAdd}
                    />
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Tooltip
                            position={Position.BOTTOM_RIGHT}
                            content="Close without save"
                        >
                            <Button
                                onClick={this.handleCloseDialog}
                            >
                                Close
                            </Button>
                        </Tooltip>
                        {
                            this.props.isAdd ?
                                (this.props.createTaskResult.id === undefined ?
                                    (
                                        <Tooltip
                                            position={Position.BOTTOM_RIGHT}
                                            content={"Add new task"}
                                        >
                                            <Button
                                                intent={Intent.PRIMARY}
                                                loading={this.props.createTaskLoading}
                                                onClick={this.handleCreate}
                                            >
                                                {"Add"}
                                            </Button>
                                        </Tooltip>
                                    ) :
                                    (
                                        <Tooltip
                                            position={Position.BOTTOM_RIGHT}
                                            content="Add more task"
                                        >
                                            <Button
                                                intent={Intent.PRIMARY}
                                                onClick={this.handleCreateMore}
                                                loading={this.props.createTaskLoading}
                                            // disabled={this.props.isLoginLoading}
                                            >
                                                Add more
                                    </Button>
                                        </Tooltip>
                                    )) :
                                (
                                    !this.state.isConfirmingDelete ?
                                        [
                                            <Tooltip
                                                key="TTDeleteThisTask"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"Delete this task"}
                                            >
                                                <Button
                                                    intent={Intent.DANGER}
                                                    loading={this.props.createTaskLoading}
                                                    onClick={this.handleDelete}
                                                >
                                                    Delete
                                        </Button>
                                            </Tooltip>,
                                            // Auto save so don't need save button
                                            // <Tooltip
                                            //     key="TTSaveExistingTask"
                                            //     position={Position.BOTTOM_RIGHT}
                                            //     content={"Save task"}
                                            // >
                                            //     <Button
                                            //         intent={Intent.PRIMARY}
                                            //         loading={this.props.createTaskLoading}
                                            //         onClick={this.handleSave}
                                            //     >
                                            //         Save
                                            //     </Button>
                                            // </Tooltip>,
                                        ] :
                                        [
                                            <Button
                                                key="ButtonDeleteDisplayConfirmMessage"
                                                intent={Intent.NONE}
                                                minimal={true}
                                                disabled={true}
                                            >
                                                Are you sure ?
                                    </Button>,
                                            <Tooltip
                                                key="TTDeleteThisTaskYes"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"Confirm that you want to delete this task"}
                                            >
                                                <Button
                                                    intent={Intent.PRIMARY}
                                                    onClick={this.handleConfirmDelete}
                                                >
                                                    Yes
                                        </Button>
                                            </Tooltip>,
                                            <Tooltip
                                                key="TTDeleteThisTaskNo"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"You don't want to delete this task"}
                                            >
                                                <Button
                                                    intent={Intent.NONE}
                                                    onClick={this.handleNotConfirmDelete}
                                                >
                                                    No
                                        </Button>
                                            </Tooltip>,
                                        ]
                                )
                        }
                    </div>
                </div>
            </Dialog>
        );
    }

    private sendNotificationForNewTask = () => {
        if (this.props.createTaskResult.id !== undefined) {
            const mentionedTaskDescriptionUserIDs: string[] =
                getMentionedUserIDsFromDraftJSRawState(this.props.createTaskInput.description);

            const column: IColumn | undefined = this.props.columnMap[this.props.createTaskInput.columnID];
            const priority: IPriority | undefined = this.props.priorityMap[this.props.createTaskInput.priorityID];
            const previewTaskDescription: string = this.props.createTaskInput.plain !== undefined ?
                this.props.createTaskInput.plain.replace(/(?:\r\n|\r|\n)/g, "<br>") :
                "";

            const content = `A new task is added in project <b>${this.props.currentProject.name}</b>` +
                `<br/>Task title: <b>${this.props.createTaskInput.title}</b>` +
                `<br/>Column: <b>${column !== undefined ? column.title : ""}</b>` +
                `<br/>Priority: <b>${priority !== undefined ? priority.title : ""}</b>` +
                `<br/>Preview: <br/><b>${previewTaskDescription}</b>` +
                `<br/><a href="${getHostAndProtocol()}/projects/` +
                `${this.props.currentProject.shortcode}/${this.props.createTaskResult.id}">` +
                `Click to access task</a>` +
                ``;

            // //  Send to mentioned users
            // if (mentionedTaskDescriptionUserIDs.length > 0) {
            //     this.props.sendEmailNotificationRequest({
            //         subject: `[Mentioned in task] You are mentioned in a new task: ` +
            //                 `${this.props.createTaskInput.title} (Task Ripple)`,
            //         content,
            //         mentionedTaskDescriptionUserIDs,
            //     });
            // }
            // Send to other users
            this.props.sendEmailNotificationRequest({
                subject: `[New task] A new task is added: ${this.props.createTaskInput.title} (Task Ripple)`,
                content,
                taskID: this.props.createTaskResult.id,
                columnID: this.props.createTaskInput.columnID,
                priorityID: this.props.createTaskInput.priorityID,
                mentionedTaskDescriptionUserIDs,
            });
        }
    }

    private handleCloseDialog = () => {
        // To do
        if (this.props.isAdd) {
            this.props.openAddTaskDialog(false);
        } else {
            this.props.openEditTaskDialog(false);
        }
        this.handleCreateMore();
    }

    private handleCreate = () => {
        if (this.props.isAdd) {
            this.props.createTaskRequest(this.props.createTaskInput);
        } else {
            // this.props.createTaskRequest({

            // })
        }
    }

    private handleCreateMore = () => {
        if (this.props.isAdd) {
            // Send notification before reset
            this.sendNotificationForNewTask();
            // Reset the input data
            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                managers: [],
                title: "",
            });

            this.props.createTaskSetResult({
                id: undefined,
                errors: undefined,
            });
        } else {
            // this.props.createTaskRequest({

            // })
        }
    }

    private handleSave = () => {
        // To do
    }

    private handleNotConfirmDelete = () => {
        this.setState({
            isConfirmingDelete: false,
        });
    }

    private handleConfirmDelete = () => {
        this.setState({
            isConfirmingDelete: false,
        });

        this.props.deleteTaskRequest({
            id: this.props.updateTaskInput.id,
        });

        this.props.deleteTaskFromBoard({
            id: this.props.updateTaskInput.id,
        });

        this.props.sendEmailNotificationRequest({
            subject: `[Task removal] A task is removed: ${this.props.updateTaskInput.title} (Task Ripple)`,
            content: `A task is removed from project <b>${this.props.currentProject.name}</b>` +
                `<br/>Task title: <b>${this.props.updateTaskInput.title}</b>` +
                `<br/><a href="${getHostAndProtocol()}/projects/` +
                `${this.props.currentProject.shortcode}/${this.props.updateTaskInput.id}">` +
                `Click to access task</a>` +
                ``,
            columnID: this.props.updateTaskInput.columnID,
            priorityID: this.props.updateTaskInput.priorityID,
        });

        this.props.openEditTaskDialog(false);
    }

    private handleDelete = () => {
        this.setState({
            isConfirmingDelete: true,
        });
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ tasks, board }: IApplicationState) => ({
    editTaskState: tasks.editTaskState,
    // addTaskState: tasks.addTaskState,
    createTaskInput: tasks.createTaskInput,
    createTaskLoading: tasks.createTaskLoading,
    createTaskResult: tasks.createTaskResult,
    updateTaskInput: tasks.updateTaskInput,
    currentProject: board.project,
    columnMap: board.columnMap,
    priorityMap: board.priorityMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openAddTaskDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openAddTaskDialog(isOpen)),
    openEditTaskDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openEditTaskDialog(isOpen)),
    createTaskRequest: (input: ITaskCreateInput) =>
        dispatch(tasksActions.createTaskRequest(input)),
    createTaskSetInput: (input: ITaskCreateInput) =>
        dispatch(tasksActions.createTaskSetInput(input)),
    createTaskSetResult: (result: ITaskCommonResult) =>
        dispatch(tasksActions.createTaskSetResult(result)),
    deleteTaskRequest: (input: ITaskDeleteInput) =>
        dispatch(tasksActions.deleteTaskRequest(input)),
    deleteTaskFromBoard: (input: ITaskDeleteInput) =>
        dispatch(boardActions.deleteTaskFromBoard(input)),
    sendEmailNotificationRequest: (input: IEmailNotificationInput) =>
        dispatch(loginsActions.sendEmailNotificationRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TaskDetailDialog);

/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Alignment,
    Button,
    Card,
    Classes,
    ContextMenu,
    Dialog,
    Elevation,
    Icon,
    Intent,
    Menu,
    MenuDivider,
    MenuItem,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    Popover,
    Position,
    Tag,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { History } from "history";
import _ from "lodash";
import React from "react";
import { Draggable, DraggableStateSnapshot } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Route, Router } from "react-router";
import { withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as boardActions from "../../store/board/actions";
import { IStandardColor } from "../../store/colors/types";
import { IColumn } from "../../store/columns/types";
import * as dialogsActions from "../../store/dialogs/actions";
import { IPriority } from "../../store/priorities/types";
import { IProject } from "../../store/projects/types";
import * as tasksActions from "../../store/tasks/actions";
import {
    IAddOrRemoveTaskAppointeeInput,
    IAddOrRemoveTaskManagerInput,
    ITask,
    ITaskUpdateInput,
} from "../../store/tasks/types";
import * as usersActions from "../../store/users/actions";
import { IUser } from "../../store/users/types";
import { IStringTMap } from "../../utils/types";
import UserAddButton from "../useraddbutton";
import UserImage from "../userimage";

const Container = styled.div<DraggableStateSnapshot>`
    margin-bottom: 8px;
    min-height: 130px;
    max-height: 130px;
`;

interface ITaskBarProps {
    task: ITask;
    userMap: IStringTMap<IUser>;
    onAddAppointee: (selectedUser: IUser) => void;
    onAddManager: (selectedUser: IUser) => void;
    onRemoveAppointee: (userID: string) => void;
    onRemoveManager: (userID: string) => void;
}

interface ITaskBarState {
    overflowTaskBar?: boolean;
}

class TaskBar extends React.PureComponent<ITaskBarProps, ITaskBarState> {
    public state: ITaskBarState = {
        overflowTaskBar: undefined,
    };
    public render() {
        return (
        <Navbar
            style={{
                paddingLeft: "5px",
                paddingRight: "5px",
                // display: "flex",
                // flexDirection: "row",
                overflow: `${this.state.overflowTaskBar ? "inherit" : "auto"}`,
            }}
            onMouseEnter={() => {
                this.setState({
                    overflowTaskBar: true,
                });
            }}
            onMouseLeave={() => {
                this.setState({
                    overflowTaskBar: false,
                });
            }}
            className="hide-scroll-bar"
        >
            <NavbarGroup
                align={Alignment.LEFT}
                style={{
                    backgroundColor: `${this.state.overflowTaskBar ?
                        "rgba(255,,0,0,0.5)" : "inherit"}`,
                }}
            >
                <Tooltip
                    position={Position.BOTTOM_RIGHT}
                    content={
                        `Completed ${this.props.task.totalUnitPointsCompleted} ` +
                        `in total of ${this.props.task.totalUnitPoints} points`}
                >
                    <Tag
                        intent={this.props.task.totalUnitPoints === 0 || this.props.task.doesHaveZeroUnit ?
                            Intent.DANGER :
                            (
                                this.props.task.totalUnitPointsCompleted === this.props.task.totalUnitPoints ?
                                Intent.SUCCESS : Intent.WARNING
                            )
                        }
                        round={true}
                        large={true}
                        className="tag-score"
                        style={{
                            marginLeft: "5px",
                        }}
                    >
                        {
                            this.props.task.totalUnitPointsCompleted === this.props.task.totalUnitPoints ?
                            `${this.props.task.totalUnitPointsCompleted}` :
                            `${this.props.task.totalUnitPointsCompleted}` +
                            `/${this.props.task.totalUnitPoints}`
                        }
                    </Tag>
                </Tooltip>
                <NavbarDivider/>
                {
                    _.map(this.props.task.appointees, (eachUserID: string) => {
                        const eachUser = this.props.userMap[eachUserID];
                        return (
                            <UserImage
                                key={eachUserID}
                                sizeInPx={30}
                                name={_.isUndefined(eachUser) ? "..." : eachUser.nickname}
                                imgSource={
                                    _.isUndefined(eachUser) ?
                                    undefined : eachUser.avatarBase64
                                }
                                doesDisplayName={false}
                                allowContextMenu={true}
                                displayTooltip={true}
                                userID={eachUserID}
                                onRemoveUser={this.props.onRemoveAppointee}
                            />
                        );
                    })
                }
                {this.props.task.appointees.length === 0 ?
                    <UserAddButton
                        onSelectUser={this.props.onAddAppointee}
                        excludeMembers={this.props.task.appointees}
                        sizeInPx={30}
                        doesDisplayName={false}
                        usePortal={true}
                    /> : null
                }
                <NavbarDivider/>
                {
                    _.map(this.props.task.managers, (eachUserID: string) => {
                        const eachUser = this.props.userMap[eachUserID];
                        return (
                            <UserImage
                                key={eachUserID}
                                sizeInPx={30}
                                name={_.isUndefined(eachUser) ? "..." : eachUser.nickname}
                                imgSource={
                                    _.isUndefined(eachUser) ?
                                    undefined : eachUser.avatarBase64
                                }
                                doesDisplayName={false}
                                allowContextMenu={true}
                                displayTooltip={true}
                                userID={eachUserID}
                                onRemoveUser={this.props.onRemoveManager}
                            />
                        );
                    })
                }
                {this.props.task.managers.length === 0 ?
                    <UserAddButton
                        onSelectUser={this.props.onAddManager}
                        excludeMembers={this.props.task.managers}
                        sizeInPx={30}
                        doesDisplayName={false}
                        usePortal={true}
                    /> : null
                }
            </NavbarGroup>
            {/* <NavbarGroup
                align={Alignment.RIGHT}
            >
                <NavbarDivider
                    style={{
                        margin: "0px 2px",
                    }}
                />
                <Icon
                    // className={Classes.BUTTON}
                    icon={IconNames.MORE}
                    iconSize={Icon.SIZE_STANDARD}
                    style={{
                        transform: "rotate(90deg)",
                    }}
                    // intent={Intent.PRIMARY}
                    // onClick={this.showContextMenu}
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        this.showContextMenu(e, history);
                    }}
                />
            </NavbarGroup> */}
        </Navbar>
        );
    }
}

interface ITaskState {
    overflowTaskBar: boolean;
    // isContextMenuOpen: boolean;
}

interface IPropsFromState {
    userMap: IStringTMap<IUser>;
}

interface IPropsFromDispatch {
    updateTaskSetInput: typeof tasksActions.updateTaskSetInput;
    openEditTaskDialog: typeof dialogsActions.openEditTaskDialog;
    getUsers: typeof usersActions.getUsers;
    insertOrUpdateTaskBoard: typeof boardActions.insertOrUpdateTaskBoard;
    addOrRemoveTaskManagerRequest: typeof tasksActions.addOrRemoveTaskManagerRequest;
    addOrRemoveTaskAppointeeRequest: typeof tasksActions.addOrRemoveTaskAppointeeRequest;
}

interface IOwnProps {
    index: number;
    task: ITask;
    project: IProject;
    // priority: IPriority;
    // column: IColumn;
    columnID: string;
    priorityID: string;
    priorityBackgroundColor: IStandardColor;
    isDragDisabled?: boolean;
    isClickable?: boolean;
    allowContextMenu?: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class Task extends React.PureComponent<AllProps, ITaskState> {
    public state: ITaskState = {
        overflowTaskBar: false,
        // isContextMenuOpen: false,
    };

    private clickTimeout: any = null;

    public componentDidUpdate() {
        // console.log("Task ", this.props.task.title, " did update ");
    }

    public componentDidMount() {
        _.map(this.props.task.appointees, (eachUserID: string) => {
            const eachUser = this.props.userMap[eachUserID];
            if (eachUser === undefined) {
                this.props.getUsers();
            }
        });

        _.map(this.props.task.managers, (eachUserID: string) => {
            const eachUser = this.props.userMap[eachUserID];
            if (eachUser === undefined) {
                this.props.getUsers();
            }
        });
    }

    public render() {
        return (
            <Draggable
                draggableId={this.props.task.id}
                index={this.props.index}
                isDragDisabled={this.props.isDragDisabled === true}
            >
                {(provided, snapshot) => (
                    // provided Draggable component require its children
                    // to be a function, the parameter is a provided object
                    // snapshot the component during Drag
                    <Container
                        // draggableProps these props need to be applied to the
                        // component that we want to move around in response to user input
                        {...provided.draggableProps}
                        // dragHandleProps Need to apply to the path of the
                        // component that we want to use to be able to control
                        // the entire component, and you can use this to drag a
                        // large item by just a small part of it, for this application
                        // we want the whole task to be draggble so we are going to
                        // apply these props to the same element
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        isDragging={snapshot.isDragging}
                        isDropAnimating={true}
                        // isDragDisabled = {isDragDisabled}
                    >
                        <Route
                            render={({history}) => (
                                <Card
                                    interactive={false}
                                    elevation={Elevation.ONE}
                                    onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
                                        if (this.props.allowContextMenu !== false) {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            this.showContextMenu(e, history);
                                        }
                                    }}
                                    onClick={(e) => {
                                        if (this.props.isClickable !== false) {
                                            this.handleCardClicks(e, history);
                                        }
                                    }}
                                    // onClick={(e) => {
                                    //     this.showContextMenu(e, history);
                                    //     // history.push(
                                    //     //     `/projects/${this.props.task.lane.project.id}/${this.props.task.id}`,
                                    //     // );
                                    // }}
                                    // onDoubleClick={this.openEditTaskDialog}
                                    style={{
                                        borderLeftColor: `rgba(
                                            ${this.props.priorityBackgroundColor.red},
                                            ${this.props.priorityBackgroundColor.green},
                                            ${this.props.priorityBackgroundColor.blue},
                                            0.7)`,
                                        borderLeftWidth: "7px",
                                        borderLeftStyle: "solid",
                                        padding: "10px",
                                    }}
                                >
                                    <p
                                        className={Classes.UI_TEXT}
                                        style={{
                                            minHeight: "50px",
                                            maxHeight: "50px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "normal",
                                        }}
                                    >
                                        {/* <Tag
                                            minimal={true}
                                        >
                                            {this.props.task.incrementcode}
                                        </Tag> */}
                                        {/* {"[" + this.props.index + "]" + this.props.task.title} */}
                                        {`${this.props.task.incrementcode} - ${this.props.task.title}`}
                                    </p>
                                    <TaskBar
                                        task={this.props.task}
                                        userMap={this.props.userMap}
                                        onAddAppointee={this.onAddTaskAppointee}
                                        onAddManager={this.onAddTaskManager}
                                        onRemoveAppointee={this.onRemoveTaskAppointee}
                                        onRemoveManager={this.onRemoveTaskManager}
                                    />
                                </Card>
                            )}
                        />
                    </Container>
                )}
            </Draggable>
        );
    }

    // Credit: https://stackoverflow.com/a/49187413/9853545
    private handleCardClicks = (e, history) => {
        e.stopPropagation();
        const clientX: number = e.clientX;
        const clientY: number = e.clientY;
        if (this.clickTimeout !== null) {
            // Double click
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
            this.openEditTaskDialog();
        } else {
            // console.log("single click");
            this.clickTimeout = setTimeout(() => {
                this.showContextMenu(e, history, clientX, clientY);
                // Single click
                clearTimeout(this.clickTimeout);
                this.clickTimeout = null;
            }, 500);
            // this.showContextMenu(e, history, clientX, clientY);
        }
    }

    private showContextMenu = (
        e: React.MouseEvent<HTMLDivElement>,
        history: History<any>,
        clientX?: number,
        clientY?: number,
    ) => {
        // e.stopPropagation();
        // // must prevent default to cancel parent's context menu
        // e.preventDefault();
        // invoke static API, getting coordinates from mouse event
        ContextMenu.show(
            <Menu>
                {/* <MenuItem icon="search-around" text="Search around..." />
                <MenuItem icon="search" text="Object viewer" /> */}
                {/* <MenuItem icon="remove" text="Remove" /> */}
                <MenuItem
                    icon={IconNames.APPLICATION}
                    text="Open"
                    onClick={() => {
                        this.openTaskPage(history);
                    }}
                />
                <MenuItem
                    icon={IconNames.APPLICATION}
                    text="Open in dialog"
                    onClick={this.openEditTaskDialog}
                />
                <MenuItem icon={IconNames.APPLICATIONS} text="Open in new tab" onClick={this.openInNewTab}/>
                {/* <MenuItem icon={IconNames.MOBILE_VIDEO} text="Call person in charge" />
                <MenuDivider />
                <MenuItem icon={IconNames.LIST_COLUMNS} text="Column">
                    <MenuItem icon="bold" text="Bold" />
                    <MenuItem icon="italic" text="Italic" />
                    <MenuItem icon="underline" text="Underline" />
                </MenuItem>
                <MenuItem icon={IconNames.LIST} text="Priority">
                    <MenuItem icon="bold" text="Bold" />
                    <MenuItem icon="italic" text="Italic" />
                    <MenuItem icon="underline" text="Underline" />
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={IconNames.REMOVE}  text="Remove" /> */}
                {/* <MenuItem disabled={true} text="Clicked on node" /> */}
            </Menu>,
            { left: clientX ? clientX : e.clientX, top: clientY ? clientY : e.clientY },
            () => {return; }, // this.setState({ isContextMenuOpen: false }),
        );
        // indicate that context menu is open so we can add a CSS class to this element
        // this.setState({ isContextMenuOpen: true });
    }

    private openTaskPage = (history: History) => {
        // this.props.updateTaskSetInput({
        //     ...this.props.task,
        //     projectID: this.props.project.id,
        //     sprintID: this.props.project.currentSprint.id,
        //     description: "", // To do
        // });
        history.push(
            `/projects/${this.props.project.shortcode}/${this.props.task.id}`,
        );
    }

    private openEditTaskDialog = () => {
        // this.props.setEditTaskState(this.props.columnID, this.props.priorityID, this.props.task);
        this.props.updateTaskSetInput({
            ...this.props.task,
            projectID: this.props.project.id,
            sprintID: this.props.project.currentSprint.id,
            description: "", // To do
        });
        this.props.openEditTaskDialog(true);
    }

    private openInNewTab = () => {
        window.open(`/projects/${this.props.project.shortcode}/${this.props.task.id}`);
    }

    private onAddTaskManager = (selectedUser: IUser) => {
        const managers = [...this.props.task.managers, selectedUser.id];
        this.props.insertOrUpdateTaskBoard({
            ...this.props.task,
            managers,
        });

        this.props.addOrRemoveTaskManagerRequest({
            id: this.props.task.id,
            isAdd: true,
            managerUserID: selectedUser.id,
        });
    }

    private onRemoveTaskManager = (userID: string) => {
        const managers = _.remove(
            this.props.task.managers,
            (eachUserID: string) => {
            return eachUserID !== userID;
        });

        this.props.insertOrUpdateTaskBoard({
            ...this.props.task,
            managers,
        });

        this.props.addOrRemoveTaskManagerRequest({
            id: this.props.task.id,
            isAdd: false,
            managerUserID: userID,
        });
    }

    private onAddTaskAppointee = (selectedUser: IUser) => {
        const appointees = [...this.props.task.appointees, selectedUser.id];
        this.props.insertOrUpdateTaskBoard({
            ...this.props.task,
            appointees,
        });

        this.props.addOrRemoveTaskAppointeeRequest({
            id: this.props.task.id,
            isAdd: true,
            appointeeUserID: selectedUser.id,
        });
    }

    private onRemoveTaskAppointee = (userID: string) => {
        const appointees = _.remove(
            this.props.task.appointees,
            (eachUserID: string) => {
            return eachUserID !== userID;
        });

        this.props.insertOrUpdateTaskBoard({
            ...this.props.task,
            appointees,
        });

        this.props.addOrRemoveTaskAppointeeRequest({
            id: this.props.task.id,
            isAdd: false,
            appointeeUserID: userID,
        });
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ users }: IApplicationState) => ({
    userMap: users.userMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateTaskSetInput: (input: ITaskUpdateInput) =>
        dispatch(tasksActions.updateTaskSetInput(input)),
    openEditTaskDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditTaskDialog(isOpen)),
    getUsers: () =>
        dispatch(usersActions.getUsers()),
    insertOrUpdateTaskBoard: (task: ITask) =>
        dispatch(boardActions.insertOrUpdateTaskBoard(task)),
    addOrRemoveTaskManagerRequest: (input: IAddOrRemoveTaskManagerInput) =>
        dispatch(tasksActions.addOrRemoveTaskManagerRequest(input)),
    addOrRemoveTaskAppointeeRequest: (input: IAddOrRemoveTaskAppointeeInput) =>
        dispatch(tasksActions.addOrRemoveTaskAppointeeRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Task);

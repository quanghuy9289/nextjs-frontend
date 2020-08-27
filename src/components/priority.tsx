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
    ContextMenu,
    Dialog,
    H5,
    InputGroup,
    Intent,
    Menu,
    MenuDivider,
    MenuItem,
    Position,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { History } from "history";
import _ from "lodash";
import React from "react";
import { DragDropContext, Draggable, Droppable, DroppableStateSnapshot } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Route } from "react-router";
import { Dispatch } from "redux";
import styled from "styled-components";
import initialData from "../data/initial-data";
import { IApplicationState } from "../store";
import * as dialogsActions from "../store/dialogs/actions";
import * as prioritiesActions from "../store/priorities/actions";
import * as tasksActions from "../store/tasks/actions";
import Task from "./task";
import TaskDetailPanel from "./taskdetailpanel";

const Container = styled.div`
    width: 300px;
    margin-bottom: 5px;
    margin-top: 5px;
    min-width: 300px;
    height: auto;
`;

const TaskList = styled.div<DroppableStateSnapshot>`
    padding: 8px;
    transition: background-color 0.2s ease;
    flex-grow: 1;
    min-height: 100px;
`;

interface InnerListProps {
    tasks: any[number];
    column: any;
    priority: any;
}

class InnerList extends React.PureComponent<InnerListProps, {}> {
    public render() {
        return this.props.tasks.map((task: any, index: number) => (
            <Task
                key={task.id}
                task={task}
                index={_.indexOf(this.props.column.taskIds, task.id)}
                priority={this.props.priority}
                column={this.props.column}
            />
        ));
    }
}

interface IPriorityState {
    isContextMenuOpen: boolean;
    isOpenAddTaskDialog: boolean;
}

interface IPropsFromState {
    isOpenAddTaskDialog?: boolean;
}

interface IPropsFromDispatch {
    openAddTaskDialog: typeof dialogsActions.openAddTaskDialog;
    setEditPriorityState: typeof prioritiesActions.setEditPriorityState;
    openEditPriorityDialog: typeof dialogsActions.openEditPriorityDialog;
}

interface IOwnProps {
    tasks: any[any];
    priority: any;
    // index: number;
    column: any;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class Priority extends React.Component<AllProps, IPriorityState> {
    public state: IPriorityState = {
        isContextMenuOpen: false,
        isOpenAddTaskDialog: false,
    };

    public componentDidMount() {
        // To do
    }

    public render() {
        return (
            <Container
            >
                <Route
                    render={({ history }) => (
                        <Callout
                            // intent="success"
                            icon={null}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: `rgba(
                                    ${this.props.priority.backgroundColor.red},
                                    ${this.props.priority.backgroundColor.green},
                                    ${this.props.priority.backgroundColor.blue},
                                    0.2)`,
                            }}
                            className={Classes.ELEVATION_1}
                            onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
                                this.showContextMenu(e, history);
                            }}
                            onClick={(e) => {
                                this.showContextMenu(e, history);
                                // history.push(
                                //     `/projects/${this.props.task.lane.project.id}/${this.props.task.id}`,
                                // );
                            }}
                        // interactive={false}
                        // elevation={Elevation.ONE}
                        >
                            <H5>
                                {this.props.priority.title}
                            </H5>
                            <Droppable
                                droppableId={this.props.column.id + "|" + this.props.priority.id}
                                // type = {this.props.column.id == 'column-3' ? 'done' : 'active'}
                                type="task"
                            >
                                {(providedDrop, snapshot) => (
                                    <TaskList
                                        // droppableProps these props need to be applied to the component
                                        // that we want to drop in response to user input
                                        {...providedDrop.droppableProps}
                                        ref={providedDrop.innerRef}
                                        isDraggingOver={snapshot.isDraggingOver}
                                    >
                                        <InnerList
                                            tasks={this.props.tasks}
                                            column={this.props.column}
                                            priority={this.props.priority}
                                        />
                                        {providedDrop.placeholder}
                                    </TaskList>
                                )}
                            </Droppable>
                        </Callout>
                    )}
                />
            </Container>
        );
    }
    private showContextMenu = (e: React.MouseEvent<HTMLDivElement>, history: History<any>) => {
        e.stopPropagation();
        // must prevent default to cancel parent's context menu
        e.preventDefault();
        // invoke static API, getting coordinates from mouse event
        ContextMenu.show(
            <Menu>
                {/* <MenuItem icon="search-around" text="Search around..." />
                <MenuItem icon="search" text="Object viewer" /> */}
                {/* <MenuItem icon="remove" text="Remove" /> */}
                <MenuItem
                    icon={IconNames.ADD}
                    text="New task"
                    onClick={this.handleOpenAddNewTaskDialog}
                />
                <MenuItem
                    icon={IconNames.COG}
                    text="Edit priority"
                    onClick={this.handleOpenEditPriorityDialog}
                />
                {/* <MenuItem icon={IconNames.APPLICATIONS} text="Open in new tab"/>
                <MenuItem icon={IconNames.MOBILE_VIDEO} text="Call person in charge" />
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
            { left: e.clientX, top: e.clientY },
            () => this.setState({ isContextMenuOpen: false }),
        );
        // indicate that context menu is open so we can add a CSS class to this element
        this.setState({ isContextMenuOpen: true });
    }

    private handleOpenAddNewTaskDialog = () => {
        // this.props.setAddNewTaskState(this.props.column, this.props.priority);
        this.props.openAddTaskDialog(true);
    }

    private handleOpenEditPriorityDialog = () => {
        this.props.setEditPriorityState(this.props.priority);
        this.props.openEditPriorityDialog(true);
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ dialogs }: IApplicationState) => ({
    isOpenEditTaskDialog: dialogs.isOpenEditTaskDialog,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openAddTaskDialog: (isOpen: boolean) => dispatch(dialogsActions.openAddTaskDialog(isOpen)),
    // setAddNewTaskState: (column: any, priority: any) => dispatch(tasksActions.setAddNewTaskState(column, priority)),
    setEditPriorityState: (priority: any) => dispatch(prioritiesActions.setEditPriorityState(priority)),
    openEditPriorityDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditPriorityDialog(isOpen)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Priority);

/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import {
    Alignment,
    Button,
    Callout,
    Classes,
    ContextMenu,
    Dialog,
    H5,
    Icon,
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
import { Droppable, DroppableStateSnapshot } from "react-beautiful-dnd";
import isEqual from "react-fast-compare";
import { connect } from "react-redux";
import { Route } from "react-router";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as boardActions from "../../store/board/actions";
import { IColumn } from "../../store/columns/types";
import * as dialogsActions from "../../store/dialogs/actions";
import * as prioritiesActions from "../../store/priorities/actions";
import { IPriority, IPriorityUpdateInput } from "../../store/priorities/types";
import { IProject } from "../../store/projects/types";
import * as tasksActions from "../../store/tasks/actions";
import { ITask, ITaskCreateInput } from "../../store/tasks/types";
import { CONST_CSS_CLS_DRAG_SCROLL_HANDLE } from "../../utils/constants";
import { generateUUID } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import Task from "./task";
import TaskEmpty from "./task-empty";
import TaskEmptyThinDraggable from "./task-empty-thin-draggable";

const Container = styled.div`
    width: 300px;
    margin-bottom: 5px;
    margin-top: 5px;
    min-width: 300px;
    height: auto;
    user-select: none;
`;

const TaskList = styled.div<DroppableStateSnapshot>`
    padding: 8px;
    transition: background-color 0.2s ease;
    flex-grow: 1;
    min-height: 100px;
`;

interface InnerListProps {
    tasks: ITask[];
    column: IColumn;
    priority: IPriority;
    columnTaskIDsInPriorityOrder: string[];
    filterByUserID?: string;
    fillUpNumberOfTasks: number;
    project: IProject;
}

class InnerList extends React.PureComponent<InnerListProps, {}> {
    public render() {
        const returnList: any[] = [];
        let numberOfRealTask: number = 0;

        this.props.tasks.map((task: ITask, index: number) => {
            if (_.isUndefined(this.props.filterByUserID) ||
                task.appointees.indexOf(this.props.filterByUserID) >= 0
            ) {
                returnList.push(
                    <Task
                        key={task.id}
                        task={task}
                        index={_.indexOf(this.props.columnTaskIDsInPriorityOrder, task.id)}
                        // priority={this.props.priority}
                        // column={this.props.column}
                        columnID={this.props.column.id}
                        priorityID={this.props.priority.id}
                        priorityBackgroundColor={this.props.priority.backgroundColor}
                        project={this.props.project}
                    />,
                );
                numberOfRealTask++;
            } else {
                returnList.push(
                    <TaskEmptyThinDraggable
                        key={returnList.length + "-empty-task-thin-draggable"}
                        taskID={task.id}
                        index={_.indexOf(this.props.columnTaskIDsInPriorityOrder, task.id)}
                    />,
                );
            }
            // return (
            //     <TaskEmpty
            //         key={task.id}
            //         index={_.indexOf(this.props.column.taskIDs, task.id)}
            //     />
            // );
        });

        if (numberOfRealTask < this.props.fillUpNumberOfTasks) {
            // const returnListLength = returnList.length;
            for (let i = 0; i < (this.props.fillUpNumberOfTasks - numberOfRealTask); i++) {
                returnList.push(
                    <TaskEmpty
                        key={returnList.length + "-empty-task"}
                    />,
                );
            }
        }

        return returnList;
    }
}

interface IPriorityState {
    isContextMenuOpen: boolean;
}

interface IPropsFromState {
    filterByUserID?: string;
}

interface IPropsFromDispatch {
    openAddTaskDialog: typeof dialogsActions.openAddTaskDialog;
    setEditPriorityState: typeof prioritiesActions.setEditPriorityState;
    openEditPriorityDialog: typeof dialogsActions.openEditPriorityDialog;
    updatePrioritySetInput: typeof prioritiesActions.updatePrioritySetInput;
    createTaskSetInput: typeof tasksActions.createTaskSetInput;
    enableDragToScroll: typeof boardActions.enableDragToScroll;
}

interface IOwnProps {
    tasks: ITask[];
    priority: IPriority;
    column: IColumn;
    projectID: string;
    project: IProject;
    fillUpNumberOfTasks: number; // Current largest number of tasks to fill up
    collapsed?: boolean;
    columnTaskIDsInPriorityOrder: string[];
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class Priority extends React.Component<AllProps, IPriorityState> {
    public state: IPriorityState = {
        isContextMenuOpen: false,
    };

    private lastMouseDownX: number = 0;
    private lastMouseDownY: number = 0;
    // private lastMouseDownTime: number = 0;
    private allowClickOnPriority: boolean = false;

    public componentDidMount() {
        // To do
    }

    public componentDidUpdate() {
        // console.log("Priority ", this.props.priority.title, " of column ", this.props.column.title, " did update ");
    }

    public shouldComponentUpdate(nextProps: Readonly<AllProps>) {
        // if (nextProps.name === this.props.name) {
        //     return false;
        // }
        // return true;
        if (isEqual(this.props, nextProps)) {
            return false;
        }

        console.log("Priority ", this.props.priority.title, " did update nextProps = ",
            nextProps, ", props = ", this.props);

        return true;
    }

    public render() {
        const collapsed: boolean = this.props.collapsed === true;
        const taskCount: number = this.props.tasks.length;
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
                                backgroundColor: collapsed ? `inherit` : `rgba(
                                    ${this.props.priority.backgroundColor.red},
                                    ${this.props.priority.backgroundColor.green},
                                    ${this.props.priority.backgroundColor.blue},
                                    0.2)`,
                            }}
                            className={
                                `${CONST_CSS_CLS_DRAG_SCROLL_HANDLE} ` +
                                `${collapsed ? "" : Classes.ELEVATION_1}`}
                            onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
                                this.showContextMenu(e, history);
                            }}
                            onClick={(e) => {
                                if (this.allowClickOnPriority) {
                                    this.showContextMenu(e, history);
                                }
                            }}
                            // onMouseDown={(e) => {
                            //     this.lastMouseDownTime = getEpochSecondsOfDate(new Date());
                            // }}
                            // onMouseUp={(e) => {
                            //     const currentTime = getEpochSecondsOfDate(new Date());
                            //     this.allowClickOnPriority =
                            //         currentTime - this.lastMouseDownTime < 0.3 ?
                            //         true : false;
                            // }}
                            onMouseDown={(e) => {
                                // Make sure there is no dragging has happen
                                this.lastMouseDownX = e.clientX;
                                this.lastMouseDownY = e.clientY;
                            }}
                            onMouseUp={(e) => {
                                this.allowClickOnPriority =
                                    Math.abs(e.clientX - this.lastMouseDownX) < 10 &&
                                        Math.abs(e.clientY - this.lastMouseDownY) < 10 ?
                                        true : false;
                            }}

                        // interactive={false}
                        // elevation={Elevation.ONE}
                        >
                            <H5
                                className={CONST_CSS_CLS_DRAG_SCROLL_HANDLE}
                            >
                                {this.props.priority.title} ({taskCount})
                            </H5>
                            <Droppable
                                droppableId={this.props.column.id + "|" + this.props.priority.id}
                                // type = {this.props.column.id == 'column-3' ? 'done' : 'active'}
                                type="task"
                                isDropDisabled={collapsed}
                            >
                                {(providedDrop, snapshot) => (
                                    <TaskList
                                        // droppableProps these props need to be applied to the component
                                        // that we want to drop in response to user input
                                        {...providedDrop.droppableProps}
                                        ref={providedDrop.innerRef}
                                        isDraggingOver={snapshot.isDraggingOver}
                                        className={CONST_CSS_CLS_DRAG_SCROLL_HANDLE}
                                    >
                                        <InnerList
                                            tasks={this.props.tasks}
                                            column={this.props.column}
                                            priority={this.props.priority}
                                            columnTaskIDsInPriorityOrder={this.props.columnTaskIDsInPriorityOrder}
                                            filterByUserID={this.props.filterByUserID}
                                            fillUpNumberOfTasks={this.props.fillUpNumberOfTasks}
                                            project={this.props.project}
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
    private showContextMenu = (e: React.MouseEvent<HTMLElement>, history: History<any>) => {
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
            () => {
                this.setState({ isContextMenuOpen: false });
            },
        );
        // indicate that context menu is open so we can add a CSS class to this element
        this.setState({ isContextMenuOpen: true });
    }

    private handleOpenAddNewTaskDialog = () => {
        const newUnitID = generateUUID();
        this.props.createTaskSetInput({
            title: "",
            appointees: [],
            managers: [],
            columnID: this.props.column.id,
            priorityID: this.props.priority.id,
            projectID: this.props.projectID,
            sprintID: this.props.project.currentSprint.id,
            description: "",
            // unitMap: {
            //     [newUnitID] : {
            //         id: newUnitID,
            //         title: "Complete this task",
            //         completedByUserID: "",
            //         points: 1,
            //         sprintID: this.props.project.currentSprint.id,
            //     },
            // },
            units: [{
                id: newUnitID,
                title: "Complete this task",
                completedByUserID: "",
                points: 0,
                sprintID: this.props.project.currentSprint.id,
                taskID: "",
            }],
        });
        this.props.openAddTaskDialog(true);
    }

    private handleOpenEditPriorityDialog = () => {
        // this.props.setEditPriorityState(this.props.priority);
        this.props.openEditPriorityDialog(true);
        this.props.updatePrioritySetInput({
            id: this.props.priority.id,
            title: this.props.priority.title,
            managers: this.props.priority.managers,
            projectID: this.props.projectID,
            taskIDs: this.props.priority.taskIDs,
            backgroundColor: this.props.priority.backgroundColor,
        });
        this.props.openEditPriorityDialog(true);
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ dialogs, board }: IApplicationState) => ({
    filterByUserID: board.filterByUserID,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openAddTaskDialog: (isOpen: boolean) => dispatch(dialogsActions.openAddTaskDialog(isOpen)),
    setEditPriorityState: (priority: any) => dispatch(prioritiesActions.setEditPriorityState(priority)),
    openEditPriorityDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditPriorityDialog(isOpen)),
    updatePrioritySetInput: (input: IPriorityUpdateInput) =>
        dispatch(prioritiesActions.updatePrioritySetInput(input)),
    createTaskSetInput: (input: ITaskCreateInput) =>
        dispatch(tasksActions.createTaskSetInput(input)),
    enableDragToScroll: (enableDragToScroll: boolean) =>
        dispatch(boardActions.enableDragToScroll(enableDragToScroll)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Priority);

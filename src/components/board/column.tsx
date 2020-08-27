/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Alignment,
    Button,
    Callout,
    Card,
    Classes,
    Colors,
    Dialog,
    EditableText,
    Elevation,
    H3,
    Icon,
    InputGroup,
    Intent,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    Position,
    Tag,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import React from "react";
import { Draggable, Droppable, DroppableStateSnapshot } from "react-beautiful-dnd";
import isEqual from "react-fast-compare";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as columnsActions from "../../store/columns/actions";
import { IColumn, IColumnCollapseInput, IColumnUpdateInput, IColumnUpdateTitleInput } from "../../store/columns/types";
import * as dialogsActions from "../../store/dialogs/actions";
import { IPriority } from "../../store/priorities/types";
import { IProject } from "../../store/projects/types";
import { ITask } from "../../store/tasks/types";
import { CONST_CSS_CLS_COLUMN_COLLAPSED, CONST_CSS_CLS_DRAG_SCROLL_HANDLE } from "../../utils/constants";
import { IStringTMap } from "../../utils/types";
import Priority from "./priority";
import PriorityAddButton from "./priority-add-button";

const Container = styled.div`
    margin: 8px;
    width: 325px;
    min-width: 325px;
    height: auto;
`;

const PriorityList = styled.div`
    padding: 0px;
    transition: background-color 0.2s ease;
    flex-grow: 1;
    min-height: 100px;
`;

interface InnerListProps {
    column: IColumn;
    // taskMap: IStringTMap<ITask>;
    priorityMap: IStringTMap<IPriority>;
    prioritiesOrder: string[];
    projectID: string;
    project: IProject;
    tasks: ITask[];
    columnTaskIDsMap: string[][];
    collapsed?: boolean;
}

class InnerList extends React.PureComponent<InnerListProps, {}> {
    // PureComponent do the shouldComponentUpdate automatically
    // shouldComponentUpdate(nextProps) {
    //     if (nextProps.tasks === this.props.tasks) {
    //         return false;
    //     }
    //     return true;
    // }
    public render() {
        // return this.props.tasks.map((task: any, index: number) => (
        //     <Task
        //         key={task.id}
        //         task={task}
        //         index={index}
        //     />
        // ));

        return this.props.prioritiesOrder.map((priorityID: string, index: number) => {
            const priority = this.props.priorityMap[priorityID];
            // <Continue Here>
            // const taskIDs = _.intersection(this.props.column.taskIDs, priority.taskIDs);
            // // We will filter out the one belong to the priority
            // const tasks = _.map(taskIDs, (taskID: string) => {
            //     return this.props.taskMap[taskID];
            // });
            // </Continue Here>

            const tasks = _.filter(this.props.tasks, (eachTask: ITask) => {
                return priority.taskIDs.indexOf(eachTask.id) >= 0;
            });

            // Calculate largest number of tasks currently in each priority
            let fillUpNumberOfTasks: number = 0;
            this.props.columnTaskIDsMap.map((eachColumnTaskIDs: string[]) => {
                const taskIDs = _.intersection(eachColumnTaskIDs, priority.taskIDs);
                fillUpNumberOfTasks = Math.max(taskIDs.length, fillUpNumberOfTasks);
            });

            // Build Task IDs of the column in correct order of priority
            const columnTaskIDsInPriorityOrder: string[] = [];
            this.props.prioritiesOrder.forEach((eachPriorityID: string) => {
                const eachPriority = this.props.priorityMap[eachPriorityID];
                if (eachPriority !== undefined) {
                    const taskIDsFilteredByPriority = _.intersection(this.props.column.taskIDs, eachPriority.taskIDs);
                    columnTaskIDsInPriorityOrder.push(...taskIDsFilteredByPriority);
                }
            });

            return (
                <Priority
                    key={priority.id}
                    tasks={tasks}
                    // index={index}
                    priority={priority}
                    columnTaskIDsInPriorityOrder={columnTaskIDsInPriorityOrder}
                    column={this.props.column}
                    projectID={this.props.projectID}
                    project={this.props.project}
                    fillUpNumberOfTasks={fillUpNumberOfTasks}
                    collapsed={this.props.collapsed}
                />
            );
        });
    }
}

interface IColumnState {
    collapsed: boolean;
}

interface IPropsFromState {

}

interface IPropsFromDispatch {
    openEditColumnTitleDialog: typeof dialogsActions.openEditColumnTitleDialog;
    openEditColumnDialog: typeof dialogsActions.openEditColumnDialog;
    // setEditColumnState: typeof columnsActions.setEditColumnState;
    updateColumnSetInput: typeof columnsActions.updateColumnSetInput;
    collapseColumnRequest: typeof columnsActions.collapseColumnRequest;
}

interface IOwnProps {
    // column: any;
    // tasks: any[any];
    // index: number;
    // priorities: any[any];
    // priorityOrder: string[];
    column: IColumn;
    // taskMap: IStringTMap<ITask>;
    index: number;
    priorityMap: IStringTMap<IPriority>;
    prioritiesOrder: string[];
    projectID: string;
    project: IProject;
    tasks: ITask[];
    columnTaskIDsMap: string[][];
    shouldShowStickyHeader: boolean;
    collapsed?: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class Column extends React.Component<AllProps, IColumnState> {
    public state: IColumnState = {
        collapsed: this.props.collapsed === true,
    };
    public shouldComponentUpdate(nextProps: Readonly<AllProps>, nextState: Readonly<IColumnState>) {
        // if (nextProps.name === this.props.name) {
        //     return false;
        // }
        // return true;
        if (isEqual(this.props, nextProps) && isEqual(this.state, nextState)) {
            return false;
        }

        // console.log("Column ", this.props.column.title, " did update nextProps = ",
        //     nextProps, ", props = ", this.props);
        return true;
    }

    public componentDidUpdate() {
        // console.log("Column ", this.props.column.title, " did update ");
    }

    public render() {
        // if (this.props.collapsed === true || this.props.column.title === "In progress") {
        //     return (
        //         <Container
        //             className={CONST_CSS_CLS_DRAG_SCROLL_HANDLE}
        //             style={{

        //             }}
        //         >
        //             <Callout
        //                 // intent="success"
        //                 icon={null}
        //                 style={{
        //                     display: "flex",
        //                     flexDirection: "column",
        //                     paddingTop: "0px",
        //                 }}
        //                 className={`${Classes.ELEVATION_1} ${CONST_CSS_CLS_DRAG_SCROLL_HANDLE}`}
        //             />
        //         </Container>
        //     );
        // }
        const collapsed: boolean = this.state.collapsed === true;
        const taskCount: number = this.props.column.taskIDs.length;
        return (
            <Draggable
                draggableId={this.props.column.id}
                index={this.props.index}
                isDragDisabled={collapsed}
            >
                {(provided) => (
                    <Container
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className={
                            `${CONST_CSS_CLS_DRAG_SCROLL_HANDLE} ` +
                            `${collapsed ? CONST_CSS_CLS_COLUMN_COLLAPSED : ""}`}
                    >
                        <Callout
                            // intent="success"
                            icon={null}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                paddingTop: "0px",
                                overflow: collapsed ? "hidden" : "inherit",
                            }}
                            className={`${Classes.ELEVATION_1} ${CONST_CSS_CLS_DRAG_SCROLL_HANDLE}`}
                        >
                            <Navbar
                                {...provided.dragHandleProps}
                                style={{
                                    paddingLeft: "0px",
                                    paddingRight: "0px",
                                    boxShadow: "none",
                                    backgroundColor: "transparent",
                                    display: "flex",
                                    flexDirection: "row",
                                    // overflow: `${this.state.overflowTaskBar ? "inherit" : "auto"}`,
                                }}
                                className={`hide-scroll-bar ${
                                    this.props.shouldShowStickyHeader ?
                                    "sticky-dom column-header-sticky" : ""
                                }`}
                            >
                                <NavbarGroup
                                    align={Alignment.LEFT}
                                    style={{
                                        flexGrow: 1,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Tooltip
                                        position={Position.BOTTOM_RIGHT}
                                        content={`[Click to edit] ${this.props.column.title}`}
                                    >
                                        <H3
                                            onClick={this.openEditColumnDialog}
                                            style={{
                                                marginBottom: "0px",
                                                lineHeight: "inherit",
                                                maxWidth: "100%",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {this.props.column.title}
                                        </H3>
                                    </Tooltip>
                                </NavbarGroup>
                                <NavbarGroup
                                    align={Alignment.RIGHT}
                                    style={{
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <Button
                                        icon={
                                            collapsed ?
                                            <Tooltip
                                                position={Position.BOTTOM_RIGHT}
                                                content={`${this.props.column.title} (${taskCount})`}
                                            >
                                                <Icon
                                                    icon={IconNames.CHEVRON_RIGHT}
                                                />
                                            </Tooltip>
                                            :
                                            // IconNames.CHEVRON_RIGHT :
                                            <div>
                                                <Tag
                                                    intent={Intent.NONE}
                                                    minimal={true}
                                                    style={{
                                                        lineHeight: "inherit",
                                                        fontSize: "inherit",
                                                    }}
                                                >
                                                    {taskCount}
                                                </Tag>
                                                <Icon
                                                    icon={IconNames.CHEVRON_LEFT}
                                                />
                                            </div>
                                        }
                                        minimal={true}
                                        style={{
                                            padding: "5px 2px",
                                            marginTop: "-5px",
                                            minWidth: "10px",
                                            marginLeft: collapsed ? "-4px" : "0px",
                                        }}
                                        onClick={this.handleCollapseColumn}
                                    />
                                </NavbarGroup>
                            </Navbar>
                            <PriorityList
                                // droppableProps these props need to be applied to the component
                                // that we want to drop in response to user input
                                // {...providedDrop.droppableProps}
                                // ref={providedDrop.innerRef}
                                // isDraggingOver={snapshot.isDraggingOver}
                            >
                                <InnerList
                                    // taskMap={this.props.taskMap}
                                    column={this.props.column}
                                    priorityMap={this.props.priorityMap}
                                    prioritiesOrder={this.props.prioritiesOrder}
                                    projectID={this.props.projectID}
                                    project={this.props.project}
                                    tasks={this.props.tasks}
                                    columnTaskIDsMap={this.props.columnTaskIDsMap}
                                    collapsed={collapsed}
                                />
                            </PriorityList>
                            <PriorityAddButton />
                        </Callout>
                    </Container>
                )}
            </Draggable>
        );
    }

    private openEditColumnDialog = () => {
        this.props.updateColumnSetInput({
            id: this.props.column.id,
            title: this.props.column.title,
            managers: this.props.column.managers,
            projectID: this.props.projectID,
            taskIDs: this.props.column.taskIDs,
        });
        this.props.openEditColumnDialog(true);
    }

    private handleCollapseColumn = () => {
        const collapsed = !this.state.collapsed;

        this.setState({
            collapsed,
        });

        // Send request to update on server
        this.props.collapseColumnRequest({
            id: this.props.column.id,
            collapsed,
        });
    }

    // private handleTitleChange = (title: string) => {
    //     this.setState({title});
    // }

    // private handleTitleChange = (event: React.FormEvent<HTMLElement>) => {
    //     // return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value);
    //     this.setState({title: (event.target as HTMLInputElement).value});
    // }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ board }: IApplicationState) => ({
    columnMap: board.columnMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openEditColumnTitleDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditColumnTitleDialog(isOpen)),
    openEditColumnDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditColumnDialog(isOpen)),
    // setEditColumnState: (column: any) => dispatch(columnsActions.setEditColumnState(column)),
    updateColumnSetInput: (input: IColumnUpdateInput) =>
        dispatch(columnsActions.updateColumnSetInput(input)),
    collapseColumnRequest: (input: IColumnCollapseInput) =>
        dispatch(columnsActions.collapseColumnRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Column);

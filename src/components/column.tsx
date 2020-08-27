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
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import React from "react";
import { Draggable, Droppable, DroppableStateSnapshot } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../store";
import * as columnsActions from "../store/columns/actions";
import * as dialogsActions from "../store/dialogs/actions";
import Priority from "./priority";
import PriorityAddButton from "./priorityaddbutton";

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
    priorities: any[any];
    priorityOrder: string[];
    column: any;
    tasks: any[any];
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

        return this.props.priorityOrder.map((priorityId: string, index: number) => {
            const priority = this.props.priorities[priorityId];
            const taskIds = _.intersection(this.props.column.taskIds, priority.taskIds);
            console.log(taskIds, this.props.column.id + "|" + priority.id);
            // // Pass the task of the entire column, at the Priority level
            // // we will filter out the one belong to the priority
            const tasks = _.map(taskIds, (taskId: string) => {
                return this.props.tasks[taskId];
            });
            return (
                <Priority
                    key={priority.id}
                    tasks={tasks}
                    // index={index}
                    priority={priority}
                    column={this.props.column}
                />
            );
        });
    }
}

interface IColumnState {
    title: string;
}

interface IPropsFromState {
    isOpenEditColumnTitleDialog?: boolean;
}

interface IPropsFromDispatch {
    openEditColumnTitleDialog: typeof dialogsActions.openEditColumnTitleDialog;
    openEditColumnDialog: typeof dialogsActions.openEditColumnDialog;
    setEditColumnState: typeof columnsActions.setEditColumnState;
}

interface IOwnProps {
    column: any;
    tasks: any[any];
    index: number;
    priorities: any[any];
    priorityOrder: string[];
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class Column extends React.PureComponent<AllProps> {
    public state: IColumnState = {
        title: this.props.column.title,
    };
    public render() {
        return (
            <Draggable
                draggableId={this.props.column.id}
                index={this.props.index}
            >
                {(provided) => (
                    <Container
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <Callout
                            // intent="success"
                            icon={null}
                            style={{display: "flex", flexDirection: "column", paddingTop: "0px"}}
                            className={Classes.ELEVATION_1}
                            // interactive={false}
                            // elevation={Elevation.ONE}
                        >
                            {/* <div style={{display: "flex", flexDirection: "row", height: "30px"}}>
                                <H3
                                    style={{
                                        marginBottom: "0px",
                                        lineHeight: "inherit",
                                        flexGrow: 1,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {this.props.column.title}
                                </H3>
                                <Icon
                                    // className={Classes.BUTTON}
                                    icon={IconNames.MORE}
                                    iconSize={Icon.SIZE_LARGE}
                                    style={{
                                        transform: "rotate(90deg)",
                                        verticalAlign: "top",
                                        marginRight: "-7px",
                                    }}
                                    // className={Classes.FIXED_TOP}
                                    // intent={Intent.PRIMARY}
                                    // onClick={this.showContextMenu}
                                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                                        // this.showContextMenu(e, history);
                                    }}
                                />
                            </div> */}
                            <Navbar
                                style={{
                                    paddingLeft: "0px",
                                    paddingRight: "0px",
                                    boxShadow: "none",
                                    backgroundColor: "transparent",
                                    display: "flex",
                                    flexDirection: "row",
                                    // overflow: `${this.state.overflowTaskBar ? "inherit" : "auto"}`,
                                }}
                                onMouseEnter={() => {
                                    this.setState({overflowTaskBar: true});
                                }}
                                onMouseLeave={() => {
                                    this.setState({overflowTaskBar: false});
                                }}
                                className="hide-scroll-bar"
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
                                        content={`[Click to edit] ${this.state.title}`}
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
                                            {this.state.title}
                                        </H3>
                                    </Tooltip>
                                </NavbarGroup>
                                {/* <NavbarGroup
                                    align={Alignment.RIGHT}
                                >
                                    <Icon
                                        // className={Classes.BUTTON}
                                        icon={IconNames.MORE}
                                        iconSize={Icon.SIZE_LARGE}
                                        style={{
                                            transform: "rotate(90deg)",
                                            verticalAlign: "top",
                                            marginRight: "-7px",
                                        }}
                                        // className={Classes.FIXED_TOP}
                                        // intent={Intent.PRIMARY}
                                        // onClick={this.showContextMenu}
                                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                                            // this.showContextMenu(e, history);
                                        }}
                                    />
                                </NavbarGroup> */}
                            </Navbar>
                            {/* <Droppable
                                droppableId={this.props.column.id}
                                // type = {this.props.column.id == 'column-3' ? 'done' : 'active'}
                                type="task"
                            >
                                {(providedDrop, snapshot) => ( */}
                                    <PriorityList
                                        // droppableProps these props need to be applied to the component
                                        // that we want to drop in response to user input
                                        // {...providedDrop.droppableProps}
                                        // ref={providedDrop.innerRef}
                                        // isDraggingOver={snapshot.isDraggingOver}
                                    >
                                        <InnerList
                                            tasks={this.props.tasks}
                                            column={this.props.column}
                                            priorities={this.props.priorities}
                                            priorityOrder={this.props.priorityOrder}
                                        />
                                        {/* {providedDrop.placeholder} */}
                                    </PriorityList>
                                    <PriorityAddButton />
                                {/* )} */}
                            {/* </Droppable> */}
                        </Callout>
                    </Container>
                )}
            </Draggable>
        );
    }

    private openEditColumnDialog = () => {
        this.props.setEditColumnState(this.props.column);
        this.props.openEditColumnDialog(true);
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
const mapStateToProps = ({ dialogs }: IApplicationState) => ({
    isOpenEditColumnTitleDialog: dialogs.isOpenEditColumnTitleDialog,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openEditColumnTitleDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditColumnTitleDialog(isOpen)),
    openEditColumnDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditColumnDialog(isOpen)),
    setEditColumnState: (column: any) => dispatch(columnsActions.setEditColumnState(column)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Column);

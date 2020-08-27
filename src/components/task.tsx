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
import React from "react";
import { Draggable, DraggableStateSnapshot } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Route, Router } from "react-router";
import { withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../store";
import * as dialogsActions from "../store/dialogs/actions";
import * as tasksActions from "../store/tasks/actions";
import UserImage from "./userimage";

const Container = styled.div<DraggableStateSnapshot>`
    margin-bottom: 8px;
`;

const Handle = styled.div`
    width: 20px;
    height: 20px;
    background-color: orange;
    border-radius: 4px;
    margin-right: 8px;
`;

interface ITaskState {
    overflowTaskBar: boolean;
    isContextMenuOpen: boolean;
}

interface IPropsFromState {
    boardTitle?: string;
    isOpenEditTaskDialog?: boolean;
}

interface IPropsFromDispatch {
    openEditTaskDialog: typeof dialogsActions.openEditTaskDialog;
    // setEditTaskState: typeof tasksActions.setEditTaskState;
}

interface IOwnProps {
    index: number;
    task: any;
    priority: any;
    column: any;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class Task extends React.PureComponent<AllProps, ITaskState> {
    public state: ITaskState = {
        overflowTaskBar: false,
        isContextMenuOpen: false,
    };

    private clickTimeout: any = null;

    public render() {
        return (
            <Draggable
                draggableId={this.props.task.id}
                index={this.props.index}
                // isDragDisabled = {isDragDisabled}
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
                                        this.showContextMenu(e, history);
                                    }}
                                    onClick={(e) => this.handleCardClicks(e, history)}
                                    // onClick={(e) => {
                                    //     this.showContextMenu(e, history);
                                    //     // history.push(
                                    //     //     `/projects/${this.props.task.lane.project.id}/${this.props.task.id}`,
                                    //     // );
                                    // }}
                                    // onDoubleClick={this.openEditTaskDialog}
                                    style={{
                                        borderLeftColor: `rgba(
                                            ${this.props.priority.backgroundColor.red},
                                            ${this.props.priority.backgroundColor.green},
                                            ${this.props.priority.backgroundColor.blue},
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
                                        {this.props.task.title + "[" + this.props.index + "]"}
                                    </p>
                                    <Navbar
                                        style={{
                                            paddingLeft: "5px",
                                            paddingRight: "5px",
                                            // display: "flex",
                                            // flexDirection: "row",
                                            overflow: `${this.state.overflowTaskBar ? "inherit" : "auto"}`,
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
                                                backgroundColor: `${this.state.overflowTaskBar ?
                                                    "rgba(255,,0,0,0.5)" : "inherit"}`,
                                            }}
                                        >
                                            <Tooltip
                                                position={Position.BOTTOM_RIGHT}
                                                content={`125 points (Business value: 45,
                                                    Technical difficulty: 30, Customer value: 50)`}
                                            >
                                                <Tag
                                                    intent={Intent.SUCCESS}
                                                    round={true}
                                                    large={true}
                                                    className="tag-score"
                                                    style={{
                                                        marginLeft: "5px",
                                                    }}
                                                >
                                                    125
                                                </Tag>
                                            </Tooltip>
                                            <NavbarDivider/>
                                            <UserImage
                                                sizeInPx={30}
                                                doesDisplayName={false}
                                                name="Tom"
                                                displayTooltip={true}
                                            />
                                            <UserImage
                                                sizeInPx={30}
                                                doesDisplayName={false}
                                                name="Sam"
                                                displayTooltip={true}
                                            />
                                            <NavbarDivider/>
                                            <UserImage
                                                sizeInPx={30}
                                                doesDisplayName={false}
                                                name="Tuan"
                                                displayTooltip={true}
                                            />
                                            <UserImage
                                                sizeInPx={30}
                                                doesDisplayName={false}
                                                name="Tuan"
                                                displayTooltip={true}
                                            />
                                            <UserImage
                                                sizeInPx={30}
                                                doesDisplayName={false}
                                                name="Tuan"
                                                displayTooltip={true}
                                            />
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
            console.log("single click");
            this.clickTimeout = setTimeout(() => {
                this.showContextMenu(e, history, clientX, clientY);
                // Single click
                clearTimeout(this.clickTimeout);
                this.clickTimeout = null;
            }, 150);
        }
    }

    private showContextMenu = (
        e: React.MouseEvent<HTMLDivElement>,
        history: History<any>,
        clientX?: number,
        clientY?: number,
    ) => {
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
                    icon={IconNames.APPLICATION}
                    text="Open"
                    onClick={() => {
                        history.push(
                            `/projects/${this.props.task.lane.project.id}/${this.props.task.id}`,
                        );
                    }}
                />
                <MenuItem
                    icon={IconNames.APPLICATION}
                    text="Open in dialog"
                    onClick={this.openEditTaskDialog}
                />
                <MenuItem icon={IconNames.APPLICATIONS} text="Open in new tab" onClick={this.openInNewTab}/>
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
                <MenuItem icon={IconNames.REMOVE}  text="Remove" />
                {/* <MenuItem disabled={true} text="Clicked on node" /> */}
            </Menu>,
            { left: clientX ? clientX : e.clientX, top: clientY ? clientY : e.clientY },
            () => this.setState({ isContextMenuOpen: false }),
        );
        // indicate that context menu is open so we can add a CSS class to this element
        this.setState({ isContextMenuOpen: true });
    }

    private openEditTaskDialog = () => {
        // this.props.setEditTaskState(this.props.column, this.props.priority, this.props.task);
        this.props.openEditTaskDialog(true);
    }

    private openInNewTab = () => {
        window.open(`/projects/${this.props.task.lane.project.id}/${this.props.task.id}`);
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar, dialogs }: IApplicationState) => ({
    boardTitle: navbar.boardTitle,
    isOpenEditTaskDialog: dialogs.isOpenEditTaskDialog,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openEditTaskDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditTaskDialog(isOpen)),
    // setEditTaskState: (column: any, priority: any, task: any) =>
    //     dispatch(tasksActions.setEditTaskState(column, priority, task)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Task);

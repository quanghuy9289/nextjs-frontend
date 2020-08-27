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
import {
    IAddOrRemoveTaskAppointeeInput,
    IAddOrRemoveTaskManagerInput,
    ITask,
    ITaskUpdateInput,
} from "../../store/tasks/types";
import * as usersActions from "../../store/users/actions";
import { IUser } from "../../store/users/types";
import { CONST_CSS_CLS_DRAG_SCROLL_HANDLE } from "../../utils/constants";
import { IStringTMap } from "../../utils/types";
import UserAddButton from "../useraddbutton";
import UserImage from "../userimage";

const Container = styled.div<DraggableStateSnapshot>`
    margin-bottom: 0px;
    min-height: 0px;
    max-height: 0px;
`;

interface ITaskState {

}

interface IPropsFromState {

}

interface IPropsFromDispatch {

}

interface IOwnProps {
    index: number;
    taskID: string;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class TaskEmptyThinDraggable extends React.PureComponent<AllProps, ITaskState> {
    public state: ITaskState = {
        overflowTaskBar: false,
        // isContextMenuOpen: false,
    };

    public render() {
        return (
            // <Draggable
            //     draggableId={this.props.index + "-empty-task"}
            //     index={this.props.index}
            //     isDragDisabled={true}
            // >
            //     {(provided, snapshot) => (
            //         // provided Draggable component require its children
            //         // to be a function, the parameter is a provided object
            //         // snapshot the component during Drag
            //         <Container
            //             // draggableProps these props need to be applied to the
            //             // component that we want to move around in response to user input
            //             {...provided.draggableProps}
            //             // dragHandleProps Need to apply to the path of the
            //             // component that we want to use to be able to control
            //             // the entire component, and you can use this to drag a
            //             // large item by just a small part of it, for this application
            //             // we want the whole task to be draggble so we are going to
            //             // apply these props to the same element
            //             {...provided.dragHandleProps}
            //             ref={provided.innerRef}
            //             isDragging={snapshot.isDragging}
            //             isDropAnimating={true}
            //             // isDragDisabled = {isDragDisabled}
            //         />
            //     )}
            // </Draggable>
            <Draggable
                draggableId={this.props.taskID}
                index={this.props.index}
                isDragDisabled={true}
            >
                {(provided, snapshot) => (
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
                        className={CONST_CSS_CLS_DRAG_SCROLL_HANDLE}
                    />
                )}
            </Draggable>
        );
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ board, users }: IApplicationState) => ({

});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TaskEmptyThinDraggable);

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
import Task from "./task";
import TaskDetailPanel from "./taskdetailpanel";

const Container = styled.div`
    width: 300px;
    margin-bottom: 5px;
    margin-top: 2px;
    min-width: 300px;
    height: auto;
`;

interface IPriorityAddButtonState {

}

interface IPropsFromState {
    isOpenAddTaskDialog?: boolean;
}

interface IPropsFromDispatch {
    openAddPriorityDialog: typeof dialogsActions.openAddPriorityDialog;
}

interface IOwnProps {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class PriorityAddButton extends React.PureComponent<AllProps, IPriorityAddButtonState> {
    public state: IPriorityAddButtonState = {

    };

    public render() {
        return (
            <Container>
                <Route
                    render={({ history }) => (
                        <Button
                            active={true}
                            icon={IconNames.PLUS}
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                            onClick={(e) => this.showContextMenu(e, history)}
                        />
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
                <MenuItem
                    icon={IconNames.ADD}
                    text="New priority"
                    onClick={this.handleOpenAddPriorityDialog}
                />
                <MenuItem
                    icon={IconNames.SORT}
                    text="Arrange priorities"
                // onClick={this.handleOpenAddNewTaskDialog}
                />
            </Menu>,
            { left: e.clientX, top: e.clientY },
            () => this.setState({ isContextMenuOpen: false }),
        );
        // indicate that context menu is open so we can add a CSS class to this element
        this.setState({ isContextMenuOpen: true });
    }

    private handleOpenAddPriorityDialog = () => {
        this.props.openAddPriorityDialog(true);
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
    openAddPriorityDialog: (isOpen: boolean) => dispatch(dialogsActions.openAddPriorityDialog(isOpen)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PriorityAddButton);

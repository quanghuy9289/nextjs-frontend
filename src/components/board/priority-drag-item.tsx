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
import { Droppable, DroppableStateSnapshot } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Route } from "react-router";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import { IColumn } from "../../store/columns/types";
import * as dialogsActions from "../../store/dialogs/actions";
import * as prioritiesActions from "../../store/priorities/actions";
import { IPriority, IPriorityUpdateInput } from "../../store/priorities/types";
import * as tasksActions from "../../store/tasks/actions";
import { ITask } from "../../store/tasks/types";
import { IStringTMap } from "../../utils/types";
import Task from "../task";

const Container = styled.div`
    width: 300px;
    margin-bottom: 5px;
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;
    min-width: 300px;
    height: auto;
`;

const TaskList = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    flex-grow: 1;
    min-height: 100px;
`;

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
    updatePrioritySetInput: typeof prioritiesActions.updatePrioritySetInput;
}

interface IOwnProps {
    tasks: ITask[];
    priority: IPriority;
    column: IColumn;
    projectID: string;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class PriorityDragItem extends React.Component<AllProps, IPriorityState> {
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
                        // interactive={false}
                        // elevation={Elevation.ONE}
                        >
                            <H5>
                                {this.props.priority.title}
                            </H5>
                            <TaskList />
                        </Callout>
                    )}
                />
            </Container>
        );
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
const mapStateToProps = ({ dialogs }: IApplicationState) => ({
    isOpenEditTaskDialog: dialogs.isOpenEditTaskDialog,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openAddTaskDialog: (isOpen: boolean) => dispatch(dialogsActions.openAddTaskDialog(isOpen)),
    setEditPriorityState: (priority: any) => dispatch(prioritiesActions.setEditPriorityState(priority)),
    openEditPriorityDialog: (isOpen: boolean) => dispatch(dialogsActions.openEditPriorityDialog(isOpen)),
    updatePrioritySetInput: (input: IPriorityUpdateInput) =>
        dispatch(prioritiesActions.updatePrioritySetInput(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PriorityDragItem);

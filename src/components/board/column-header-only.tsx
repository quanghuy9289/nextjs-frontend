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
import isEqual from "react-fast-compare";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as columnsActions from "../../store/columns/actions";
import { IColumn, IColumnUpdateInput, IColumnUpdateTitleInput } from "../../store/columns/types";
import * as dialogsActions from "../../store/dialogs/actions";
import { IPriority } from "../../store/priorities/types";
import { IProject } from "../../store/projects/types";
import { ITask } from "../../store/tasks/types";
import { CONST_CSS_CLS_DRAG_SCROLL_HANDLE } from "../../utils/constants";
import { IStringTMap } from "../../utils/types";
import Priority from "./priority";
import PriorityAddButton from "./priority-add-button";

const Container = styled.div`
    margin: 8px;
    width: 325px;
    min-width: 325px;
    height: auto;
`;

interface IPropsFromState {

}

interface IPropsFromDispatch {
    openEditColumnTitleDialog: typeof dialogsActions.openEditColumnTitleDialog;
    openEditColumnDialog: typeof dialogsActions.openEditColumnDialog;
    // setEditColumnState: typeof columnsActions.setEditColumnState;
    updateColumnSetInput: typeof columnsActions.updateColumnSetInput;
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
    projectID: string;
    project: IProject;
    tasks: ITask[];
    columnTaskIDsMap: string[][];
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class ColumnHeaderOnly extends React.Component<AllProps> {
    public shouldComponentUpdate(nextProps: Readonly<AllProps>) {
        // if (nextProps.name === this.props.name) {
        //     return false;
        // }
        // return true;
        if (isEqual(this.props, nextProps)) {
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
        return (
            <Draggable
                draggableId={this.props.column.id}
                index={this.props.index}
            >
                {(provided) => (
                    <Container
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        <Callout
                            // intent="success"
                            icon={null}
                            style={{display: "flex", flexDirection: "column", paddingTop: "0px"}}
                            className={`${Classes.ELEVATION_1} ${CONST_CSS_CLS_DRAG_SCROLL_HANDLE}`}
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
                            </Navbar>
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
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ColumnHeaderOnly);

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
    EditableText,
    FormGroup,
    H1,
    InputGroup,
    Intent,
    Popover,
    Position,
    Slider,
    Spinner,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as boardActions from "../../store/board/actions";
import * as columnsActions from "../../store/columns/actions";
import {
    IAddColumnState,
    IAddOrRemoveColumnManagerInput,
    IColumn,
    IColumnCommonResult,
    IColumnCreateInput,
    IColumnUpdateInput,
    IColumnUpdateTitleInput,
    IEditColumnState,
} from "../../store/columns/types";
import * as prioritiesActions from "../../store/priorities/actions";
import { IPriority, IPriorityUpdateSortOrderInput } from "../../store/priorities/types";
import * as usersActions from "../../store/users/actions";
import { IUser } from "../../store/users/types";
import { IStringTMap } from "../../utils/types";
import ColumnDetailPanelSelectColumnContextMenu from "../context-menus/taskdetailpanelselectcolumn";
import ColumnDetailPanelSelectPriorityContextMenu from "../context-menus/taskdetailpanelselectpriority";
import RippleEditor from "../editor";
import UserAddButton from "../useraddbutton";
import UserImage from "../userimage";
import Priority from "./priority";
import PriorityDragItem from "./priority-drag-item";

const Container = styled.div`
    // display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-left: 20px;
    padding-top: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    overflow: auto;
`;

const PrioritiesContainer = styled.div`
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 100%;
    height: 190px;
    display: flex;
    flex-direction: row;
    overflow: auto;
    justify-content: normal !important;
`;

interface IColumnDetailState {

}

interface IPropsFromState {
    createColumnInput: IColumnCreateInput;
    createColumnResult: IColumnCommonResult;
    updateColumnInput: IColumnUpdateInput;
    updateColumnResult: IColumnCommonResult;
    userMap: IStringTMap<IUser>;
    getUsersLoading: boolean;
    projectID: string;
    prioritiesOrder: string[];
    priorityMap: IStringTMap<IPriority>;
    columnMap: IStringTMap<IColumn>;
}

interface IPropsFromDispatch {
    createColumnSetInput: typeof columnsActions.createColumnSetInput;
    // setEditColumnState: typeof columnsActions.setEditColumnState;
    updateColumnSetInput: typeof columnsActions.updateColumnSetInput;
    getUsers: typeof usersActions.getUsers;
    updateColumnTitleRequest: typeof columnsActions.updateColumnTitleRequest;
    insertOrUpdateColumnBoard: typeof boardActions.insertOrUpdateColumnBoard;
    addOrRemoveColumnManagerRequest: typeof columnsActions.addOrRemoveColumnManagerRequest;
    setPrioritiesOrder: typeof boardActions.setPrioritiesOrder;
    updatePrioritySortOrderRequest: typeof prioritiesActions.updatePrioritySortOrderRequest;
}

interface IOwnProps {
    isAdd: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class ColumnDetailPanel extends React.PureComponent<AllProps> {

    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        if (!this.props.isAdd) {
            _.map(this.props.updateColumnInput.managers, (eachUserID: string) => {
                const eachUser = this.props.userMap[eachUserID];
                if (eachUser === undefined) {
                    if (!this.props.getUsersLoading) {
                        this.props.getUsers();
                    }
                }
            });
        } else {
            // Set the project ID for create column input
            this.props.createColumnSetInput({
                ...this.props.createColumnInput,
                projectID: this.props.projectID,
            });
        }
    }

    public onDragStart = (result: any) => {
        // To do
    }

    public onDragUpdate = (update: any) => {
        // To do
    }

    public onDragEnd = (result: any) => {
        // To do
        const { destination, source, draggableId, type } = result;
        // Check if there is destination
        if (!destination) {
            return;
        }
        // Check if the location is the same
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === "priority-drag-item") {
            const newPrioritiesOrder = Array.from(this.props.prioritiesOrder);
            // Removing the old column id
            newPrioritiesOrder.splice(source.index, 1);
            // Add the new column id
            newPrioritiesOrder.splice(destination.index, 0, draggableId);
            // Set new column order
            const currentNewIndex: number = newPrioritiesOrder.indexOf(draggableId);
            const afterPriorityID: string | undefined = newPrioritiesOrder[currentNewIndex - 1];
            const beforePriorityID: string | undefined = newPrioritiesOrder[currentNewIndex + 1];
            this.props.setPrioritiesOrder(newPrioritiesOrder);
            // Request server to update as well
            this.props.updatePrioritySortOrderRequest({
                id: draggableId,
                beforePriorityID,
                afterPriorityID,
            });

            return;
        }
    }

    public render() {
        // const column: IColumn = this.props.isAdd ?
        // this.props.addColumnState.column :
        // this.props.editColumnState.column;
        const managers: string[] = this.props.isAdd ?
            this.props.createColumnInput.managers :
            this.props.updateColumnInput.managers;

        const title = this.props.isAdd ?
            this.props.createColumnInput.title :
            this.props.updateColumnInput.title;
        return (
            <Container>
                {this.props.createColumnResult.errors === undefined ?
                    (<div />) :
                    (<Callout
                        intent={Intent.DANGER}
                        style={{ marginBottom: "20px" }}
                    >
                        Can not create your column. Error: {this.props.createColumnResult.errors}
                    </Callout>
                    )
                }
                {this.props.createColumnResult.id === undefined ?
                    (
                        <div>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Title"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                <H1>
                                    <EditableText
                                        multiline={false}
                                        minLines={1}
                                        maxLines={1}
                                        value={title}
                                        confirmOnEnterKey={true}
                                        selectAllOnFocus={true}
                                        placeholder="Column title..."
                                        onChange={this.onChangeTitleInput}
                                    />
                                </H1>
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Column managers"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                {
                                    managers.map((userID: string, index: number) => {
                                        const eachUser: IUser | undefined = this.props.userMap[userID];
                                        return (
                                            <UserImage
                                                key={userID}
                                                name={_.isUndefined(eachUser) ? "..." : eachUser.nickname}
                                                imgSource={_.isUndefined(eachUser) ? undefined : eachUser.avatarBase64}
                                                userID={userID}
                                                onRemoveUser={this.onRemoveProjectManager}
                                            />
                                        );
                                    })
                                }
                                <UserAddButton
                                    excludeMembers={managers}
                                    onSelectUser={this.onAddColumnManager}
                                    usePortal={false}
                                />
                            </FormGroup>
                            {!this.props.isAdd ?
                                <FormGroup
                                    // helperText="Helper text with details..."
                                    label="Priorities arrangement"
                                    labelFor="text-input"
                                // labelInfo="(required)"
                                >
                                    <DragDropContext
                                        onDragStart={this.onDragStart}
                                        onDragUpdate={this.onDragUpdate}
                                        onDragEnd={this.onDragEnd}
                                    >
                                        <Droppable
                                            droppableId="all-priority-drag-items"
                                            direction="horizontal"
                                            type="priority-drag-item"
                                        >
                                            {(provided) => (
                                                <PrioritiesContainer
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={`${Classes.BUTTON} ${Classes.ACTIVE}`}
                                                >
                                                    {this.props.prioritiesOrder.map((priorityID: string, index: number) => {
                                                        const priority = this.props.priorityMap[priorityID];
                                                        const column =
                                                            this.props.columnMap[this.props.updateColumnInput.id];
                                                        return (
                                                            <Draggable
                                                                key={priority.id}
                                                                draggableId={priority.id}
                                                                index={index}
                                                            >
                                                                {(providedDraggable) => (
                                                                    <div
                                                                        {...providedDraggable.draggableProps}
                                                                        {...providedDraggable.dragHandleProps}
                                                                        ref={providedDraggable.innerRef}
                                                                    >
                                                                        <PriorityDragItem
                                                                            key={priority.id}
                                                                            tasks={[]}
                                                                            // index={index}
                                                                            priority={priority}
                                                                            column={column}
                                                                            projectID={this.props.projectID}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        );
                                                    })}
                                                    <div
                                                        style={{
                                                            minWidth: "100px",
                                                            height: "100%",
                                                        }}
                                                    />
                                                </PrioritiesContainer>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </FormGroup> :
                                null
                            }
                        </div>
                    ) :
                    (<Callout
                        intent={Intent.SUCCESS}
                    >
                        Column is added successfully
                    </Callout>
                    )
                }
            </Container>
        );
    }

    private onChangeTitleInput = (value: string) => {
        // this.props.setRegisterInput(e.target.value, this.props.password);
        if (this.props.isAdd) {
            this.props.createColumnSetInput({
                ...this.props.createColumnInput,
                title: value,
            });
        } else {
            this.props.updateColumnSetInput({
                ...this.props.updateColumnInput,
                title: value,
            });

            this.props.insertOrUpdateColumnBoard({
                id: this.props.updateColumnInput.id,
                managers: this.props.updateColumnInput.managers,
                taskIDs: this.props.updateColumnInput.taskIDs,
                title: value,
            });

            this.props.updateColumnTitleRequest({
                id: this.props.updateColumnInput.id,
                title: value,
            });
        }
    }

    private onAddColumnManager = (selectedUser: IUser) => {
        if (this.props.isAdd) {
            this.props.createColumnSetInput({
                ...this.props.createColumnInput,
                managers: [...this.props.createColumnInput.managers, selectedUser.id],
            });
        } else {
            const managers = [...this.props.updateColumnInput.managers, selectedUser.id];
            this.props.updateColumnSetInput({
                ...this.props.updateColumnInput,
                managers,
            });

            this.props.insertOrUpdateColumnBoard({
                id: this.props.updateColumnInput.id,
                managers,
                taskIDs: this.props.updateColumnInput.taskIDs,
                title: this.props.updateColumnInput.title,
            });

            this.props.addOrRemoveColumnManagerRequest({
                id: this.props.updateColumnInput.id,
                isAdd: true,
                managerUserID: selectedUser.id,
            });
        }
    }

    private onRemoveProjectManager = (userID: string) => {
        if (this.props.isAdd) {
            this.props.createColumnSetInput({
                ...this.props.createColumnInput,
                managers: _.remove(
                    this.props.createColumnInput.managers,
                    (eachUserID: string) => {
                        return eachUserID !== userID;
                    }),
            });
        } else {
            const managers = _.remove(
                this.props.updateColumnInput.managers,
                (eachUserID: string) => {
                    return eachUserID !== userID;
                });

            this.props.updateColumnSetInput({
                ...this.props.updateColumnInput,
                managers,
            });

            this.props.insertOrUpdateColumnBoard({
                id: this.props.updateColumnInput.id,
                managers,
                taskIDs: this.props.updateColumnInput.taskIDs,
                title: this.props.updateColumnInput.title,
            });

            this.props.addOrRemoveColumnManagerRequest({
                id: this.props.updateColumnInput.id,
                isAdd: false,
                managerUserID: userID,
            });
        }
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ columns, users, board }: IApplicationState) => ({
    createColumnInput: columns.createColumnInput,
    createColumnResult: columns.createColumnResult,
    updateColumnInput: columns.updateColumnInput,
    updateColumnResult: columns.updateColumnResult,
    userMap: users.userMap,
    getUsersLoading: users.loading,
    projectID: board.projectID,
    prioritiesOrder: board.prioritiesOrder,
    priorityMap: board.priorityMap,
    columnMap: board.columnMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    createColumnSetInput: (input: IColumnCreateInput) =>
        dispatch(columnsActions.createColumnSetInput(input)),
    updateColumnSetInput: (input: IColumnUpdateInput) =>
        dispatch(columnsActions.updateColumnSetInput(input)),
    getUsers: () =>
        dispatch(usersActions.getUsers()),
    updateColumnTitleRequest: (input: IColumnUpdateTitleInput) =>
        dispatch(columnsActions.updateColumnTitleRequest(input)),
    insertOrUpdateColumnBoard: (column: IColumn) =>
        dispatch(boardActions.insertOrUpdateColumnBoard(column)),
    addOrRemoveColumnManagerRequest: (input: IAddOrRemoveColumnManagerInput) =>
        dispatch(columnsActions.addOrRemoveColumnManagerRequest(input)),
    setPrioritiesOrder: (prioritiesOrder: string[]) =>
        dispatch(boardActions.setPrioritiesOrder(prioritiesOrder)),
    updatePrioritySortOrderRequest: (input: IPriorityUpdateSortOrderInput) =>
        dispatch(prioritiesActions.updatePrioritySortOrderRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ColumnDetailPanel);

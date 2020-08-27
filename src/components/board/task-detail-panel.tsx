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
    Checkbox,
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
    Tag,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import dateFormat from "dateformat";
import _ from "lodash";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import TaskDetailPanelSelectColumnContextMenu from "../../components/context-menus/taskdetailpanelselectcolumn";
import TaskDetailPanelSelectPriorityContextMenu from "../../components/context-menus/taskdetailpanelselectpriority";
import { IApplicationState } from "../../store";
import * as boardActions from "../../store/board/actions";
import { IColumn } from "../../store/columns/types";
import * as commentsActions from "../../store/comments/actions";
import {
    IComment,
    ICommentCommonResult,
    ICommentCreateInput,
    ICommentDeleteInput,
    ICommentGetResultSimple,
    IDraftJSEditorStateJSON,
    IDraftJSEntity,
    IDraftJSMentionData,
} from "../../store/comments/types";
import * as loginsActions from "../../store/logins/actions";
import { IActiveUserProfile, IEmailNotificationInput } from "../../store/logins/types";
import * as prioritiesActions from "../../store/priorities/actions";
import { IPriority, IPriorityUpdateSortOrderInput } from "../../store/priorities/types";
import { IProject } from "../../store/projects/types";
import { ISprint } from "../../store/sprints/types";
import * as taskdescriptionsActions from "../../store/taskdescriptions/actions";
import { ITaskDescription, ITaskDescriptionUpdateContentInput } from "../../store/taskdescriptions/types";
import * as tasksActions from "../../store/tasks/actions";
import {
    IAddOrRemoveTaskAppointeeInput,
    IAddOrRemoveTaskManagerInput,
    IAddTaskState,
    IAddTaskUnitInput,
    IEditTaskState,
    IRemoveTaskUnitInput,
    ITask,
    ITaskCommonResult,
    ITaskCreateInput,
    ITaskUpdateDescriptionInput,
    ITaskUpdateInput,
    ITaskUpdateSortOrderInput,
    ITaskUpdateTitleInput,
} from "../../store/tasks/types";
import * as unitsActions from "../../store/units/actions";
import {
    IUnit,
    IUnitCompleteInput,
    IUnitUpdatePointsInput,
    IUnitUpdateSortOrderInput,
    IUnitUpdateTitleInput,
    UnitsActionTypes,
} from "../../store/units/types";
import * as usersActions from "../../store/users/actions";
import { IUser } from "../../store/users/types";
import { CONST_DRAFTJS_ENTITY_TYPE_MENTION } from "../../utils/constants";
import { getMentionedUserIDsFromDraftJSRawState } from "../../utils/data";
import { getDateFromUTCEpoch, getEpochSecondsOfDate } from "../../utils/dates";
import {
    generateUUID,
    getDraftJSEditorJSONStringFromText,
    getHostAndProtocol,
    getUserPresentationName,
} from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import RippleEditor from "../editor";
import UserAddButton from "../useraddbutton";
import UserImage from "../userimage";
import Priority from "./priority";
import PriorityDragItem from "./priority-drag-item";
import UnitItem from "./unit-item";

const Container = styled.div`
    // display: flex;
    flex-direction: task;
    flex-grow: 1;
    padding-left: 20px;
    padding-top: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    overflow: auto;
`;

const UnitContainer = styled.div`
    padding-left: 20px;
    padding-right: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 100%;
`;

const AddUnitContainer = styled.div`
    ${"" /* padding: 8px;*/}
    margin-bottom: 8px;
    margin-top: 0px;
    padding-left: 20px;
`;

interface ITaskDetailState {
    value1: number;
    value2: number;
    value3: number;
}

interface IPropsFromState {
    createTaskInput: ITaskCreateInput;
    createTaskResult: ITaskCommonResult;
    updateTaskInput: ITaskUpdateInput;
    updateTaskResult: ITaskCommonResult;
    userMap: IStringTMap<IUser>;
    getUsersLoading: boolean;
    projectID: string;
    prioritiesOrder: string[];
    priorityMap: IStringTMap<IPriority>;
    columnMap: IStringTMap<IColumn>;
    taskMap: IStringTMap<ITask>;
    unitMap: IStringTMap<IUnit>;
    sprintMap: IStringTMap<ISprint>;
    taskDescriptionMap: IStringTMap<ITaskDescription>;
    commentMap: IStringTMap<IComment[]>;
    addTaskUnitLoading: boolean;
    createCommentInput: ICommentCreateInput;
    createCommentLoading: boolean;
    createCommentResult: ICommentCommonResult;
    activeUserProfile: IActiveUserProfile;
    currentProject: IProject;
    getOlderCommentsOfTaskLoading: boolean;
    getOlderCommentsOfTaskResult: ICommentGetResultSimple;
}

interface IPropsFromDispatch {
    createTaskSetInput: typeof tasksActions.createTaskSetInput;
    // setEditTaskState: typeof tasksActions.setEditTaskState;
    updateTaskSetInput: typeof tasksActions.updateTaskSetInput;
    getUsers: typeof usersActions.getUsers;
    updateTaskTitleRequest: typeof tasksActions.updateTaskTitleRequest;
    updateTaskDescriptionRequest: typeof tasksActions.updateTaskDescriptionRequest;
    insertOrUpdateTaskBoard: typeof boardActions.insertOrUpdateTaskBoard;
    insertOrUpdateUnitBoard: typeof boardActions.insertOrUpdateUnitBoard;
    insertOrUpdateTaskDescriptionBoard: typeof boardActions.insertOrUpdateTaskDescriptionBoard;
    addOrRemoveTaskManagerRequest: typeof tasksActions.addOrRemoveTaskManagerRequest;
    addOrRemoveTaskAppointeeRequest: typeof tasksActions.addOrRemoveTaskAppointeeRequest;
    removeTaskUnitRequest: typeof tasksActions.removeTaskUnitRequest;
    addTaskUnitRequest: typeof tasksActions.addTaskUnitRequest;
    setPrioritiesOrder: typeof boardActions.setPrioritiesOrder;
    updatePrioritySortOrderRequest: typeof prioritiesActions.updatePrioritySortOrderRequest;
    getUnitRequest: typeof unitsActions.getUnitRequest;
    getTaskDescriptionRequest: typeof taskdescriptionsActions.getTaskDescriptionRequest;
    getCommentRequest: typeof commentsActions.getCommentRequest;
    getCommentsOfTaskRequest: typeof commentsActions.getCommentsOfTaskRequest;
    updateTaskDescriptionContentRequest: typeof taskdescriptionsActions.updateTaskDescriptionContentRequest;
    updateUnitTitleRequest: typeof unitsActions.updateUnitTitleRequest;
    updateUnitPointsRequest: typeof unitsActions.updateUnitPointsRequest;
    updateUnitSortOrderRequest: typeof unitsActions.updateUnitSortOrderRequest;
    createCommentSetInput: typeof commentsActions.createCommentSetInput;
    createCommentRequest: typeof commentsActions.createCommentRequest;
    deleteCommentRequest: typeof commentsActions.deleteCommentRequest;
    deleteCommentFromBoard: typeof boardActions.deleteCommentFromBoard;
    completeUnitRequest: typeof unitsActions.completeUnitRequest;
    sendEmailNotificationRequest: typeof loginsActions.sendEmailNotificationRequest;
    getNewerCommentsOfTaskRequest: typeof commentsActions.getNewerCommentsOfTaskRequest;
    getOlderCommentsOfTaskRequest: typeof commentsActions.getOlderCommentsOfTaskRequest;
    getOlderCommentsOfTaskSetResult: typeof commentsActions.getOlderCommentsOfTaskSetResult;
    insertOrUpdateColumnBoard: typeof boardActions.insertOrUpdateColumnBoard;
    insertOrUpdatePriorityBoard: typeof boardActions.insertOrUpdatePriorityBoard;
    updateTaskSortOrderRequest: typeof tasksActions.updateTaskSortOrderRequest;
}

interface IOwnProps {
    isAdd: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class TaskDetailPanel extends React.PureComponent<AllProps, ITaskDetailState> {
    public state: ITaskDetailState = {
        value1: 5,
        value2: 7,
        value3: 7,
    };

    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        if (!this.props.isAdd) {
            // Load users
            _.map(this.props.updateTaskInput.managers, (eachUserID: string) => {
                const eachUser = this.props.userMap[eachUserID];
                if (eachUser === undefined) {
                    if (!this.props.getUsersLoading) {
                        this.props.getUsers();
                    }
                }
            });

            // Load units
            _.map(this.props.updateTaskInput.units, (eachUnitID: string) => {
                const eachUnit = this.props.unitMap[eachUnitID];
                if (eachUnit === undefined) {
                    this.props.getUnitRequest(eachUnitID);
                }
            });

            // Load description
            if (this.props.taskDescriptionMap[this.props.updateTaskInput.id] === undefined) {
                this.props.getTaskDescriptionRequest(this.props.updateTaskInput.id);
            }

            // Load comments
            if (this.props.commentMap[this.props.updateTaskInput.id] === undefined ||
                this.props.commentMap[this.props.updateTaskInput.id].length === 0) {
                this.props.getOlderCommentsOfTaskRequest(this.props.updateTaskInput.id, 0);
            } else {
                // Perform load newer comments if have
                const firstComment: IComment = this.props.commentMap[this.props.updateTaskInput.id][0];
                if (firstComment !== undefined) {
                    this.props.getNewerCommentsOfTaskRequest(this.props.updateTaskInput.id, firstComment.createdOn);
                }

                // Also load more older comments of needed
                this.handleLoadMoreOlderComments();
            }

            // Reset comment input
            this.props.createCommentSetInput({
                content: "",
                taskID: this.props.updateTaskInput.id,
                plain: "",
            });
        } else {
            // Set the project ID for create task input
            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                projectID: this.props.projectID,
            });
        }
    }

    public componentWillUnmount() {
        // Reset the result
        this.props.getOlderCommentsOfTaskSetResult({
            errors: undefined,
            hasMore: undefined,
            taskID: undefined,
        });
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
            // Removing the old task id
            newPrioritiesOrder.splice(source.index, 1);
            // Add the new task id
            newPrioritiesOrder.splice(destination.index, 0, draggableId);
            // Set new task order
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
        const priority: IPriority | undefined = this.props.isAdd ?
            this.props.priorityMap[this.props.createTaskInput.priorityID] :
            this.props.priorityMap[this.props.updateTaskInput.priorityID];

        const column: IColumn | undefined = this.props.isAdd ?
            this.props.columnMap[this.props.createTaskInput.columnID] :
            this.props.columnMap[this.props.updateTaskInput.columnID];

        const managers: string[] = this.props.isAdd ?
            this.props.createTaskInput.managers :
            this.props.updateTaskInput.managers;

        const appointees: string[] = this.props.isAdd ?
            this.props.createTaskInput.appointees :
            this.props.updateTaskInput.appointees;

        const title = this.props.isAdd ?
            this.props.createTaskInput.title :
            this.props.updateTaskInput.title;

        const units = this.props.isAdd ?
            this.props.createTaskInput.units :
            this.props.updateTaskInput.units;
        return (
            <Container>
                {this.props.createTaskResult.errors === undefined ?
                    (<div />) :
                    (<Callout
                        intent={Intent.DANGER}
                        style={{ marginBottom: "20px" }}
                    >
                        Can not create your task. Error: {this.props.createTaskResult.errors}
                    </Callout>
                    )
                }
                {this.props.createTaskResult.id === undefined ?
                    (
                        <div
                            style={{
                                marginBottom: "70px",
                            }}
                        >
                            {!this.props.isAdd ?
                                <FormGroup
                                    // helperText="Helper text with details..."
                                    label="ID"
                                    labelFor="text-input"
                                // labelInfo="(required)"
                                >
                                    <InputGroup
                                        disabled={true}
                                        // large={true}
                                        value={this.props.updateTaskInput.id}
                                    />
                                </FormGroup> : null}
                            {!this.props.isAdd ?
                                <FormGroup
                                    // helperText="Helper text with details..."
                                    label="Code"
                                    labelFor="text-input"
                                // labelInfo="(required)"
                                >
                                    <InputGroup
                                        disabled={true}
                                        // large={true}
                                        value={this.props.updateTaskInput.incrementcode + ""}
                                    />
                                </FormGroup> : null}
                            {!this.props.isAdd ?
                                <FormGroup
                                    // helperText="Helper text with details..."
                                    label="Created on"
                                    labelFor="text-input"
                                // labelInfo="(required)"
                                >
                                    <InputGroup
                                        disabled={true}
                                        // large={true}
                                        value={getDateFromUTCEpoch(this.props.updateTaskInput.createdOn) + ""}
                                    />
                                </FormGroup> : null}
                            {!this.props.isAdd ?
                                <FormGroup
                                    // helperText="Helper text with details..."
                                    label="Created by"
                                    labelFor="text-input"
                                // labelInfo="(required)"
                                >
                                    <InputGroup
                                        disabled={true}
                                        // large={true}
                                        value={
                                            getUserPresentationName(
                                                this.props.userMap[this.props.updateTaskInput.createdByUserID],
                                            )
                                        }
                                    />
                                </FormGroup> : null}
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
                                        placeholder="Task title..."
                                        onChange={this.onChangeTitleInput}
                                    />
                                </H1>
                                {/* <InputGroup
                                    disabled={false}
                                    large={true}
                                    // leftIcon="filter"
                                    // onChange={this.handleTitleChange}
                                    placeholder="Task title..."
                                    // rightElement={maybeSpinner}
                                    // small={small}
                                    value="Doing something"
                                /> */}
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Appointees"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                {
                                    appointees.map((userID: string, index: number) => {
                                        const eachUser: IUser | undefined = this.props.userMap[userID];
                                        return (
                                            <UserImage
                                                key={userID}
                                                name={_.isUndefined(eachUser) ? "..." : eachUser.nickname}
                                                imgSource={_.isUndefined(eachUser) ? undefined : eachUser.avatarBase64}
                                                userID={userID}
                                                onRemoveUser={this.onRemoveTaskAppointee}
                                            />
                                        );
                                    })
                                }
                                <UserAddButton
                                    excludeMembers={appointees}
                                    onSelectUser={this.onAddTaskAppointee}
                                    usePortal={false}
                                />
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Task managers"
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
                                                onRemoveUser={this.onRemoveTaskManager}
                                            />
                                        );
                                    })
                                }
                                <UserAddButton
                                    excludeMembers={managers}
                                    onSelectUser={this.onAddTaskManager}
                                    usePortal={false}
                                />
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Column"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                <Popover
                                    captureDismiss={true}
                                    content={<TaskDetailPanelSelectColumnContextMenu
                                        onSelectColumn={this.onSelectColumn}
                                    />}
                                    position={Position.RIGHT_BOTTOM}
                                >
                                    <Button
                                        rightIcon={IconNames.CHEVRON_RIGHT}
                                        text={column ? column.title : "Select column..."}
                                    />
                                </Popover>
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Priority"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                <Popover
                                    captureDismiss={true}
                                    content={<TaskDetailPanelSelectPriorityContextMenu
                                        onSelectPriority={this.onSelectPriority}
                                    />}
                                    position={Position.RIGHT_BOTTOM}
                                >
                                    <Button
                                        rightIcon={IconNames.CHEVRON_RIGHT}
                                        text={priority ? priority.title : "Select priority..."}
                                        style={{
                                            backgroundColor: priority ? `rgba(
                                                ${priority.backgroundColor.red},
                                                ${priority.backgroundColor.green},
                                                ${priority.backgroundColor.blue},
                                                0.2)` :
                                                "inherit",
                                        }}
                                    />
                                </Popover>
                            </FormGroup>
                            {/* <FormGroup
                                // helperText="Helper text with details..."
                                label="Technical value"
                                labelFor="text-input"
                                // labelInfo="(required)"
                            >
                                <SliderContainer>
                                    <Slider
                                        min={0}
                                        max={10}
                                        stepSize={1}
                                        labelStepSize={10}
                                        onChange={this.getChangeHandler1()}
                                        value={this.state.value1}
                                        vertical={false}
                                        labelRenderer={this.renderLabel1}
                                    />
                                </SliderContainer>
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Business value"
                                labelFor="text-input"
                                // labelInfo="(required)"
                            >
                                <SliderContainer>
                                    <Slider
                                        min={0}
                                        max={20}
                                        stepSize={1}
                                        labelStepSize={10}
                                        onChange={this.getChangeHandler2()}
                                        value={this.state.value2}
                                        vertical={false}
                                        labelRenderer={this.renderLabel2}
                                    />
                                </SliderContainer>
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Customer value"
                                labelFor="text-input"
                                // labelInfo="(required)"
                            >
                                <SliderContainer>
                                    <Slider
                                        min={-10}
                                        max={10}
                                        stepSize={1}
                                        labelStepSize={10}
                                        onChange={this.getChangeHandler3()}
                                        value={this.state.value3}
                                        vertical={false}
                                        labelRenderer={this.renderLabel3}
                                    />
                                </SliderContainer>
                            </FormGroup> */}
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Units"
                                labelFor="text-input"
                            // labelInfo="(optional)"
                            // className="fg-editor-task-description"
                            >
                                <UnitContainer>
                                    {
                                        this.props.isAdd ?
                                            this.props.createTaskInput.units.map((eachUnit: IUnit, index: number) => {
                                                const sprint = this.props.sprintMap[eachUnit.sprintID];
                                                return (
                                                    <div
                                                        key={eachUnit.id}
                                                    >
                                                        <UnitItem
                                                            checked={false}
                                                            title={eachUnit.title}
                                                            alignIndicator={Alignment.LEFT}
                                                            index={index}
                                                            unit={eachUnit}
                                                            // large={true}
                                                            onChange={this.onChangeUnitTitleInput}
                                                            onOrderChange={this.onChangeUnitSortOrderInput}
                                                            onPointsChange={this.onChangeUnitPointsInput}
                                                            sprint={sprint}
                                                            onRemove={this.onRemoveUnit}
                                                            removable={index !== 0}
                                                            minUnitPoints={this.props.currentProject.minUnitPoints}
                                                            maxUnitPoints={this.props.currentProject.maxUnitPoints}
                                                        />
                                                    </div>
                                                );
                                            }) :
                                            this.props.taskMap[this.props.updateTaskInput.id].units.
                                                map((eachUnitID: string, index: number) => {
                                                    const eachUnit: IUnit | undefined = this.props.unitMap[eachUnitID];
                                                    if (eachUnit !== undefined) {
                                                        const sprint = this.props.sprintMap[eachUnit.sprintID];
                                                        return (
                                                            <div
                                                                key={eachUnit.id}
                                                            >
                                                                <UnitItem
                                                                    checked={false}
                                                                    title={eachUnit.title}
                                                                    alignIndicator={Alignment.LEFT}
                                                                    index={index}
                                                                    unit={eachUnit}
                                                                    // large={true}
                                                                    onChange={this.onChangeUnitTitleInput}
                                                                    onOrderChange={this.onChangeUnitSortOrderInput}
                                                                    onPointsChange={this.onChangeUnitPointsInput}
                                                                    onUnitCompleted={this.onChangeUnitCompletedInput}
                                                                    sprint={sprint}
                                                                    onRemove={this.onRemoveUnit}
                                                                    removable={index !== 0}
                                                                    minUnitPoints={this.props.currentProject.minUnitPoints}
                                                                    maxUnitPoints={this.props.currentProject.maxUnitPoints}
                                                                />
                                                            </div>
                                                        );
                                                    } else {
                                                        return (
                                                            <div
                                                                key={"Loading" + index}
                                                            >
                                                                <Button
                                                                    loading={true}
                                                                    minimal={true}
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                })
                                    }
                                    {/* // {units.map((eachUnitID: string, index: number) => {
                                    //     const eachUnit: IUnit = this.props.isAdd ?
                                    //         this.props.createTaskInput.unitMap[eachUnitID] :
                                    //         this.props.unitMap[eachUnitID];

                                    //     const sprint = this.props.sprintMap[eachUnit.sprintID];

                                    //     return (
                                    //         <div
                                    //             key={eachUnit.id}
                                    //         >
                                    //             <UnitItem
                                    //                 checked={false}
                                    //                 title={eachUnit.title}
                                    //                 alignIndicator={Alignment.LEFT}
                                    //                 index={index}
                                    //                 unit={eachUnit}
                                    //                 // large={true}
                                    //                 onChange={this.onChangeUnitTitleInput}
                                    //                 onOrderChange={this.onChangeUnitSortOrderInput}
                                    //                 onPointsChange={this.onChangeUnitPointsInput}
                                    //                 sprint={sprint}
                                    //             />
                                    //         </div>
                                    //     );
                                    // })} */}
                                </UnitContainer>
                                <AddUnitContainer>
                                    <Button
                                        onClick={this.handleAddUnit}
                                        text="Add new unit"
                                        icon="add"
                                        className={Classes.NAVBAR}
                                        loading={!this.props.isAdd && this.props.addTaskUnitLoading}
                                    />
                                </AddUnitContainer>
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Description"
                                labelFor="text-input"
                                // labelInfo="(optional)"
                                className="fg-editor-task-description"
                            >
                                {/* For editing */}
                                {!this.props.isAdd ?
                                    (
                                        this.props.taskDescriptionMap[this.props.updateTaskInput.id] === undefined ?
                                            <div>
                                                <Button
                                                    loading={true}
                                                    minimal={true}
                                                />
                                            </div> :
                                            <RippleEditor
                                                onTextChange={this.onChangeDescriptionInput}
                                                initialContent={
                                                    this.props.taskDescriptionMap[this.props.updateTaskInput.id].content
                                                }
                                                referID={this.props.taskDescriptionMap[this.props.updateTaskInput.id].id}
                                            />
                                    ) :
                                    null
                                }
                                {/* For adding */}
                                {this.props.isAdd ?
                                    <RippleEditor
                                        onTextChange={this.onChangeDescriptionInput}
                                    /> :
                                    null
                                }
                            </FormGroup>
                            {/* For editing */}
                            {!this.props.isAdd ?
                                <FormGroup
                                    // helperText="Helper text with details..."
                                    label="Comments"
                                    labelFor="text-input"
                                    // labelInfo="(optional)"
                                    className="fg-editor-task-comment"
                                >
                                    {
                                        this.props.commentMap[this.props.updateTaskInput.id] === undefined ?
                                            <div>
                                                <Button
                                                    loading={true}
                                                    minimal={true}
                                                />
                                            </div> :
                                            [
                                                <div key={"NewComment"}>
                                                    <Tag intent={Intent.PRIMARY}>{`New comment`}</Tag>
                                                    <RippleEditor
                                                        onTextChange={this.onChangeNewCommentInput}
                                                        initialContent={this.props.createCommentInput.content}
                                                        referID={undefined}
                                                    />
                                                    <div
                                                        className={Classes.DIALOG_FOOTER}
                                                        style={{
                                                            marginTop: "8px",
                                                        }}
                                                    >
                                                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                                                            <Tooltip
                                                                content="Add new comment"
                                                            >
                                                                <Button
                                                                    intent={this.props.createCommentResult.errors === undefined ?
                                                                        Intent.PRIMARY :
                                                                        Intent.DANGER}
                                                                    icon={this.props.createCommentResult.errors === undefined ?
                                                                        IconNames.ADD :
                                                                        IconNames.WARNING_SIGN}
                                                                    large={true}
                                                                    onClick={this.handleAddComment}
                                                                    loading={this.props.createCommentLoading}
                                                                    text={this.props.createCommentResult.errors}
                                                                />
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                </div>,
                                                this.props.commentMap[this.props.updateTaskInput.id].
                                                    map((eachComment: IComment) => {
                                                        const eachUser = this.props.userMap[eachComment.createdByUserID];
                                                        return (
                                                            <div
                                                                key={eachComment.id}
                                                                style={{
                                                                    marginBottom: "12px",
                                                                }}
                                                            >
                                                                <Tag
                                                                    intent={Intent.PRIMARY}
                                                                    className="tag-vertical-align"
                                                                    onRemove={
                                                                        (e) => {
                                                                            this.onRemoveComment(eachComment);
                                                                        }
                                                                    }
                                                                >
                                                                    <UserImage
                                                                        doesDisplayName={false}
                                                                        sizeInPx={30}
                                                                        allowContextMenu={true}
                                                                        allowRemoveButton={false}
                                                                        displayTooltip={false}
                                                                        name={
                                                                            _.isUndefined(eachUser) ? "..." :
                                                                                eachUser.nickname
                                                                        }
                                                                        imgSource={
                                                                            _.isUndefined(eachUser) ? undefined :
                                                                                eachUser.avatarBase64
                                                                        }
                                                                        userID={eachComment.createdByUserID}
                                                                        onRemoveUser={this.onRemoveTaskAppointee}
                                                                    />
                                                                    {
                                                                        <div>
                                                                            {
                                                                                `${getUserPresentationName(
                                                                                    this.props.userMap[eachComment.createdByUserID],
                                                                                )} -
                                                                    ${
                                                                                dateFormat(
                                                                                    getDateFromUTCEpoch(eachComment.createdOn),
                                                                                    "dddd, mmmm dS, yyyy, h:MM:ss TT",
                                                                                )
                                                                                }
                                                                    `
                                                                            }
                                                                        </div>
                                                                    }
                                                                </Tag>
                                                                <RippleEditor
                                                                    onTextChange={this.onChangeCommentInput}
                                                                    initialContent={
                                                                        eachComment.content
                                                                    }
                                                                    readOnly={true}
                                                                    referID={eachComment.id}
                                                                />
                                                            </div>
                                                        );
                                                    }),
                                                this.props.getOlderCommentsOfTaskResult.hasMore === true ?
                                                    <Button
                                                        key="ButtonLoadMoreOlderComments"
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        text="Load more..."
                                                        minimal={true}
                                                        loading={this.props.getOlderCommentsOfTaskLoading}
                                                        onClick={this.handleLoadMoreOlderComments}
                                                    /> :
                                                    null,
                                            ]
                                    }
                                </FormGroup> :
                                null}
                            {/* <FormGroup
                                // helperText="Helper text with details..."
                                label="Comment"
                                labelFor="text-input"
                                className="fg-editor-task-comment"
                                // labelInfo="(required)"
                            >
                                <RippleEditor/>
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Comment 2"
                                labelFor="text-input"
                                className="fg-editor-task-comment"
                                // labelInfo="(required)"
                            >
                                <RippleEditor/>
                            </FormGroup> */}
                        </div>
                    ) :
                    (<Callout
                        intent={Intent.SUCCESS}
                    >
                        Task is added successfully
                    </Callout>
                    )
                }
            </Container>
        );
    }

    private onChangeTitleInput = (value: string) => {
        // this.props.setRegisterInput(e.target.value, this.props.password);
        if (this.props.isAdd) {
            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                title: value,
            });
        } else {
            this.props.updateTaskSetInput({
                ...this.props.updateTaskInput,
                title: value,
            });

            this.props.insertOrUpdateTaskBoard({
                id: this.props.updateTaskInput.id,
                managers: this.props.updateTaskInput.managers,
                appointees: this.props.updateTaskInput.appointees,
                title: value,
                projectID: this.props.updateTaskInput.projectID,
                columnID: this.props.updateTaskInput.columnID,
                priorityID: this.props.updateTaskInput.priorityID,
                sprintID: this.props.updateTaskInput.sprintID,
                units: this.props.updateTaskInput.units,
                incrementcode: this.props.updateTaskInput.incrementcode,
                createdOn: this.props.updateTaskInput.createdOn,
                createdByUserID: this.props.updateTaskInput.createdByUserID,
                totalUnitPoints: this.props.updateTaskInput.totalUnitPoints,
                totalUnitPointsCompleted: this.props.updateTaskInput.totalUnitPointsCompleted,
                doesHaveZeroUnit: this.props.updateTaskInput.doesHaveZeroUnit,
            });

            this.props.updateTaskTitleRequest({
                id: this.props.updateTaskInput.id,
                title: value,
            });
        }
    }

    private onChangeUnitTitleInput = (unit: IUnit, value: string) => {
        // this.props.setRegisterInput(e.target.value, this.props.password);
        if (this.props.isAdd) {
            const theUnit = _.find(this.props.createTaskInput.units, (eachUnit: IUnit) => {
                return (eachUnit.id === unit.id);
            });
            if (theUnit !== undefined) {
                theUnit.title = value;
                this.props.createTaskSetInput({
                    ...this.props.createTaskInput,
                    units: [...this.props.createTaskInput.units],
                    // unitMap: {
                    //     ...this.props.createTaskInput.unitMap,
                    //     [unit.id] : {
                    //         ...this.props.createTaskInput.unitMap[unit.id],
                    //         title: value,
                    //     },
                    // },
                });
            }
        } else {
            this.props.insertOrUpdateUnitBoard({
                ...this.props.unitMap[unit.id],
                title: value,
            }, true);

            this.props.updateUnitTitleRequest({
                id: unit.id,
                title: value,
            });
        }
    }

    private onChangeUnitSortOrderInput = (unit: IUnit, isUp: boolean) => {
        if (this.props.isAdd) {
            const currentIndex = this.props.createTaskInput.units.indexOf(unit);
            let nextIndex = currentIndex;
            if (isUp) {
                nextIndex--;
                if (nextIndex < 0) {
                    nextIndex = 0;
                }
            } else {
                nextIndex++;
                if (nextIndex >= this.props.createTaskInput.units.length) {
                    nextIndex = this.props.createTaskInput.units.length - 1;
                }
            }

            // Swap the order
            const swapWith: IUnit = this.props.createTaskInput.units[nextIndex];
            this.props.createTaskInput.units[nextIndex] = unit;
            this.props.createTaskInput.units[currentIndex] = swapWith;

            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                units: [...this.props.createTaskInput.units],
            });
        } else {
            const task = this.props.taskMap[this.props.updateTaskInput.id];
            if (task !== undefined) {
                const currentIndex = task.units.indexOf(unit.id);
                let nextIndex = currentIndex;
                if (isUp) {
                    nextIndex--;
                    if (nextIndex < 0) {
                        nextIndex = 0;
                    }
                } else {
                    nextIndex++;
                    if (nextIndex >= task.units.length) {
                        nextIndex = task.units.length - 1;
                    }
                }

                if (currentIndex !== nextIndex) {
                    // Send update request (do this before swap so that the units is sustained)
                    let afterUnitID: string | undefined;
                    let beforeUnitID: string | undefined;
                    if (currentIndex < nextIndex) {
                        afterUnitID = task.units[nextIndex];
                        beforeUnitID = task.units[nextIndex + 1];
                    } else {
                        afterUnitID = task.units[nextIndex - 1];
                        beforeUnitID = task.units[nextIndex];
                    }

                    // Swap the order
                    const swapWith: string = task.units[nextIndex];
                    task.units[nextIndex] = unit.id;
                    task.units[currentIndex] = swapWith;

                    this.props.insertOrUpdateTaskBoard({
                        id: this.props.updateTaskInput.id,
                        managers: this.props.updateTaskInput.managers,
                        appointees: this.props.updateTaskInput.appointees,
                        title: this.props.updateTaskInput.title,
                        projectID: this.props.updateTaskInput.projectID,
                        columnID: this.props.updateTaskInput.columnID,
                        priorityID: this.props.updateTaskInput.priorityID,
                        sprintID: this.props.updateTaskInput.sprintID,
                        units: [...task.units],
                        incrementcode: this.props.updateTaskInput.incrementcode,
                        createdOn: this.props.updateTaskInput.createdOn,
                        createdByUserID: this.props.updateTaskInput.createdByUserID,
                        totalUnitPoints: this.props.updateTaskInput.totalUnitPoints,
                        totalUnitPointsCompleted: this.props.updateTaskInput.totalUnitPointsCompleted,
                        doesHaveZeroUnit: this.props.updateTaskInput.doesHaveZeroUnit,
                    });
                    // Update the sort order
                    this.props.updateUnitSortOrderRequest({
                        id: unit.id,
                        afterUnitID,
                        beforeUnitID,
                    });
                }
            }
        }
    }

    private onChangeUnitPointsInput = (unit: IUnit, points: number) => {
        if (this.props.isAdd) {
            // this.props.createTaskSetInput({
            //     ...this.props.createTaskInput,
            //     unitMap: {
            //         ...this.props.createTaskInput.unitMap,
            //         [unit.id] : {
            //             ...this.props.createTaskInput.unitMap[unit.id],
            //             points,
            //         },
            //     },
            // });
            const theUnit = _.find(this.props.createTaskInput.units, (eachUnit: IUnit) => {
                return (eachUnit.id === unit.id);
            });
            if (theUnit !== undefined) {
                theUnit.points = points;
                this.props.createTaskSetInput({
                    ...this.props.createTaskInput,
                    units: [...this.props.createTaskInput.units],
                });
            }
        } else {
            this.props.insertOrUpdateUnitBoard({
                ...this.props.unitMap[unit.id],
                points,
            }, true);

            this.props.updateUnitPointsRequest({
                id: unit.id,
                points,
            });
        }
    }

    private onChangeUnitCompletedInput = (unit: IUnit, completed: boolean) => {
        if (this.props.isAdd) {
            // Do nothing for add
        } else {
            if (!_.isEmpty(this.props.activeUserProfile.id)) {
                this.props.insertOrUpdateUnitBoard({
                    ...this.props.unitMap[unit.id],
                    completedByUserID: completed ? this.props.activeUserProfile.id : "",
                }, true);

                this.props.completeUnitRequest({
                    id: unit.id,
                    completed,
                });
            }
        }
    }

    private onChangeDescriptionInput = (value: string, plain: string, taskDescriptionID?: string) => {
        if (this.props.isAdd) {
            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                description: value,
                plain,
            });
        } else {
            // Only change if there is a different
            if (value !== this.props.updateTaskInput.description) {
                // Set the flag here to perform server update or not depends
                // on the initial state of the description of the update input
                // If the initial state is empty, the editor is just try to update the description
                // For the first time, this is not user generated event
                // So we won't perform server update
                let shouldPerformServerUpdate = true;
                if (this.props.updateTaskInput.description === "") {
                    shouldPerformServerUpdate = false;
                }
                this.props.updateTaskSetInput({
                    ...this.props.updateTaskInput,
                    description: value,
                });

                if (shouldPerformServerUpdate) {
                    if (taskDescriptionID !== undefined) {
                        const theTaskDescription = this.props.taskDescriptionMap[this.props.updateTaskInput.id];
                        if (theTaskDescription !== undefined) {
                            this.props.insertOrUpdateTaskDescriptionBoard({
                                ...theTaskDescription,
                                content: value,
                            });
                        }

                        this.props.updateTaskDescriptionContentRequest({
                            id: taskDescriptionID!,
                            content: value,
                        });
                    }
                }
            }
        }
    }

    private onChangeCommentInput = (value: string, plain: string, commentID?: string) => {
        // if (!this.props.isAdd) {
        // }
    }

    private onChangeNewCommentInput = (value: string, plain: string) => {
        if (!this.props.isAdd) {
            this.props.createCommentSetInput({
                ...this.props.createCommentInput,
                content: value,
                plain,
            });
        }
    }

    private onAddTaskManager = (selectedUser: IUser) => {
        if (this.props.isAdd) {
            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                managers: [...this.props.createTaskInput.managers, selectedUser.id],
            });
        } else {
            const managers = [...this.props.updateTaskInput.managers, selectedUser.id];
            this.props.updateTaskSetInput({
                ...this.props.updateTaskInput,
                managers,
            });

            this.props.insertOrUpdateTaskBoard({
                id: this.props.updateTaskInput.id,
                managers,
                appointees: this.props.updateTaskInput.appointees,
                title: this.props.updateTaskInput.title,
                projectID: this.props.updateTaskInput.projectID,
                columnID: this.props.updateTaskInput.columnID,
                priorityID: this.props.updateTaskInput.priorityID,
                sprintID: this.props.updateTaskInput.sprintID,
                units: this.props.updateTaskInput.units,
                incrementcode: this.props.updateTaskInput.incrementcode,
                createdOn: this.props.updateTaskInput.createdOn,
                createdByUserID: this.props.updateTaskInput.createdByUserID,
                totalUnitPoints: this.props.updateTaskInput.totalUnitPoints,
                totalUnitPointsCompleted: this.props.updateTaskInput.totalUnitPointsCompleted,
                doesHaveZeroUnit: this.props.updateTaskInput.doesHaveZeroUnit,
            });

            this.props.addOrRemoveTaskManagerRequest({
                id: this.props.updateTaskInput.id,
                isAdd: true,
                managerUserID: selectedUser.id,
            });
        }
    }

    private onRemoveTaskManager = (userID: string) => {
        if (this.props.isAdd) {
            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                managers: _.remove(
                    this.props.createTaskInput.managers,
                    (eachUserID: string) => {
                        return eachUserID !== userID;
                    }),
            });
        } else {
            const managers = _.remove(
                this.props.updateTaskInput.managers,
                (eachUserID: string) => {
                    return eachUserID !== userID;
                });

            this.props.updateTaskSetInput({
                ...this.props.updateTaskInput,
                managers,
            });

            this.props.insertOrUpdateTaskBoard({
                id: this.props.updateTaskInput.id,
                managers,
                appointees: this.props.updateTaskInput.appointees,
                title: this.props.updateTaskInput.title,
                projectID: this.props.updateTaskInput.projectID,
                columnID: this.props.updateTaskInput.columnID,
                priorityID: this.props.updateTaskInput.priorityID,
                sprintID: this.props.updateTaskInput.sprintID,
                units: this.props.updateTaskInput.units,
                incrementcode: this.props.updateTaskInput.incrementcode,
                createdOn: this.props.updateTaskInput.createdOn,
                createdByUserID: this.props.updateTaskInput.createdByUserID,
                totalUnitPoints: this.props.updateTaskInput.totalUnitPoints,
                totalUnitPointsCompleted: this.props.updateTaskInput.totalUnitPointsCompleted,
                doesHaveZeroUnit: this.props.updateTaskInput.doesHaveZeroUnit,
            });

            this.props.addOrRemoveTaskManagerRequest({
                id: this.props.updateTaskInput.id,
                isAdd: false,
                managerUserID: userID,
            });
        }
    }

    private onAddTaskAppointee = (selectedUser: IUser) => {
        if (this.props.isAdd) {
            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                appointees: [...this.props.createTaskInput.appointees, selectedUser.id],
            });
        } else {
            const appointees = [...this.props.updateTaskInput.appointees, selectedUser.id];
            this.props.updateTaskSetInput({
                ...this.props.updateTaskInput,
                appointees,
            });

            this.props.insertOrUpdateTaskBoard({
                id: this.props.updateTaskInput.id,
                appointees,
                managers: this.props.updateTaskInput.managers,
                title: this.props.updateTaskInput.title,
                projectID: this.props.updateTaskInput.projectID,
                columnID: this.props.updateTaskInput.columnID,
                priorityID: this.props.updateTaskInput.priorityID,
                sprintID: this.props.updateTaskInput.sprintID,
                units: this.props.updateTaskInput.units,
                incrementcode: this.props.updateTaskInput.incrementcode,
                createdOn: this.props.updateTaskInput.createdOn,
                createdByUserID: this.props.updateTaskInput.createdByUserID,
                totalUnitPoints: this.props.updateTaskInput.totalUnitPoints,
                totalUnitPointsCompleted: this.props.updateTaskInput.totalUnitPointsCompleted,
                doesHaveZeroUnit: this.props.updateTaskInput.doesHaveZeroUnit,
            });

            this.props.addOrRemoveTaskAppointeeRequest({
                id: this.props.updateTaskInput.id,
                isAdd: true,
                appointeeUserID: selectedUser.id,
            });
        }
    }

    private onRemoveTaskAppointee = (userID: string) => {
        if (this.props.isAdd) {
            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                appointees: _.remove(
                    this.props.createTaskInput.appointees,
                    (eachUserID: string) => {
                        return eachUserID !== userID;
                    }),
            });
        } else {
            const appointees = _.remove(
                this.props.updateTaskInput.appointees,
                (eachUserID: string) => {
                    return eachUserID !== userID;
                });

            this.props.updateTaskSetInput({
                ...this.props.updateTaskInput,
                appointees,
            });

            this.props.insertOrUpdateTaskBoard({
                id: this.props.updateTaskInput.id,
                appointees,
                managers: this.props.updateTaskInput.managers,
                title: this.props.updateTaskInput.title,
                projectID: this.props.updateTaskInput.projectID,
                columnID: this.props.updateTaskInput.columnID,
                priorityID: this.props.updateTaskInput.priorityID,
                sprintID: this.props.updateTaskInput.sprintID,
                units: this.props.updateTaskInput.units,
                incrementcode: this.props.updateTaskInput.incrementcode,
                createdOn: this.props.updateTaskInput.createdOn,
                createdByUserID: this.props.updateTaskInput.createdByUserID,
                totalUnitPoints: this.props.updateTaskInput.totalUnitPoints,
                totalUnitPointsCompleted: this.props.updateTaskInput.totalUnitPointsCompleted,
                doesHaveZeroUnit: this.props.updateTaskInput.doesHaveZeroUnit,
            });

            this.props.addOrRemoveTaskAppointeeRequest({
                id: this.props.updateTaskInput.id,
                isAdd: false,
                appointeeUserID: userID,
            });
        }
    }

    private getChangeHandler1() {
        return (value: number) => this.setState({ value1: value });
    }

    private getChangeHandler2() {
        return (value: number) => this.setState({ value2: value });
    }

    private getChangeHandler3() {
        return (value: number) => this.setState({ value3: value });
    }

    private renderLabel1(val: number) {
        return `${val}`;
    }

    private renderLabel2(val: number) {
        // return `${Math.round(val * 100)}%`;
        return `${val}`;
    }

    private renderLabel3(val: number) {
        // return val === 0 ? `£${val}` : `£${val},000`;
        return `${val}`;
    }

    private onSelectColumn = (selectedColumn: IColumn) => {
        if (this.props.isAdd) {
            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                columnID: selectedColumn.id,
            });
        } else {
            this.props.updateTaskSetInput({
                ...this.props.updateTaskInput,
                columnID: selectedColumn.id,
            });

            // Update start column
            const startColumn: IColumn | undefined = this.props.columnMap[this.props.updateTaskInput.columnID];
            if (startColumn !== undefined) {
                // Remove taskID from the old column
                const newStartColumn: IColumn = {
                    ...startColumn,
                    taskIDs: _.remove(startColumn.taskIDs, (taskID: string) => {
                        return taskID !== this.props.updateTaskInput.id;
                    }),
                };
                this.props.insertOrUpdateColumnBoard(newStartColumn);
            }

            // Update finish column
            const newFinishColumn: IColumn = {
                ...selectedColumn,
                taskIDs: [...selectedColumn.taskIDs, this.props.updateTaskInput.id],
            };

            this.props.insertOrUpdateColumnBoard(newFinishColumn);

            // Update the task
            this.props.insertOrUpdateTaskBoard({
                id: this.props.updateTaskInput.id,
                appointees: this.props.updateTaskInput.appointees,
                managers: this.props.updateTaskInput.managers,
                title: this.props.updateTaskInput.title,
                projectID: this.props.updateTaskInput.projectID,
                columnID: newFinishColumn.id,
                priorityID: this.props.updateTaskInput.priorityID,
                sprintID: this.props.updateTaskInput.sprintID,
                units: this.props.updateTaskInput.units,
                incrementcode: this.props.updateTaskInput.incrementcode,
                createdOn: this.props.updateTaskInput.createdOn,
                createdByUserID: this.props.updateTaskInput.createdByUserID,
                totalUnitPoints: this.props.updateTaskInput.totalUnitPoints,
                totalUnitPointsCompleted: this.props.updateTaskInput.totalUnitPointsCompleted,
                doesHaveZeroUnit: this.props.updateTaskInput.doesHaveZeroUnit,
            });

            // Send update request
            this.props.updateTaskSortOrderRequest({
                id: this.props.updateTaskInput.id,
                afterTaskID: "",
                beforeTaskID: "",
                toColumnID: newFinishColumn.id,
                toPriorityID: this.props.updateTaskInput.priorityID,
            });

            // Insert action history comment
            if (startColumn !== undefined) {
                this.props.createCommentRequest({
                    taskID: this.props.updateTaskInput.id,
                    content: getDraftJSEditorJSONStringFromText(
                        `Move column: [${startColumn.title}] -> [${newFinishColumn.title}]`,
                    ),
                    plain: "",
                });
            }
        }
    }

    private onSelectPriority = (selectedPriority: IPriority) => {
        if (this.props.isAdd) {
            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                priorityID: selectedPriority.id,
            });
        } else {
            this.props.updateTaskSetInput({
                ...this.props.updateTaskInput,
                priorityID: selectedPriority.id,
            });

            // Update start priority
            const startPriority: IPriority | undefined = this.props.priorityMap[this.props.updateTaskInput.priorityID];
            if (startPriority !== undefined) {
                // Remove taskID from the old priority
                const newStartPriority: IPriority = {
                    ...startPriority,
                    taskIDs: _.remove(startPriority.taskIDs, (taskID: string) => {
                        return taskID !== this.props.updateTaskInput.id;
                    }),
                };
                this.props.insertOrUpdatePriorityBoard(newStartPriority);
            }

            // Update finish priority
            const newFinishPriority: IPriority = {
                ...selectedPriority,
                taskIDs: [...selectedPriority.taskIDs, this.props.updateTaskInput.id],
            };

            this.props.insertOrUpdatePriorityBoard(newFinishPriority);

            // Update the task
            this.props.insertOrUpdateTaskBoard({
                id: this.props.updateTaskInput.id,
                appointees: this.props.updateTaskInput.appointees,
                managers: this.props.updateTaskInput.managers,
                title: this.props.updateTaskInput.title,
                projectID: this.props.updateTaskInput.projectID,
                columnID: this.props.updateTaskInput.columnID,
                priorityID: newFinishPriority.id,
                sprintID: this.props.updateTaskInput.sprintID,
                units: this.props.updateTaskInput.units,
                incrementcode: this.props.updateTaskInput.incrementcode,
                createdOn: this.props.updateTaskInput.createdOn,
                createdByUserID: this.props.updateTaskInput.createdByUserID,
                totalUnitPoints: this.props.updateTaskInput.totalUnitPoints,
                totalUnitPointsCompleted: this.props.updateTaskInput.totalUnitPointsCompleted,
                doesHaveZeroUnit: this.props.updateTaskInput.doesHaveZeroUnit,
            });

            // Send update request
            this.props.updateTaskSortOrderRequest({
                id: this.props.updateTaskInput.id,
                afterTaskID: "",
                beforeTaskID: "",
                toColumnID: this.props.updateTaskInput.columnID,
                toPriorityID: newFinishPriority.id,
            });

            // Insert action history comment
            if (startPriority !== undefined) {
                this.props.createCommentRequest({
                    taskID: this.props.updateTaskInput.id,
                    content: getDraftJSEditorJSONStringFromText(
                        `Move priority: [${startPriority.title}] -> [${newFinishPriority.title}]`,
                    ),
                    plain: "",
                });
            }
        }
    }

    private handleAddComment = () => {
        if (!this.props.isAdd) {
            this.props.createCommentRequest(this.props.createCommentInput);

            // Get the mention list
            const mentionedCommentUserIDs: string[] =
                getMentionedUserIDsFromDraftJSRawState(this.props.createCommentInput.content);

            const column: IColumn | undefined = this.props.columnMap[this.props.updateTaskInput.columnID];
            const priority: IPriority | undefined = this.props.priorityMap[this.props.updateTaskInput.priorityID];
            const previewComment: string = this.props.createCommentInput.plain.replace(/(?:\r\n|\r|\n)/g, "<br>");

            const content = `A new comment is added in:` +
                `<br/>Project: <b>${this.props.currentProject.name}</b>` +
                `<br/>Task title: <b>${this.props.updateTaskInput.incrementcode} - ` +
                `${this.props.updateTaskInput.title}</b>` +
                `<br/>Column: <b>${column !== undefined ? column.title : ""}</b>` +
                `<br/>Priority: <b>${priority !== undefined ? priority.title : ""}</b>` +
                `<br/>Preview: <br/><b>${previewComment}</b>` +
                `<br/><a href="${getHostAndProtocol()}/projects/` +
                `${this.props.currentProject.shortcode}/${this.props.updateTaskInput.id}">` +
                `Click to access task</a>` +
                ``;
            // //  Send to mentioned users
            // if (mentionedCommentUserIDs.length > 0) {
            //     this.props.sendEmailNotificationRequest({
            //         subject: `[Mentioned in comment] You are mentioned in a comment in task ` +
            //                 `${this.props.updateTaskInput.title} (Task Ripple)`,
            //         content,
            //         mentionedCommentUserIDs,
            //     });
            // }
            //  Send to other users
            this.props.sendEmailNotificationRequest({
                subject: `[New comment] New comment in task ${this.props.updateTaskInput.incrementcode} - ` +
                    `${this.props.updateTaskInput.title} ` +
                    `(${this.props.currentProject.name})`,
                content,
                taskID: this.props.updateTaskInput.id,
                columnID: this.props.updateTaskInput.columnID,
                priorityID: this.props.updateTaskInput.priorityID,
                mentionedCommentUserIDs,
            });
        }
    }

    private handleAddUnit = () => {
        if (this.props.isAdd) {
            const newUnit: IUnit = {
                id: generateUUID(),
                title: "",
                completedByUserID: "",
                points: 0,
                sprintID: this.props.createTaskInput.sprintID,
                taskID: "",
            };
            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                units: [
                    ...this.props.createTaskInput.units,
                    newUnit,
                ],
            });
        } else {
            this.props.addTaskUnitRequest({
                id: this.props.updateTaskInput.id,
                unit: {
                    completedByUserID: "",
                    id: "",
                    points: 0,
                    sprintID: this.props.updateTaskInput.sprintID,
                    title: "",
                    taskID: this.props.updateTaskInput.id,
                },
            });

            // this.props.sendEmailNotificationRequest({
            //     subject: `[New unit] New unit is added in task ${this.props.updateTaskInput.title} (Task Ripple)`,
            //     content: `A new unit is added in task <b>${this.props.updateTaskInput.title}</b>` +
            //     // `<br/>Unit title: ${getHostAndProtocol()}` +
            //     `<br/><a href="${getHostAndProtocol()}/projects/` +
            //     `${this.props.currentProject.shortcode}/${this.props.updateTaskInput.id}">` +
            //     `Click to access task</a>` +
            //     ``,
            //     taskID: this.props.updateTaskInput.id,
            //     columnID: this.props.updateTaskInput.columnID,
            //     priorityID: this.props.updateTaskInput.priorityID,
            // });
        }
    }

    private handleLoadMoreOlderComments = () => {
        if (this.props.commentMap[this.props.updateTaskInput.id] !== undefined) {
            const currentOldestComment: IComment | undefined =
                _.last(this.props.commentMap[this.props.updateTaskInput.id]);
            if (currentOldestComment !== undefined) {
                this.props.getOlderCommentsOfTaskRequest(
                    this.props.updateTaskInput.id,
                    currentOldestComment.createdOn,
                );
            }
        }
    }

    private onRemoveUnit = (unit: IUnit) => {
        if (this.props.isAdd) {
            const units = _.remove(
                this.props.createTaskInput.units,
                (eachUnit: IUnit) => {
                    return eachUnit.id !== unit.id;
                });
            this.props.createTaskSetInput({
                ...this.props.createTaskInput,
                units: [
                    ...units,
                ],
            });
        } else {
            const units = _.remove(
                this.props.taskMap[this.props.updateTaskInput.id].units,
                (eachUnitID: string) => {
                    return eachUnitID !== unit.id;
                });

            // this.props.updateTaskSetInput({
            //     ...this.props.updateTaskInput,
            //     units,
            // });

            let totalUnitPoints: number = 0;
            let totalUnitPointsCompleted: number = 0;
            let doesHaveZeroUnit: boolean = false;
            units.forEach((eachUnitID: string) => {
                const eachUnit: IUnit | undefined = this.props.unitMap[eachUnitID];
                if (eachUnit !== undefined) {
                    totalUnitPoints += eachUnit.points;
                    if (!_.isEmpty(eachUnit.completedByUserID)) {
                        totalUnitPointsCompleted += eachUnit.points;
                    }
                    if (eachUnit.points === 0) {
                        doesHaveZeroUnit = true;
                    }
                }
            });

            this.props.insertOrUpdateTaskBoard({
                id: this.props.updateTaskInput.id,
                appointees: this.props.updateTaskInput.appointees,
                managers: this.props.updateTaskInput.managers,
                title: this.props.updateTaskInput.title,
                projectID: this.props.updateTaskInput.projectID,
                columnID: this.props.updateTaskInput.columnID,
                priorityID: this.props.updateTaskInput.priorityID,
                sprintID: this.props.updateTaskInput.sprintID,
                units,
                incrementcode: this.props.updateTaskInput.incrementcode,
                createdOn: this.props.updateTaskInput.createdOn,
                createdByUserID: this.props.updateTaskInput.createdByUserID,
                totalUnitPoints,
                totalUnitPointsCompleted,
                doesHaveZeroUnit,
            });

            this.props.removeTaskUnitRequest({
                id: this.props.updateTaskInput.id,
                isAdd: false,
                unitID: unit.id,
            });

            // this.props.sendEmailNotificationRequest({
            //     subject: `[Unit removal] A unit is removed from task ` +
            //     `${this.props.updateTaskInput.title} (Task Ripple)`,
            //     content: `A unit is removed from task <b>${this.props.updateTaskInput.title}</b>` +
            //     `<br/>Unit title: ${unit.title}` +
            //     `<br/><a href="${getHostAndProtocol()}/projects/` +
            //     `${this.props.currentProject.shortcode}/${this.props.updateTaskInput.id}">` +
            //     `Click to access task</a>` +
            //     ``,
            //     taskID: this.props.updateTaskInput.id,
            //     columnID: this.props.updateTaskInput.columnID,
            //     priorityID: this.props.updateTaskInput.priorityID,
            // });
        }
    }

    private onRemoveComment = (comment: IComment) => {
        if (!this.props.isAdd) {
            const input: ICommentDeleteInput = {
                id: comment.id,
                taskID: comment.taskID,
            };

            // Delete from board
            this.props.deleteCommentFromBoard(input);
            // Send delete request
            this.props.deleteCommentRequest(input);
        }
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ tasks, users, board, comments, logins }: IApplicationState) => ({
    createTaskInput: tasks.createTaskInput,
    createTaskResult: tasks.createTaskResult,
    updateTaskInput: tasks.updateTaskInput,
    updateTaskResult: tasks.updateTaskResult,
    userMap: users.userMap,
    getUsersLoading: users.loading,
    projectID: board.projectID,
    prioritiesOrder: board.prioritiesOrder,
    priorityMap: board.priorityMap,
    taskMap: board.taskMap,
    columnMap: board.columnMap,
    unitMap: board.unitMap,
    sprintMap: board.sprintMap,
    taskDescriptionMap: board.taskDescriptionMap,
    commentMap: board.commentMap,
    addTaskUnitLoading: tasks.addTaskUnitLoading,
    createCommentInput: comments.createCommentInput,
    createCommentLoading: comments.createCommentLoading,
    createCommentResult: comments.createCommentResult,
    activeUserProfile: logins.activeUserProfile,
    currentProject: board.project,
    getOlderCommentsOfTaskResult: comments.getOlderCommentsOfTaskResult,
    getOlderCommentsOfTaskLoading: comments.getOlderCommentsOfTaskLoading,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    createTaskSetInput: (input: ITaskCreateInput) =>
        dispatch(tasksActions.createTaskSetInput(input)),
    updateTaskSetInput: (input: ITaskUpdateInput) =>
        dispatch(tasksActions.updateTaskSetInput(input)),
    getUsers: () =>
        dispatch(usersActions.getUsers()),
    updateTaskTitleRequest: (input: ITaskUpdateTitleInput) =>
        dispatch(tasksActions.updateTaskTitleRequest(input)),
    updateUnitTitleRequest: (input: IUnitUpdateTitleInput) =>
        dispatch(unitsActions.updateUnitTitleRequest(input)),
    updateUnitPointsRequest: (input: IUnitUpdatePointsInput) =>
        dispatch(unitsActions.updateUnitPointsRequest(input)),
    updateUnitSortOrderRequest: (input: IUnitUpdateSortOrderInput) =>
        dispatch(unitsActions.updateUnitSortOrderRequest(input)),
    updateTaskDescriptionRequest: (input: ITaskUpdateDescriptionInput) =>
        dispatch(tasksActions.updateTaskDescriptionRequest(input)),
    insertOrUpdateTaskBoard: (task: ITask) =>
        dispatch(boardActions.insertOrUpdateTaskBoard(task)),
    insertOrUpdateUnitBoard: (unit: IUnit, updateOnly: boolean) =>
        dispatch(boardActions.insertOrUpdateUnitBoard(unit, updateOnly)),
    insertOrUpdateTaskDescriptionBoard: (input: ITaskDescription) =>
        dispatch(boardActions.insertOrUpdateTaskDescriptionBoard(input)),
    insertOrUpdateColumnBoard: (column: IColumn) =>
        dispatch(boardActions.insertOrUpdateColumnBoard(column)),
    insertOrUpdatePriorityBoard: (priority: IPriority) =>
        dispatch(boardActions.insertOrUpdatePriorityBoard(priority)),
    addOrRemoveTaskManagerRequest: (input: IAddOrRemoveTaskManagerInput) =>
        dispatch(tasksActions.addOrRemoveTaskManagerRequest(input)),
    addOrRemoveTaskAppointeeRequest: (input: IAddOrRemoveTaskAppointeeInput) =>
        dispatch(tasksActions.addOrRemoveTaskAppointeeRequest(input)),
    removeTaskUnitRequest: (input: IRemoveTaskUnitInput) =>
        dispatch(tasksActions.removeTaskUnitRequest(input)),
    addTaskUnitRequest: (input: IAddTaskUnitInput) =>
        dispatch(tasksActions.addTaskUnitRequest(input)),
    setPrioritiesOrder: (prioritiesOrder: string[]) =>
        dispatch(boardActions.setPrioritiesOrder(prioritiesOrder)),
    updatePrioritySortOrderRequest: (input: IPriorityUpdateSortOrderInput) =>
        dispatch(prioritiesActions.updatePrioritySortOrderRequest(input)),
    getUnitRequest: (unitID: string) =>
        dispatch(unitsActions.getUnitRequest(unitID)),
    getTaskDescriptionRequest: (taskID: string) =>
        dispatch(taskdescriptionsActions.getTaskDescriptionRequest(taskID)),
    getCommentRequest: (commentID: string) =>
        dispatch(commentsActions.getCommentRequest(commentID)),
    updateTaskDescriptionContentRequest: (input: ITaskDescriptionUpdateContentInput) =>
        dispatch(taskdescriptionsActions.updateTaskDescriptionContentRequest(input)),
    createCommentSetInput: (input: ICommentCreateInput) =>
        dispatch(commentsActions.createCommentSetInput(input)),
    createCommentRequest: (input: ICommentCreateInput) =>
        dispatch(commentsActions.createCommentRequest(input)),
    getCommentsOfTaskRequest: (taskID: string) =>
        dispatch(commentsActions.getCommentsOfTaskRequest(taskID)),
    deleteCommentRequest: (input: ICommentDeleteInput) =>
        dispatch(commentsActions.deleteCommentRequest(input)),
    deleteCommentFromBoard: (input: ICommentDeleteInput) =>
        dispatch(boardActions.deleteCommentFromBoard(input)),
    completeUnitRequest: (input: IUnitCompleteInput) =>
        dispatch(unitsActions.completeUnitRequest(input)),
    sendEmailNotificationRequest: (input: IEmailNotificationInput) =>
        dispatch(loginsActions.sendEmailNotificationRequest(input)),
    getNewerCommentsOfTaskRequest: (taskID: string, newerThanEpochSeconds: number) =>
        dispatch(commentsActions.getNewerCommentsOfTaskRequest(taskID, newerThanEpochSeconds)),
    getOlderCommentsOfTaskRequest: (taskID: string, olderThanEpochSeconds: number) =>
        dispatch(commentsActions.getOlderCommentsOfTaskRequest(taskID, olderThanEpochSeconds)),
    getOlderCommentsOfTaskSetResult: (result: ICommentGetResultSimple) =>
        dispatch(commentsActions.getOlderCommentsOfTaskSetResult(result)),
    updateTaskSortOrderRequest: (input: ITaskUpdateSortOrderInput) =>
        dispatch(tasksActions.updateTaskSortOrderRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TaskDetailPanel);

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
    Tag,
} from "@blueprintjs/core";
import { DatePicker, DateTimePicker, TimePrecision } from "@blueprintjs/datetime";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as boardActions from "../../store/board/actions";
import { IPriority } from "../../store/priorities/types";
import * as sprintsActions from "../../store/sprints/actions";
import {
    ISprint,
    ISprintCommonResult,
    ISprintCreateInput,
    ISprintUpdateBeginOnInput,
    ISprintUpdateEndOnInput,
    ISprintUpdateInput,
    ISprintUpdateNameInput,
} from "../../store/sprints/types";
import * as usersActions from "../../store/users/actions";
import { IUser } from "../../store/users/types";
import { getDateFromUTCEpoch, getEpochSecondsOfDate } from "../../utils/dates";
import { IStringTMap } from "../../utils/types";

const Container = styled.div`
    // display: flex;
    flex-direction: sprint;
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

interface ISprintDetailState {

}

interface IPropsFromState {
    createSprintInput: ISprintCreateInput;
    createSprintResult: ISprintCommonResult;
    updateSprintInput: ISprintUpdateInput;
    updateSprintResult: ISprintCommonResult;
    userMap: IStringTMap<IUser>;
    getUsersLoading: boolean;
    projectID: string;
    prioritiesOrder: string[];
    priorityMap: IStringTMap<IPriority>;
    sprintMap: IStringTMap<ISprint>;
}

interface IPropsFromDispatch {
    createSprintSetInput: typeof sprintsActions.createSprintSetInput;
    // setEditSprintState: typeof sprintsActions.setEditSprintState;
    updateSprintSetInput: typeof sprintsActions.updateSprintSetInput;
    getUsers: typeof usersActions.getUsers;
    updateSprintNameRequest: typeof sprintsActions.updateSprintNameRequest;
    updateSprintBeginOnRequest: typeof sprintsActions.updateSprintBeginOnRequest;
    updateSprintEndOnRequest: typeof sprintsActions.updateSprintEndOnRequest;
    insertOrUpdateSprintBoard: typeof boardActions.insertOrUpdateSprintBoard;
}

interface IOwnProps {
    isAdd: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class SprintDetailPanel extends React.PureComponent<AllProps> {

    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        if (!this.props.isAdd) {
            // To do
        } else {
            // Set the project ID for create sprint input
            this.props.createSprintSetInput({
                ...this.props.createSprintInput,
                projectID: this.props.projectID,
            });
        }
    }

    public render() {
        const name = this.props.isAdd ?
            this.props.createSprintInput.name :
            this.props.updateSprintInput.name;
        const beginOn = this.props.isAdd ?
            this.props.createSprintInput.beginOn :
            this.props.updateSprintInput.beginOn;
        const endOn = this.props.isAdd ?
            this.props.createSprintInput.endOn :
            this.props.updateSprintInput.endOn;
        return (
            <Container>
                {this.props.createSprintResult.errors === undefined ?
                    (<div />) :
                    (<Callout
                        intent={Intent.DANGER}
                        style={{ marginBottom: "20px" }}
                    >
                        Can not create your sprint. Error: {this.props.createSprintResult.errors}
                    </Callout>
                    )
                }
                {this.props.createSprintResult.id === undefined ?
                    (
                        <div>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Name"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                <H1>
                                    <EditableText
                                        multiline={false}
                                        minLines={1}
                                        maxLines={1}
                                        value={name}
                                        confirmOnEnterKey={true}
                                        selectAllOnFocus={true}
                                        placeholder="Sprint name..."
                                        onChange={this.onChangeNameInput}
                                    />
                                </H1>
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label={
                                    <Tag intent={Intent.PRIMARY}>{`Begin on: ${getDateFromUTCEpoch(beginOn)}`}</Tag>}
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                <div
                                    style={{
                                        width: "230px",
                                    }}
                                >
                                    <DatePicker
                                        showActionsBar={true}
                                        value={getDateFromUTCEpoch(beginOn)}
                                        onChange={this.onChangeBeginOnInput}
                                        timePrecision={TimePrecision.MINUTE}
                                        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                                    />
                                </div>
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label={
                                    <Tag intent={Intent.PRIMARY}>{`End on: ${getDateFromUTCEpoch(endOn)}`}</Tag>}
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                <div
                                    style={{
                                        width: "230px",
                                    }}
                                >
                                    <DatePicker
                                        showActionsBar={true}
                                        value={getDateFromUTCEpoch(endOn)}
                                        onChange={this.onChangeEndOnInput}
                                        timePrecision={TimePrecision.MINUTE}
                                        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                                    />
                                </div>
                            </FormGroup>
                        </div>
                    ) :
                    (<Callout
                        intent={Intent.SUCCESS}
                    >
                        Sprint is added successfully
                    </Callout>
                    )
                }
            </Container>
        );
    }

    private onChangeBeginOnInput = (value: Date) => {
        const beginOn = getEpochSecondsOfDate(value);
        if (this.props.isAdd) {
            this.props.createSprintSetInput({
                ...this.props.createSprintInput,
                beginOn,
            });
        } else {
            this.props.updateSprintSetInput({
                ...this.props.updateSprintInput,
                beginOn,
            });

            this.props.insertOrUpdateSprintBoard({
                ...this.props.updateSprintInput,
                beginOn,
            });

            this.props.updateSprintBeginOnRequest({
                id: this.props.updateSprintInput.id,
                beginOn,
            });
        }
    }

    private onChangeEndOnInput = (value: Date) => {
        const endOn = getEpochSecondsOfDate(value);
        if (this.props.isAdd) {
            this.props.createSprintSetInput({
                ...this.props.createSprintInput,
                endOn,
            });
        } else {
            this.props.updateSprintSetInput({
                ...this.props.updateSprintInput,
                endOn,
            });

            this.props.insertOrUpdateSprintBoard({
                ...this.props.updateSprintInput,
                endOn,
            });

            this.props.updateSprintEndOnRequest({
                id: this.props.updateSprintInput.id,
                endOn,
            });
        }
    }

    private onChangeNameInput = (value: string) => {
        // this.props.setRegisterInput(e.target.value, this.props.password);
        if (this.props.isAdd) {
            this.props.createSprintSetInput({
                ...this.props.createSprintInput,
                name: value,
            });
        } else {
            this.props.updateSprintSetInput({
                ...this.props.updateSprintInput,
                name: value,
            });

            this.props.insertOrUpdateSprintBoard({
                ...this.props.updateSprintInput,
                name: value,
            });

            this.props.updateSprintNameRequest({
                id: this.props.updateSprintInput.id,
                name: value,
            });
        }
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ sprints, users, board }: IApplicationState) => ({
    createSprintInput: sprints.createSprintInput,
    createSprintResult: sprints.createSprintResult,
    updateSprintInput: sprints.updateSprintInput,
    updateSprintResult: sprints.updateSprintResult,
    userMap: users.userMap,
    getUsersLoading: users.loading,
    projectID: board.projectID,
    prioritiesOrder: board.prioritiesOrder,
    priorityMap: board.priorityMap,
    sprintMap: board.sprintMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    createSprintSetInput: (input: ISprintCreateInput) =>
        dispatch(sprintsActions.createSprintSetInput(input)),
    updateSprintSetInput: (input: ISprintUpdateInput) =>
        dispatch(sprintsActions.updateSprintSetInput(input)),
    getUsers: () =>
        dispatch(usersActions.getUsers()),
    insertOrUpdateSprintBoard: (sprint: ISprint) =>
        dispatch(boardActions.insertOrUpdateSprintBoard(sprint)),
    updateSprintNameRequest: (input: ISprintUpdateNameInput) =>
        dispatch(sprintsActions.updateSprintNameRequest(input)),
    updateSprintBeginOnRequest: (input: ISprintUpdateBeginOnInput) =>
        dispatch(sprintsActions.updateSprintBeginOnRequest(input)),
    updateSprintEndOnRequest: (input: ISprintUpdateEndOnInput) =>
        dispatch(sprintsActions.updateSprintEndOnRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SprintDetailPanel);

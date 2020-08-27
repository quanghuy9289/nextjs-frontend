/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import {
    Button,
    Callout,
    ContextMenu,
    EditableText,
    FormGroup,
    H1,
    Icon,
    InputGroup,
    Intent,
    Menu,
    MenuItem,
    NumericInput,
    Popover,
    Position,
    Tooltip,
} from "@blueprintjs/core";
import { DateInput, TimePrecision } from "@blueprintjs/datetime";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import { IStandardColor, IStandardColorGroup } from "../../store/colors/types";
import * as leaveRequestsActions from "../../store/leaverequests/actions";
import { ILeaveRequest, ILeaveRequestDeleteInput, ILeaveRequestGetResultSimple } from "../../store/leaverequests/types";
import * as projectsActions from "../../store/projects/actions";
import * as sprintrequirementsActions from "../../store/sprintrequirements/actions";
import { ISprintRequirement, ISprintRequirementUpdateMinUnitPointsInput } from "../../store/sprintrequirements/types";
import { ISprint } from "../../store/sprints/types";
import * as usersActions from "../../store/users/actions";
import { IUser, UserLeaveTypes } from "../../store/users/types";
import { CONST_MAXIMUM_UNIT_POINTS_POSSIBLE } from "../../utils/constants";
import { getDateFromUTCEpoch, getEpochSecondsOfDate } from "../../utils/dates";
import { combineIDs } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import UnitItemPointsField from "../board/unit-item-points-field";
import UserAvatarUploader from "../useravataruploader";
import EmployeeLeaveItem from "./employee-leave-item";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-left: 20px;
    padding-top: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    overflow: auto;
`;

interface IEmployeePerformanceReviewPanelState {

}

interface IPropsFromState {
    userMap: IStringTMap<IUser>;
    sprintRequirementBySprintIDAndUserIDMap: IStringTMap<ISprintRequirement>;
    getOlderLeaveRequestsOfUserResult: ILeaveRequestGetResultSimple;
    getOlderLeaveRequestsOfUserLoading: boolean;
    createLeaveRequestInput: ILeaveRequest;
    createLeaveRequestLoading: boolean;
}

interface IPropsFromDispatch {
    updateSprintRequirementMinUnitPointsRequest:
    typeof sprintrequirementsActions.updateSprintRequirementMinUnitPointsRequest;
    getSprintRequirementRequestBySprintAndUser:
    typeof sprintrequirementsActions.getSprintRequirementRequestBySprintAndUser;
    updateUserSetInput:
    typeof usersActions.updateUserSetInput;
    getOlderLeaveRequestsOfUserRequest:
    typeof leaveRequestsActions.getOlderLeaveRequestsOfUserRequest;
    getNewerLeaveRequestsOfUserRequest:
    typeof leaveRequestsActions.getNewerLeaveRequestsOfUserRequest;
    createLeaveRequestRequest:
    typeof leaveRequestsActions.createLeaveRequestRequest;
    createLeaveRequestSetInput:
    typeof leaveRequestsActions.createLeaveRequestSetInput;
    deleteLeaveRequestRequest:
    typeof leaveRequestsActions.deleteLeaveRequestRequest;
    deleteLeaveRequestForUser:
    typeof usersActions.deleteLeaveRequestForUser;
}

interface IOwnProps {
    user: IUser;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class EmployeePerformanceReviewPanel extends React.PureComponent<AllProps, IEmployeePerformanceReviewPanelState> {
    public state: IEmployeePerformanceReviewPanelState = {

    };

    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // Load leave requests
        if (this.props.user.leaveRequests === undefined ||
            this.props.user.leaveRequests.length === 0) {
            this.props.getOlderLeaveRequestsOfUserRequest(this.props.user.id, 0);
        } else {
            // Perform load newer comments if have
            const firstLeaveRequest: ILeaveRequest = this.props.user.leaveRequests[0];
            if (firstLeaveRequest !== undefined) {
                this.props.getNewerLeaveRequestsOfUserRequest(this.props.user.id, firstLeaveRequest.createdOn);
            }

            // Also load more older comments of needed
            this.handleLoadMoreOlderLeaveRequests();
        }
    }

    public render() {
        return (
            <Container>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Employee name"
                    labelFor="text-input"
                    labelInfo="(required)"
                >
                    <H1>
                        <EditableText
                            multiline={false}
                            minLines={1}
                            maxLines={1}
                            value={this.props.user.fullname}
                            confirmOnEnterKey={true}
                            selectAllOnFocus={true}
                            placeholder="Employee name..."
                            onChange={this.onChangeEmployeeFullNameInput}
                        />
                    </H1>
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Nickname"
                    // labelFor="text-input"
                    labelInfo="(required)"
                >
                    <InputGroup
                        value={this.props.user.nickname}
                        placeholder="Nickname..."
                        onChange={this.onChangeEmployeeNickNameInput}
                    // intent={
                    //     this.props.registrationValidation.isNicknameLengthValid === false ?
                    //     Intent.DANGER : Intent.NONE
                    // }
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Avatar"
                    // labelFor="text-input"
                    labelInfo="(required)"
                >
                    <UserAvatarUploader
                        name={this.props.user.nickname}
                        base64Image={this.props.user.avatarBase64}
                        onAvatarBase64Uploaded={this.onChangeUserAvatarInput}
                        intent={Intent.NONE}
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Start date"
                    // labelFor="text-input"
                    labelInfo="(required)"
                >
                    <DateInput
                        formatDate={(date) => (date == null ? "" : date.toLocaleDateString())}
                        parseDate={(str) => new Date(Date.parse(str))}
                        placeholder="JS Date"
                        defaultValue={undefined}
                        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                        value={
                            !_.isUndefined(this.props.user.startDate) ?
                                getDateFromUTCEpoch(this.props.user.startDate) : undefined
                        }
                        onChange={this.onStartDateChange}
                        popoverProps={{
                            position: Position.BOTTOM,
                            usePortal: false,
                        }}
                        timePrecision={TimePrecision.MINUTE}
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Minimum daily unit points requirement"
                    // labelFor="text-input"
                    labelInfo="(required)"
                >
                    <UnitItemPointsField
                        initialPoints={
                            !_.isUndefined(this.props.user.minDailyUnitPointsRequirement) ?
                                this.props.user.minDailyUnitPointsRequirement : 0
                        }
                        minUnitPoints={0}
                        maxUnitPoints={100}
                        onChange={((newPoints: number) => {
                            this.onMinDailyUnitPointsRequirementChange(newPoints);
                        })}
                    // onFocus={this.onEditBegin}
                    // onBlur={this.onEditEnd}
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Standard number of working days per week"
                    // labelFor="text-input"
                    labelInfo="(required)"
                >
                    <UnitItemPointsField
                        initialPoints={
                            !_.isUndefined(this.props.user.standardNumberOfWorkingDaysPerWeek) ?
                                this.props.user.standardNumberOfWorkingDaysPerWeek : 0
                        }
                        minUnitPoints={0}
                        maxUnitPoints={100}
                        onChange={((newPoints: number) => {
                            this.onStandardNumberOfWorkingDaysPerWeek(newPoints);
                        })}
                    // onFocus={this.onEditBegin}
                    // onBlur={this.onEditEnd}
                    />
                </FormGroup>
                <FormGroup
                    // helperText="Helper text with details..."
                    label="Leaves"
                // labelFor="text-input"
                // labelInfo="(required)"
                >
                    <div style={{ height: "10px" }} />
                    {
                        this.props.user.leaveRequests === undefined ?
                            <div>
                                <Button
                                    loading={true}
                                    minimal={true}
                                />
                            </div> :
                            [
                                // <Tooltip
                                //     position={Position.BOTTOM_RIGHT}
                                //     content="Request leave"
                                //     key={"Request leave"}
                                //     // disabled={true}
                                // >
                                //     <Button
                                //         // onClick={this.handleCloseDialog}
                                //         // disabled={true}
                                //     >
                                //         Request leave
                                //     </Button>
                                // </Tooltip>,
                                <EmployeeLeaveItem
                                    key={"Request leave new item"}
                                    minUnitPoints={0}
                                    maxUnitPoints={CONST_MAXIMUM_UNIT_POINTS_POSSIBLE}
                                    removable={false}
                                    user={this.props.user}
                                    leaveRequest={this.props.createLeaveRequestInput} // Add mode
                                    // onPointsChange={this.onMinUnitPointsChange}
                                    onRequestLeave={this.onRequestLeave}
                                    onDataChange={this.onNewLeaveRequestDataChange}
                                    isAddMode={true}
                                    isLoading={this.props.createLeaveRequestLoading}
                                />,
                                this.props.user.leaveRequests.
                                    map((eachLeaveRequest: ILeaveRequest) => {
                                        return (
                                            <EmployeeLeaveItem
                                                key={eachLeaveRequest.id}
                                                minUnitPoints={0}
                                                maxUnitPoints={CONST_MAXIMUM_UNIT_POINTS_POSSIBLE}
                                                removable={false}
                                                user={this.props.user}
                                                leaveRequest={eachLeaveRequest}
                                                isAddMode={false}
                                                isLoading={this.props.createLeaveRequestLoading}
                                                onDeleteRequestLeave={this.onDeleteRequestLeave}
                                            // onPointsChange={this.onMinUnitPointsChange}
                                            />
                                        );
                                    }),
                                this.props.getOlderLeaveRequestsOfUserResult.hasMore === true ?
                                    <Button
                                        key="ButtonLoadMoreOlderLeaveRequests"
                                        style={{
                                            width: "100%",
                                        }}
                                        text="Load more..."
                                        minimal={true}
                                        loading={this.props.getOlderLeaveRequestsOfUserLoading}
                                        onClick={this.handleLoadMoreOlderLeaveRequests}
                                    /> :
                                    null,
                            ]
                    }
                    {/* <EmployeeLeaveItem
                        key={combineIDs("ABC", this.props.user.id)}
                        minUnitPoints={0}
                        maxUnitPoints={CONST_MAXIMUM_UNIT_POINTS_POSSIBLE}
                        removable={false}
                        user={this.props.user}
                        // onPointsChange={this.onMinUnitPointsChange}
                    />
                    <EmployeeLeaveItem
                        key={combineIDs("ABCD", this.props.user.id)}
                        minUnitPoints={0}
                        maxUnitPoints={CONST_MAXIMUM_UNIT_POINTS_POSSIBLE}
                        removable={false}
                        user={this.props.user}
                        // onPointsChange={this.onMinUnitPointsChange}
                    />
                    <EmployeeLeaveItem
                        key={combineIDs("ABCDE", this.props.user.id)}
                        minUnitPoints={0}
                        maxUnitPoints={CONST_MAXIMUM_UNIT_POINTS_POSSIBLE}
                        removable={false}
                        user={this.props.user}
                        // onPointsChange={this.onMinUnitPointsChange}
                    /> */}
                </FormGroup>
            </Container>
        );
    }

    private updateLeaveRequest = (leaveRequest: ILeaveRequest): ILeaveRequest => {
        if (!_.isUndefined(this.props.user.minDailyUnitPointsRequirement)) {
            let leaveFactor: number = 0.0;
            if (leaveRequest.leaveType === UserLeaveTypes.FULL_DAY) {
                leaveFactor = 1.0;
            } else if (leaveRequest.leaveType === UserLeaveTypes.HALF_DAY) {
                leaveFactor = 0.5;
            } else if (leaveRequest.leaveType === UserLeaveTypes.UNPAID) {
                leaveFactor = 0.0;
            }

            const updatedLeaveRequest: ILeaveRequest = {
                ...leaveRequest,
                hourLeaveAmount: this.props.user.minDailyUnitPointsRequirement * leaveFactor,
            };

            return updatedLeaveRequest;
        }
        return leaveRequest;
    }

    private onNewLeaveRequestDataChange = (leaveRequest: ILeaveRequest) => {
        const updatedLeaveRequest: ILeaveRequest = this.updateLeaveRequest(leaveRequest);
        this.props.createLeaveRequestSetInput(updatedLeaveRequest);
    }

    private handleLoadMoreOlderLeaveRequests = () => {
        if (!_.isUndefined(this.props.user.leaveRequests) &&
            this.props.user.leaveRequests.length > 0) {
            const currentOldestComment: ILeaveRequest | undefined =
                _.last(this.props.user.leaveRequests);
            if (currentOldestComment !== undefined) {
                this.props.getOlderLeaveRequestsOfUserRequest(
                    this.props.user.id,
                    currentOldestComment.createdOn,
                );
            }
        }
    }

    private onStartDateChange = (date: Date | null) => {
        // Do something
        const epochSeconds = !_.isNull(date) ? getEpochSecondsOfDate(date) : undefined;
        this.props.updateUserSetInput({
            ...this.props.user,
            startDate: epochSeconds,
        }, false);
    }

    private onMinDailyUnitPointsRequirementChange = (newPoints: number) => {
        this.props.updateUserSetInput({
            ...this.props.user,
            minDailyUnitPointsRequirement: newPoints,
        }, false);
    }

    private onStandardNumberOfWorkingDaysPerWeek = (newPoints: number) => {
        this.props.updateUserSetInput({
            ...this.props.user,
            standardNumberOfWorkingDaysPerWeek: newPoints,
        }, false);
    }

    private onChangeEmployeeFullNameInput = (fullname: string) => {
        this.props.updateUserSetInput({
            ...this.props.user,
            fullname,
        }, false);
    }

    private onChangeEmployeeNickNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateUserSetInput({
            ...this.props.user,
            nickname: e.target.value,
        }, false);
    }

    private onChangeUserAvatarInput = (fileBase64: string) => {
        // this.props.setRegisterInput(e.target.value, this.props.password);
        this.props.updateUserSetInput({
            ...this.props.user,
            avatarBase64: fileBase64,
        }, false);

        // this.props.setRegistrationValidation({
        //     isAvatarBase64Set: !_.isEmpty(fileBase64),
        // });
    }

    private onRequestLeave = (user: IUser, leaveRequest: ILeaveRequest) => {
        // Update one more time before sending the leave request
        const updatedLeaveRequest: ILeaveRequest = this.updateLeaveRequest(leaveRequest);
        this.props.createLeaveRequestRequest(updatedLeaveRequest);
    }

    private onDeleteRequestLeave = (leaveRequest: ILeaveRequest) => {
        // Delete the leave request for user (UI only)
        this.props.deleteLeaveRequestForUser({
            id: leaveRequest.id,
            requesterUserID: leaveRequest.requesterUserID,
        });

        // Delete the leave request on server
        this.props.deleteLeaveRequestRequest({
            id: leaveRequest.id,
            requesterUserID: leaveRequest.requesterUserID,
        });
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ users, board, sprintrequirements, leaveRequests }: IApplicationState) => ({
    userMap: users.userMap,
    sprintRequirementBySprintIDAndUserIDMap: board.sprintRequirementBySprintIDAndUserIDMap,
    getOlderLeaveRequestsOfUserResult: leaveRequests.getOlderLeaveRequestsOfUserResult,
    getOlderLeaveRequestsOfUserLoading: leaveRequests.getOlderLeaveRequestsOfUserLoading,
    createLeaveRequestInput: leaveRequests.createLeaveRequestInput,
    createLeaveRequestLoading: leaveRequests.createLeaveRequestLoading,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateSprintRequirementMinUnitPointsRequest: (input: ISprintRequirementUpdateMinUnitPointsInput) =>
        dispatch(sprintrequirementsActions.updateSprintRequirementMinUnitPointsRequest(input)),
    getSprintRequirementRequestBySprintAndUser: (sprintID: string, userID: string) =>
        dispatch(sprintrequirementsActions.getSprintRequirementRequestBySprintAndUser(sprintID, userID)),
    updateUserSetInput: (user: IUser, loadOnly: boolean) =>
        dispatch(usersActions.updateUserSetInput(user, loadOnly)),
    getOlderLeaveRequestsOfUserRequest: (userID: string, olderThanEpochSeconds: number) =>
        dispatch(leaveRequestsActions.getOlderLeaveRequestsOfUserRequest(userID, olderThanEpochSeconds)),
    getNewerLeaveRequestsOfUserRequest: (userID: string, newerThanEpochSeconds: number) =>
        dispatch(leaveRequestsActions.getNewerLeaveRequestsOfUserRequest(userID, newerThanEpochSeconds)),
    createLeaveRequestRequest: (input: ILeaveRequest) =>
        dispatch(leaveRequestsActions.createLeaveRequestRequest(input)),
    createLeaveRequestSetInput: (input: ILeaveRequest) =>
        dispatch(leaveRequestsActions.createLeaveRequestSetInput(input)),
    deleteLeaveRequestRequest: (input: ILeaveRequestDeleteInput) =>
        dispatch(leaveRequestsActions.deleteLeaveRequestRequest(input)),
    deleteLeaveRequestForUser: (input: ILeaveRequestDeleteInput) =>
        dispatch(usersActions.deleteLeaveRequestForUser(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(EmployeePerformanceReviewPanel);

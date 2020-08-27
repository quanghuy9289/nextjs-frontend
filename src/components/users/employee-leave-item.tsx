/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Alignment,
    Button,
    Card,
    Checkbox,
    Classes,
    ContextMenu,
    Dialog,
    EditableText,
    Elevation,
    FormGroup,
    Icon,
    InputGroup,
    Intent,
    Menu,
    MenuDivider,
    MenuItem,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NumericInput,
    Popover,
    Position,
    Tag,
    Tooltip,
} from "@blueprintjs/core";
import { DateInput, DatePicker, IDateFormatProps, TimePrecision } from "@blueprintjs/datetime";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import { History } from "history";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Route, Router } from "react-router";
import { withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import { IStandardColor } from "../../store/colors/types";
import { IColumn } from "../../store/columns/types";
import * as dialogsActions from "../../store/dialogs/actions";
import { ILeaveRequest } from "../../store/leaverequests/types";
import { IPriority } from "../../store/priorities/types";
import { IProject } from "../../store/projects/types";
import { ISprintRequirement } from "../../store/sprintrequirements/types";
import { ISprint } from "../../store/sprints/types";
import * as tasksActions from "../../store/tasks/actions";
import { IUnit } from "../../store/units/types";
import { IUser, IUserLeaveType, UserLeaveTypes } from "../../store/users/types";
import { CONST_ROUNDING_STANDARD_PRECISION } from "../../utils/constants";
import { getDateFromUTCEpoch, getEpochSecondsOfDate } from "../../utils/dates";
import { getUserPresentationName } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import UnitItemPointsField from "../board/unit-item-points-field";
import UnitItemTitleField from "../board/unit-item-title-field";
import UserSettingMenu from "../users/user-setting-menu";
import {USER_LEAVE_TYPES, userLeaveTypeSelectProps} from "./user-leave-type-select-item";

const Container = styled.div`
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
`;

const UserLeaveTypeSelect = Select.ofType<UserLeaveTypes>();

const DATE_FORMATS: IDateFormatProps[] = [
    {
        formatDate: (date) => (date == null ? "" : date.toLocaleDateString()),
        parseDate: (str) => new Date(Date.parse(str)),
        placeholder: "JS Date",
    },
];

interface IEmployeeLeaveItemState {
    tempPointsStringValue: string;
}

interface IPropsFromState {

}

interface IPropsFromDispatch {

}

interface IOwnProps {
    large?: boolean;
    checked?: boolean;
    title?: string;
    alignIndicator?: Alignment;
    onPointsChange?: (sprintRequirement: ISprintRequirement, points: number) => void;
    onRequestLeave?: (user: IUser, leaveRequest: ILeaveRequest) => void;
    onDataChange?: (leaveRequest: ILeaveRequest) => void;
    onDeleteRequestLeave?: (leaveRequest: ILeaveRequest) => void;
    removable: boolean;
    minUnitPoints: number;
    maxUnitPoints: number;
    user: IUser;
    leaveRequest: ILeaveRequest;
    isAddMode: boolean;
    isLoading: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class EmployeeLeaveItem extends React.PureComponent<AllProps, IEmployeeLeaveItemState> {
    public state: IEmployeeLeaveItemState = {
        tempPointsStringValue: "0",
    };

    private refPointsInput: NumericInput | null = null;
    private refPointsStringValue: string = "";

    public render() {
        const leaveTypeTemp: UserLeaveTypes = UserLeaveTypes.FULL_DAY;
        return (
            <Container>
                {/* <div>
                    Image here
                </div> */}
                {/* <DatePicker
                    showActionsBar={true}
                    value={getDateFromUTCEpoch(1553145938)}
                    // onChange={this.onChangeBeginOnInput}
                    timePrecision={TimePrecision.MINUTE}
                /> */}
                <DateInput
                    {...DATE_FORMATS[0]}
                    // defaultValue={this.props.leaveRequest.reason}
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                    value={getDateFromUTCEpoch(this.props.leaveRequest.leaveDate)}
                    onChange={this.handleLeaveDateChange}
                    showActionsBar={true}
                    popoverProps={{
                        position: Position.BOTTOM,
                        usePortal: false,
                    }}
                    timePrecision={TimePrecision.MINUTE}
                    disabled={!this.props.isAddMode}
                />
                <div
                    style={{
                        flexGrow: 1,
                    }}
                >
                    <InputGroup
                        placeholder={"Leave reason ..."}
                        value={this.props.leaveRequest.reason}
                        readOnly={!this.props.isAddMode}
                        style={{
                            paddingRight: "15px",
                        }}
                        disabled={!this.props.isAddMode}
                        onChange={(e) => {
                            this.onChangeLeaveReason(e.target.value);
                        }}
                    />
                </div>
                {
                    !this.props.isAddMode ?
                    <Button
                        // icon={IconNames.STAR}
                        style={{
                            width: "110px",
                        }}
                        className={Classes.FILL}
                        loading={false}
                        text={`${this.props.leaveRequest.hourLeaveAmount} points`}
                        disabled={true}
                        intent={Intent.NONE}
                    /> :
                    <UserLeaveTypeSelect
                        {...userLeaveTypeSelectProps}
                        items={USER_LEAVE_TYPES}
                        // {...flags}
                        filterable={false}
                        disabled={false}
                        // isItemDisabled={false}
                        // initialContent={undefined}
                        noResults={<MenuItem disabled={true} text="No results." />}
                        onItemSelect={this.onChangeUserLeaveType}
                        popoverProps={{
                            minimal: true,
                            usePortal: false,
                            autoFocus: true,
                            enforceFocus: true,
                            position: "auto",
                            boundary: "viewport",
                        }}
                    >
                        <Button
                            // icon={IconNames.STAR}
                            className={Classes.FILL}
                            style={{
                                width: "110px",
                            }}
                            loading={false}
                            rightIcon={IconNames.CARET_DOWN}
                            text={
                                this.props.leaveRequest.leaveType ?
                                `${this.props.leaveRequest.leaveType}` : "(No selection)"
                            }
                            disabled={false}
                            intent={Intent.NONE}
                        />
                    </UserLeaveTypeSelect>
                }
                {
                    !this.props.isAddMode ?
                    <Button
                        icon={IconNames.REMOVE}
                        loading={this.props.isLoading}
                        disabled={false}
                        intent={Intent.DANGER}
                        onClick={this.handleDelete}
                    /> :
                    <Button
                        icon={IconNames.ADD}
                        loading={this.props.isLoading}
                        disabled={false}
                        intent={Intent.PRIMARY}
                        onClick={this.handleAdd}
                    />
                }
            </Container>
        );
    }

    private onChangeUserLeaveType = (userLeaveType: UserLeaveTypes) => {
        if (!_.isUndefined(this.props.onDataChange)) {
            this.props.onDataChange({
                ...this.props.leaveRequest,
                leaveType: userLeaveType,
            });
        }
    }

    private handleLeaveDateChange = (date: Date | null) => {
        if (!_.isNull(date) && !_.isUndefined(this.props.onDataChange)) {
            this.props.onDataChange({
                ...this.props.leaveRequest,
                leaveDate: getEpochSecondsOfDate(date),
            });
        }
    }

    private onChangeLeaveReason = (reason: string) => {
        if (!_.isUndefined(this.props.onDataChange)) {
            this.props.onDataChange({
                ...this.props.leaveRequest,
                reason,
            });
        }
    }

    private handleAdd = () => {
        if (!_.isUndefined(this.props.onRequestLeave)) {
            this.props.onRequestLeave(this.props.user, this.props.leaveRequest);
        }
    }

    private handleDelete = () => {
        if (!_.isUndefined(this.props.onDeleteRequestLeave)) {
            this.props.onDeleteRequestLeave(this.props.leaveRequest);
        }
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ users }: IApplicationState) => ({

});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(EmployeeLeaveItem);

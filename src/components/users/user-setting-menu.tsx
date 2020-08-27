/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Alignment,
    Classes,
    Icon,
    Menu,
    MenuDivider,
    MenuItem,
    Popover,
    Position,
    Switch,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as dialogsActions from "../../store/dialogs/actions";
import * as leaveRequestsActions from "../../store/leaverequests/actions";
import { ILeaveRequest } from "../../store/leaverequests/types";
import * as loginsActions from "../../store/logins/actions";
import * as navbarActions from "../../store/navbar/actions";
import { IProject } from "../../store/projects/types";
import * as usersActions from "../../store/users/actions";
import { IUser, UserLeaveTypes } from "../../store/users/types";
import { getEpochSecondsOfDate } from "../../utils/dates";
import SprintRequirementListContextMenu from "../users/sprint-requirement-list-context-menu";

// Props passed from mapStateToProps
interface IPropsFromState {
    isUsingDarkTheme: boolean;
    userLoading: boolean;
    currentProject: IProject;
    createLeaveRequestInput: ILeaveRequest;
}

// Props passed from mapDispatchToProps
interface IPropsFromDispatch {
    enableDarkTheme: typeof navbarActions.enableDarkTheme;
    logout: typeof loginsActions.logout;
    openEmployeePerformanceReviewDialog: typeof dialogsActions.openEmployeePerformanceReviewDialog;
    updateUserSetInput: typeof usersActions.updateUserSetInput;
    createLeaveRequestSetInput: typeof leaveRequestsActions.createLeaveRequestSetInput;
}

// Component-specific props.
interface IOwnProps {
    user: IUser;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

// type UserSettingMenuProps = {
//     enableDarkTheme: boolean,
//     onToggleDarkTheme: any
// }

class UserSettingMenu extends React.PureComponent<AllProps> {
    public render() {
        return (
            <Menu className={Classes.ELEVATION_1}>
                <MenuDivider title="Employment" />
                <MenuItem
                    icon={IconNames.COMPARISON}
                    text="Performance review"
                    // disabled={true}
                    shouldDismissPopover={true}
                    onClick={this.handlePerformanceReview}
                />
            </Menu>
        );
    }

    public onToggleDarkTheme = () => {
        this.props.enableDarkTheme(!this.props.isUsingDarkTheme);
    }

    private handleLogout = () => {
        this.props.logout();
    }

    private handlePerformanceReview = () => {
        this.props.updateUserSetInput(this.props.user, true);
        this.props.createLeaveRequestSetInput({
            ...this.props.createLeaveRequestInput,
            hourLeaveAmount:
                _.isUndefined(this.props.user.minDailyUnitPointsRequirement) ?
                0 : this.props.user.minDailyUnitPointsRequirement,
            leaveType: UserLeaveTypes.FULL_DAY,
            leaveDate: getEpochSecondsOfDate(new Date()),
            reason: "",
            requesterUserID: this.props.user.id,
        });
        this.props.openEmployeePerformanceReviewDialog(true);
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar, users, board, leaveRequests}: IApplicationState) => ({
    isUsingDarkTheme: navbar.isUsingDarkTheme,
    userLoading: users.loading,
    currentProject: board.project,
    createLeaveRequestInput: leaveRequests.createLeaveRequestInput,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    enableDarkTheme: (enableDarkTheme: boolean) => dispatch(navbarActions.enableDarkTheme(enableDarkTheme)),
    logout: () => dispatch(loginsActions.logout()),
    openEmployeePerformanceReviewDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openEmployeePerformanceReviewDialog(isOpen)),
    updateUserSetInput: (user: IUser, firstLoad?: boolean) =>
        dispatch(usersActions.updateUserSetInput(user, firstLoad)),
    createLeaveRequestSetInput: (input: ILeaveRequest) =>
        dispatch(leaveRequestsActions.createLeaveRequestSetInput(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserSettingMenu);

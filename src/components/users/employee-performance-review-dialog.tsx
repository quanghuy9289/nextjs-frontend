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
    Dialog,
    Intent,
    Position,
    Slider,
    Spinner,
    Switch,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import _ from "lodash";
import React, { FormEvent, useState } from "react";
import { Cookies } from "react-cookie";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState } from "../../store";
import { IStandardColor } from "../../store/colors/types";
import * as dialogsActions from "../../store/dialogs/actions";
import * as projectsActions from "../../store/projects/actions";
import * as sprintrequirementsActions from "../../store/sprintrequirements/actions";
import { ISprintRequirement } from "../../store/sprintrequirements/types";
import { ISprint } from "../../store/sprints/types";
import * as usersActions from "../../store/users/actions";
import { IUser } from "../../store/users/types";
import { combineIDs } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import EmployeePerformanceReviewPanel from "./employee-performance-review-panel";

interface IEmployeePerformanceReviewDialogState {
    displayActiveOnly: boolean;
}

interface IPropsFromState {
    loadedSprintID?: string;
    currentSprint: ISprint;
    sprintMap: IStringTMap<ISprint>;
    userMap: IStringTMap<IUser>;
    updateUserInput: IUser;
    updateUserLoading: boolean;
    updateUserEdited: boolean;
}

interface IPropsFromDispatch {
    openEmployeePerformanceReviewDialog: typeof dialogsActions.openEmployeePerformanceReviewDialog;
    getSprintRequirementRequestBySprintAndUser:
    typeof sprintrequirementsActions.getSprintRequirementRequestBySprintAndUser;
    updateUserRequest: typeof usersActions.updateUserRequest;
}

interface IOwnProps {
    isOpen: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class EmployeePerformanceReviewDialog extends React.PureComponent<AllProps, IEmployeePerformanceReviewDialogState> {
    public state: IEmployeePerformanceReviewDialogState = {
        displayActiveOnly: false,
    };
    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // To do
    }

    public render() {
        // Get sprint
        const sprint: ISprint | undefined = this.getCurrentSprint();
        return (
            <Dialog
                icon={IconNames.CONFIRM}
                onClose={this.handleCloseDialog}
                title="Performance review"
                isOpen={this.props.isOpen}
                canEscapeKeyClose={true}
                canOutsideClickClose={true}
                isCloseButtonShown={true}
                style={{
                    width: "80%",
                    maxWidth: "800px",
                }}
            >
                <div className={Classes.DIALOG_BODY}>
                    <EmployeePerformanceReviewPanel
                        user={this.props.updateUserInput}
                    />
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Tooltip
                            position={Position.BOTTOM_RIGHT}
                            content="Close"
                        >
                            <Button
                                onClick={this.handleCloseDialog}
                            // disabled={this.props.isLoginLoading}
                            >
                                Cancel
                            </Button>
                        </Tooltip>
                        <Tooltip
                            position={Position.BOTTOM_RIGHT}
                            content="Download performance review report"
                        // disabled={true}
                        >
                            <Button
                                onClick={this.handleCloseDialog}
                            // disabled={true}
                            >
                                Performance review
                            </Button>
                        </Tooltip>
                        <Tooltip
                            position={Position.BOTTOM_RIGHT}
                            content="Save"
                        >
                            <Button
                                onClick={this.handleSaveChanges}
                                disabled={!this.props.updateUserEdited}
                                loading={this.props.updateUserLoading}
                                intent={Intent.PRIMARY}
                            >
                                Save
                            </Button>
                        </Tooltip>
                        <Tooltip
                            position={Position.BOTTOM_RIGHT}
                            content="Delete"
                        >
                            <Button
                                onClick={this.handleDelete}
                                disabled={true}
                                loading={this.props.updateUserLoading}
                                intent={Intent.DANGER}
                            >
                                Delete
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </Dialog>
        );
    }

    private handleCloseDialog = () => {
        this.props.openEmployeePerformanceReviewDialog(false);
    }

    private handleToggleActive = () => {
        this.setState({
            displayActiveOnly: !this.state.displayActiveOnly,
        });
    }

    private getCurrentSprint = () => {
        const sprint: ISprint | undefined = this.props.loadedSprintID === undefined ?
            this.props.currentSprint :
            this.props.sprintMap[this.props.loadedSprintID];
        return sprint;
    }

    private handleRefresh = () => {
        const sprint: ISprint | undefined = this.getCurrentSprint();
        _.values(this.props.userMap).forEach((eachUser: IUser) => {
            this.props.getSprintRequirementRequestBySprintAndUser(
                sprint.id, eachUser.id,
            );
        });
    }

    private handleSaveChanges = () => {
        this.props.updateUserRequest(this.props.updateUserInput);
    }

    private handleDelete = () => {
        // Do something
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ board, users }: IApplicationState) => ({
    loadedSprintID: board.loadedSprintID,
    currentSprint: board.project.currentSprint,
    sprintMap: board.sprintMap,
    userMap: users.userMap,
    updateUserInput: users.updateUserInput,
    updateUserLoading: users.updateUserLoading,
    updateUserEdited: users.updateUserEdited,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openEmployeePerformanceReviewDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openEmployeePerformanceReviewDialog(isOpen)),
    getSprintRequirementRequestBySprintAndUser: (sprintID: string, userID: string) =>
        dispatch(sprintrequirementsActions.getSprintRequirementRequestBySprintAndUser(sprintID, userID)),
    updateUserRequest: (input: IUser) =>
        dispatch(usersActions.updateUserRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(EmployeePerformanceReviewDialog);

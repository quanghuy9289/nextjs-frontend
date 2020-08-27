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
import React, { FormEvent } from "react";
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
import { IUser } from "../../store/users/types";
import { combineIDs } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import SprintRequirementPanel from "./sprint-requirement-panel";

interface ISprintRequirementDialogState {
    displayActiveOnly: boolean;
}

interface IPropsFromState {
    loadedSprintID?: string;
    currentSprint: ISprint;
    sprintMap: IStringTMap<ISprint>;
    userMap: IStringTMap<IUser>;
}

interface IPropsFromDispatch {
    openSprintRequirementDialog: typeof dialogsActions.openSprintRequirementDialog;
    getSprintRequirementRequestBySprintAndUser:
    typeof sprintrequirementsActions.getSprintRequirementRequestBySprintAndUser;
}

interface IOwnProps {
    isOpen: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class SprintRequirementDialog extends React.PureComponent<AllProps, ISprintRequirementDialogState> {
    public state: ISprintRequirementDialogState = {
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
                title="Sprint requirement"
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
                    <SprintRequirementPanel
                        sprint={sprint}
                        displayActiveOnly={this.state.displayActiveOnly}
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
                            content="Refresh the sprint requirement data"
                        >
                            <Button
                                onClick={this.handleRefresh}
                            >
                                Refresh
                            </Button>
                        </Tooltip>
                        <Tooltip
                            position={Position.BOTTOM_RIGHT}
                            content={
                                this.state.displayActiveOnly ?
                                    "Toggle all sprint requirement" :
                                    "Toggle active sprint requirement"
                            }
                        >
                            <Button
                                onClick={this.handleToggleActive}
                            >
                                {this.state.displayActiveOnly ? "Toggle all" : "Toggle active"}
                            </Button>
                        </Tooltip>
                        <Tooltip
                            position={Position.BOTTOM_RIGHT}
                            content="Download sprint report"
                            disabled={true}
                        >
                            <Button
                                onClick={this.handleCloseDialog}
                                disabled={true}
                            >
                                Report
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </Dialog>
        );
    }

    private handleCloseDialog = () => {
        this.props.openSprintRequirementDialog(false);
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
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ board, users }: IApplicationState) => ({
    loadedSprintID: board.loadedSprintID,
    currentSprint: board.project.currentSprint,
    sprintMap: board.sprintMap,
    userMap: users.userMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openSprintRequirementDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openSprintRequirementDialog(isOpen)),
    getSprintRequirementRequestBySprintAndUser: (sprintID: string, userID: string) =>
        dispatch(sprintrequirementsActions.getSprintRequirementRequestBySprintAndUser(sprintID, userID)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SprintRequirementDialog);

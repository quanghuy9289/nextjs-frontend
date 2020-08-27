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
    InputGroup,
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
import { IColumn } from "../../store/columns/types";
import * as dialogsActions from "../../store/dialogs/actions";
import * as projectsActions from "../../store/projects/actions";
import { IProjectUpdateCurrentSprintInput } from "../../store/projects/types";
import * as sprintrequirementsActions from "../../store/sprintrequirements/actions";
import { ISprintRequirement } from "../../store/sprintrequirements/types";
import { ISprint, ISprintUpdateInput } from "../../store/sprints/types";
import { IUser } from "../../store/users/types";
import { combineIDs } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import SprintRequirementPanel from "./sprint-requirement-panel";

interface ISprintMoveToDialogState {
    displayActiveOnly: boolean;
    selectedColumnMap: IStringTMap<boolean>;
}

interface IPropsFromState {
    updateSprintInput: ISprintUpdateInput;
    columnMap: IStringTMap<IColumn>;
    columnsOrder: string[];
    updateProjectCurrentSprintLoading: boolean;
}

interface IPropsFromDispatch {
    openSprintMoveToDialog: typeof dialogsActions.openSprintMoveToDialog;
    getSprintRequirementRequestBySprintAndUser:
    typeof sprintrequirementsActions.getSprintRequirementRequestBySprintAndUser;
    updateProjectCurrentSprintRequest:
    typeof projectsActions.updateProjectCurrentSprintRequest;
}

interface IOwnProps {
    isOpen: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class SprintMoveToDialog extends React.PureComponent<AllProps, ISprintMoveToDialogState> {
    public state: ISprintMoveToDialogState = {
        displayActiveOnly: false,
        selectedColumnMap: {

        },
    };
    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // To do
    }

    public render() {
        // Get sprint
        return (
            <Dialog
                icon={IconNames.CONFIRM}
                onClose={this.handleCloseDialog}
                title="Select column(s) to stay"
                isOpen={this.props.isOpen}
                canEscapeKeyClose={true}
                canOutsideClickClose={true}
                isCloseButtonShown={true}
                style={{
                    width: "80%",
                    maxWidth: "370px",
                }}
            >
                <div className={Classes.DIALOG_BODY}>
                    {/* <SprintRequirementPanel
                        sprint={sprint}
                        displayActiveOnly={this.state.displayActiveOnly}
                    /> */}
                    {this.props.columnsOrder.map((eachColumnID: string) => {
                        const column: IColumn | undefined = this.props.columnMap[eachColumnID];
                        if (column !== undefined) {
                            return (
                                <InputGroup
                                    key={column.id}
                                    value={column.title}
                                    readOnly={true}
                                    style={{
                                        paddingRight: "15px",
                                    }}
                                    // disabled={true}
                                    rightElement={
                                        <Button
                                            active={true}
                                            icon={
                                                this.state.selectedColumnMap[eachColumnID] === true ?
                                                    IconNames.TICK :
                                                    undefined
                                            }
                                            onClick={(e) => {
                                                this.setState({
                                                    selectedColumnMap: {
                                                        ...this.state.selectedColumnMap,
                                                        [eachColumnID]: !(
                                                            this.state.selectedColumnMap[eachColumnID] === true
                                                        ),
                                                    },
                                                });
                                            }}
                                            style={{
                                                maxWidth: `24px`,
                                                maxHeight: `24px`,
                                                borderRadius: "2px",
                                                overflow: "hidden",
                                                padding: "0px",
                                                marginRight: "5px",
                                                justifyContent: "center",
                                            }}
                                        />
                                    }
                                    onChange={(e) => {
                                        // this.onTitleChange(e.target.value);
                                    }}
                                />
                            );
                        }
                    })}
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            onClick={this.handleCloseDialog}
                        // disabled={this.props.isLoginLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={this.handleMoveToSprint}
                            // disabled={true}
                            loading={this.props.updateProjectCurrentSprintLoading}
                        >
                            Move
                        </Button>
                    </div>
                </div>
            </Dialog>
        );
    }

    private handleCloseDialog = () => {
        this.props.openSprintMoveToDialog(false);
    }

    private handleMoveToSprint = () => {
        this.handleCloseDialog();
        // Filter out what columns has been selected to stay
        const stayedColumnIDs: string[] = [];
        _.map(this.state.selectedColumnMap, (isStayed, columnID) => {
            if (isStayed === true) {
                stayedColumnIDs.push(columnID);
            }
        });
        this.props.updateProjectCurrentSprintRequest({
            id: this.props.updateSprintInput.projectID,
            sprintID: this.props.updateSprintInput.id,
            stayedColumnIDs,
        });
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ board, sprints, projects }: IApplicationState) => ({
    columnMap: board.columnMap,
    columnsOrder: board.columnsOrder,
    updateSprintInput: sprints.updateSprintInput,
    updateProjectCurrentSprintLoading: projects.updateProjectCurrentSprintLoading,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openSprintMoveToDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openSprintMoveToDialog(isOpen)),
    getSprintRequirementRequestBySprintAndUser: (sprintID: string, userID: string) =>
        dispatch(sprintrequirementsActions.getSprintRequirementRequestBySprintAndUser(sprintID, userID)),
    updateProjectCurrentSprintRequest: (input: IProjectUpdateCurrentSprintInput) =>
        dispatch(projectsActions.updateProjectCurrentSprintRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SprintMoveToDialog);

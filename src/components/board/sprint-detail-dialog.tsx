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
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as boardActions from "../../store/board/actions";
import * as dialogsActions from "../../store/dialogs/actions";
import * as projectsActions from "../../store/projects/actions";
import { IProject, IProjectUpdateCurrentSprintInput } from "../../store/projects/types";
import * as sprintsActions from "../../store/sprints/actions";
import {
    ISprint,
    ISprintCommonResult,
    ISprintCreateInput,
    ISprintDeleteInput,
    ISprintUpdateInput,
} from "../../store/sprints/types";
import SprintDetailPanel from "./sprint-detail-panel";

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

interface ISprintDetailState {
    isConfirmingDelete: boolean;
}

interface IPropsFromState {
    // addSprintState: IAddSprintState;
    createSprintInput: ISprintCreateInput;
    createSprintLoading: boolean;
    createSprintResult: ISprintCommonResult;
    updateSprintInput: ISprintUpdateInput;
    updateProjectCurrentSprintLoading: boolean;
    getBoardLoading: boolean;
    currentProject: IProject;
}

interface IPropsFromDispatch {
    openAddSprintDialog: typeof dialogsActions.openAddSprintDialog;
    openEditSprintDialog: typeof dialogsActions.openEditSprintDialog;
    createSprintRequest: typeof sprintsActions.createSprintRequest;
    createSprintSetInput: typeof sprintsActions.createSprintSetInput;
    createSprintSetResult: typeof sprintsActions.createSprintSetResult;
    deleteSprintRequest: typeof sprintsActions.deleteSprintRequest;
    deleteSprintFromBoard: typeof boardActions.deleteSprintFromBoard;
    updateProjectCurrentSprintRequest: typeof projectsActions.updateProjectCurrentSprintRequest;
    getBoardRequest: typeof boardActions.getBoardRequest;
    setBoardLoadedSprint: typeof boardActions.setBoardLoadedSprint;
    openSprintMoveToDialog: typeof dialogsActions.openSprintMoveToDialog;
}

interface IOwnProps {
    isOpen: boolean;
    title: string;
    isAdd: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class SprintDetailDialog extends React.PureComponent<AllProps, ISprintDetailState> {
    public state: ISprintDetailState = {
        isConfirmingDelete: false,
    };
    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // To do
    }

    public render() {
        // const {role} = this.state;
        return (
            <Dialog
                icon={IconNames.INFO_SIGN}
                onClose={this.handleCloseDialog}
                title={this.props.title}
                isOpen={this.props.isOpen}
                style={{
                    width: "80%",
                }}
            >
                <div className={Classes.DIALOG_BODY}>
                    <SprintDetailPanel
                        isAdd={this.props.isAdd}
                    />
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Tooltip
                            position={Position.BOTTOM_RIGHT}
                            content="Close without save"
                        >
                            <Button
                                onClick={this.handleCloseDialog}
                            >
                                Close
                            </Button>
                        </Tooltip>
                        {
                            this.props.isAdd ?
                                (this.props.createSprintResult.id === undefined ?
                                    (
                                        <Tooltip
                                            position={Position.BOTTOM_RIGHT}
                                            content={"Add new sprint"}
                                        >
                                            <Button
                                                intent={Intent.PRIMARY}
                                                loading={this.props.createSprintLoading}
                                                onClick={this.handleCreate}
                                            >
                                                {"Add"}
                                            </Button>
                                        </Tooltip>
                                    ) :
                                    (
                                        <Tooltip
                                            position={Position.BOTTOM_RIGHT}
                                            content="Add more sprint"
                                        >
                                            <Button
                                                intent={Intent.PRIMARY}
                                                onClick={this.handleCreateMore}
                                                loading={this.props.createSprintLoading}
                                            // disabled={this.props.isLoginLoading}
                                            >
                                                Add more
                                    </Button>
                                        </Tooltip>
                                    )) :
                                (
                                    !this.state.isConfirmingDelete ?
                                        [
                                            <Tooltip
                                                key="TTSetCurrentSprint"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"Set this sprint as the current sprint of the project"}
                                            >
                                                <Button
                                                    intent={Intent.PRIMARY}
                                                    onClick={this.handleSetProjectCurrentSprint}
                                                    loading={this.props.updateProjectCurrentSprintLoading}
                                                >
                                                    Move to
                                        </Button>
                                            </Tooltip>,
                                            <Tooltip
                                                key="TTSwitchToThisSprint"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"Tell board to load sprint"}
                                            >
                                                <Button
                                                    intent={Intent.PRIMARY}
                                                    onClick={this.handleSwitchSprint}
                                                    loading={this.props.getBoardLoading}
                                                >
                                                    Load
                                        </Button>
                                            </Tooltip>,
                                            <Tooltip
                                                key="TTDeleteThisSprint"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"Delete this sprint"}
                                            >
                                                <Button
                                                    intent={Intent.DANGER}
                                                    loading={this.props.createSprintLoading}
                                                    onClick={this.handleDelete}
                                                >
                                                    Delete
                                        </Button>
                                            </Tooltip>,
                                            // Auto save so don't need save button
                                            // <Tooltip
                                            //     key="TTSaveExistingSprint"
                                            //     position={Position.BOTTOM_RIGHT}
                                            //     content={"Save sprint"}
                                            // >
                                            //     <Button
                                            //         intent={Intent.PRIMARY}
                                            //         loading={this.props.createSprintLoading}
                                            //         onClick={this.handleSave}
                                            //     >
                                            //         Save
                                            //     </Button>
                                            // </Tooltip>,
                                        ] :
                                        [
                                            <Button
                                                key="ButtonDeleteDisplayConfirmMessage"
                                                intent={Intent.NONE}
                                                minimal={true}
                                                disabled={true}
                                            >
                                                Are you sure ?
                                    </Button>,
                                            <Tooltip
                                                key="TTDeleteThisSprintYes"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"Confirm that you want to delete this sprint"}
                                            >
                                                <Button
                                                    intent={Intent.PRIMARY}
                                                    onClick={this.handleConfirmDelete}
                                                >
                                                    Yes
                                        </Button>
                                            </Tooltip>,
                                            <Tooltip
                                                key="TTDeleteThisSprintNo"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"You don't want to delete this sprint"}
                                            >
                                                <Button
                                                    intent={Intent.NONE}
                                                    onClick={this.handleNotConfirmDelete}
                                                >
                                                    No
                                        </Button>
                                            </Tooltip>,
                                        ]
                                )
                        }
                    </div>
                </div>
            </Dialog>
        );
    }

    private handleCloseDialog = () => {
        // To do
        if (this.props.isAdd) {
            this.props.openAddSprintDialog(false);
        } else {
            this.props.openEditSprintDialog(false);
        }
        this.handleCreateMore();
    }

    private handleCreate = () => {
        if (this.props.isAdd) {
            this.props.createSprintRequest(this.props.createSprintInput);
        } else {
            // this.props.createSprintRequest({

            // })
        }
    }

    private handleCreateMore = () => {
        if (this.props.isAdd) {
            this.props.createSprintSetInput({
                ...this.props.createSprintInput,
                name: "",
            });

            this.props.createSprintSetResult({
                id: undefined,
                errors: undefined,
            });
        } else {
            // this.props.createSprintRequest({

            // })
        }
    }

    private handleSave = () => {
        // To do
    }

    private handleNotConfirmDelete = () => {
        this.setState({
            isConfirmingDelete: false,
        });
    }

    private handleConfirmDelete = () => {
        this.setState({
            isConfirmingDelete: false,
        });

        this.props.deleteSprintRequest({
            id: this.props.updateSprintInput.id,
        });

        this.props.deleteSprintFromBoard({
            id: this.props.updateSprintInput.id,
        });

        this.props.openEditSprintDialog(false);
    }

    private handleDelete = () => {
        this.setState({
            isConfirmingDelete: true,
        });
    }

    private handleSwitchSprint = () => {
        this.props.setBoardLoadedSprint(this.props.updateSprintInput.id);
        this.props.getBoardRequest(
            this.props.currentProject.shortcode,
            this.props.updateSprintInput.id,
        );
    }

    private handleSetProjectCurrentSprint = () => {
        this.props.openSprintMoveToDialog(true);
        // this.props.updateProjectCurrentSprintRequest({
        //     id: this.props.updateSprintInput.projectID,
        //     sprintID: this.props.updateSprintInput.id,
        // });
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ sprints, projects, board }: IApplicationState) => ({
    // addSprintState: sprints.addSprintState,
    createSprintInput: sprints.createSprintInput,
    createSprintLoading: sprints.createSprintLoading,
    createSprintResult: sprints.createSprintResult,
    updateSprintInput: sprints.updateSprintInput,
    updateProjectCurrentSprintLoading: projects.updateProjectCurrentSprintLoading,
    getBoardLoading: board.getBoardLoading,
    currentProject: board.project,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openAddSprintDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openAddSprintDialog(isOpen)),
    openEditSprintDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openEditSprintDialog(isOpen)),
    createSprintRequest: (input: ISprintCreateInput) =>
        dispatch(sprintsActions.createSprintRequest(input)),
    createSprintSetInput: (input: ISprintCreateInput) =>
        dispatch(sprintsActions.createSprintSetInput(input)),
    createSprintSetResult: (result: ISprintCommonResult) =>
        dispatch(sprintsActions.createSprintSetResult(result)),
    deleteSprintRequest: (input: ISprintDeleteInput) =>
        dispatch(sprintsActions.deleteSprintRequest(input)),
    deleteSprintFromBoard: (input: ISprintDeleteInput) =>
        dispatch(boardActions.deleteSprintFromBoard(input)),
    updateProjectCurrentSprintRequest: (input: IProjectUpdateCurrentSprintInput) =>
        dispatch(projectsActions.updateProjectCurrentSprintRequest(input)),
    getBoardRequest: (projectShortcode: string, sprintID?: string) =>
        dispatch(boardActions.getBoardRequest(projectShortcode, sprintID)),
    setBoardLoadedSprint: (sprintID: string) =>
        dispatch(boardActions.setBoardLoadedSprint(sprintID)),
    openSprintMoveToDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openSprintMoveToDialog(isOpen)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SprintDetailDialog);

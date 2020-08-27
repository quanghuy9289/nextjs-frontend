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
import { ICreateProjectInput, ICreateProjectResult } from "../../store/projects/types";
import ProjectDetailPanel from "./project-detail-panel";

interface IPropsFromState {
    createProjectLoading: boolean;
    createProjectInput: ICreateProjectInput;
    createProjectResult: ICreateProjectResult;
    defaultProjectColor: IStandardColor;
}

interface IPropsFromDispatch {
    openCreateProjectDialog: typeof dialogsActions.openCreateProjectDialog;
    createProjectRequest: typeof projectsActions.createProjectRequest;
    createProjectSetResult: typeof projectsActions.createProjectSetResult;
    createProjectSetInput: typeof projectsActions.createProjectSetInput;
}

interface IOwnProps {
    isOpen: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class ProjectDetailDialog extends React.PureComponent<AllProps> {
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
                icon={IconNames.PROJECTS}
                onClose={this.handleCloseDialog}
                title="Create new project"
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
                    <ProjectDetailPanel />
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
                        {this.props.createProjectResult.id === undefined ?
                            (
                                <Tooltip
                                    position={Position.BOTTOM_RIGHT}
                                    content="Create new project"
                                >
                                    <Button
                                        intent={Intent.PRIMARY}
                                        onClick={this.handleCreateProject}
                                        loading={this.props.createProjectLoading}
                                    // disabled={this.props.isLoginLoading}
                                    >
                                        Create
                                    </Button>
                                </Tooltip>
                            ) :
                            (
                                <Tooltip
                                    position={Position.BOTTOM_RIGHT}
                                    content="Create more"
                                >
                                    <Button
                                        intent={Intent.PRIMARY}
                                        onClick={this.handleCreateMoreProject}
                                        loading={this.props.createProjectLoading}
                                    // disabled={this.props.isLoginLoading}
                                    >
                                        Create more
                                    </Button>
                                </Tooltip>
                            )
                        }
                    </div>
                </div>
            </Dialog>
        );
    }

    private handleCloseDialog = () => {
        this.props.openCreateProjectDialog(false);
        this.handleCreateMoreProject();
    }

    private handleCreateProject = () => {
        if (this.props.createProjectInput.minUnitPoints > this.props.createProjectInput.maxUnitPoints) {
            this.props.createProjectSetResult({
                id: undefined,
                errors: "The mininum unit points is greater than the maximum unit points",
            });
            return;
        }
        if (_.isEmpty(this.props.createProjectInput.name)) {
            this.props.createProjectSetResult({
                id: undefined,
                errors: "The name of the project can not be empty",
            });
            return;
        }
        this.props.createProjectRequest(this.props.createProjectInput);
    }

    private handleCreateMoreProject = () => {
        this.props.createProjectSetResult({
            errors: undefined,
            id: undefined,
        });

        this.props.createProjectSetInput({
            members: [],
            name: "",
            color: this.props.defaultProjectColor,
            minUnitPoints: 0,
            maxUnitPoints: 100,
        });
    }

    private validateInputs = () => {
        const isFormValid = true;

        return isFormValid;
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ projects }: IApplicationState) => ({
    createProjectLoading: projects.createProjectLoading,
    createProjectInput: projects.createProjectInput,
    createProjectResult: projects.createProjectResult,
    defaultProjectColor: projects.defaultProjectColor,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openCreateProjectDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openCreateProjectDialog(isOpen)),
    createProjectSetResult: (result: ICreateProjectResult) =>
        dispatch(projectsActions.createProjectSetResult(result)),
    createProjectSetInput: (input: ICreateProjectInput) =>
        dispatch(projectsActions.createProjectSetInput(input)),
    createProjectRequest: (input: ICreateProjectInput) =>
        dispatch(projectsActions.createProjectRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProjectDetailDialog);

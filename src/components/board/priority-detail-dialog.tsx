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
import * as prioritiesActions from "../../store/priorities/actions";
import {
    IAddPriorityState,
    IEditPriorityState,
    IPriority,
    IPriorityCommonResult,
    IPriorityCreateInput,
    IPriorityDeleteInput,
    IPriorityUpdateInput,
} from "../../store/priorities/types";
import PriorityDetailPanel from "./priority-detail-panel";

const Container = styled.div`
    // display: flex;
    flex-direction: priority;
    flex-grow: 1;
    padding-left: 20px;
    padding-top: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    overflow: auto;
`;

interface IPriorityDetailState {
    isConfirmingDelete: boolean;
}

interface IPropsFromState {
    editPriorityState: IEditPriorityState;
    // addPriorityState: IAddPriorityState;
    createPriorityInput: IPriorityCreateInput;
    createPriorityLoading: boolean;
    createPriorityResult: IPriorityCommonResult;
    updatePriorityInput: IPriorityUpdateInput;
}

interface IPropsFromDispatch {
    openAddPriorityDialog: typeof dialogsActions.openAddPriorityDialog;
    openEditPriorityDialog: typeof dialogsActions.openEditPriorityDialog;
    createPriorityRequest: typeof prioritiesActions.createPriorityRequest;
    createPrioritySetInput: typeof prioritiesActions.createPrioritySetInput;
    createPrioritySetResult: typeof prioritiesActions.createPrioritySetResult;
    deletePriorityRequest: typeof prioritiesActions.deletePriorityRequest;
    deletePriorityFromBoard: typeof boardActions.deletePriorityFromBoard;
}

interface IOwnProps {
    isOpen: boolean;
    title: string;
    isAdd: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class PriorityDetailDialog extends React.PureComponent<AllProps, IPriorityDetailState> {
    public state: IPriorityDetailState = {
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
                    <PriorityDetailPanel
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
                                (this.props.createPriorityResult.id === undefined ?
                                    (
                                        <Tooltip
                                            position={Position.BOTTOM_RIGHT}
                                            content={"Add new priority"}
                                        >
                                            <Button
                                                intent={Intent.PRIMARY}
                                                loading={this.props.createPriorityLoading}
                                                onClick={this.handleCreate}
                                            >
                                                {"Add"}
                                            </Button>
                                        </Tooltip>
                                    ) :
                                    (
                                        <Tooltip
                                            position={Position.BOTTOM_RIGHT}
                                            content="Add more priority"
                                        >
                                            <Button
                                                intent={Intent.PRIMARY}
                                                onClick={this.handleCreateMore}
                                                loading={this.props.createPriorityLoading}
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
                                                key="TTDeleteThisPriority"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"Delete this priority"}
                                            >
                                                <Button
                                                    intent={Intent.DANGER}
                                                    loading={this.props.createPriorityLoading}
                                                    onClick={this.handleDelete}
                                                >
                                                    Delete
                                        </Button>
                                            </Tooltip>,
                                            // Auto save so don't need save button
                                            // <Tooltip
                                            //     key="TTSaveExistingPriority"
                                            //     position={Position.BOTTOM_RIGHT}
                                            //     content={"Save priority"}
                                            // >
                                            //     <Button
                                            //         intent={Intent.PRIMARY}
                                            //         loading={this.props.createPriorityLoading}
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
                                                key="TTDeleteThisPriorityYes"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"Confirm that you want to delete this priority"}
                                            >
                                                <Button
                                                    intent={Intent.PRIMARY}
                                                    onClick={this.handleConfirmDelete}
                                                >
                                                    Yes
                                        </Button>
                                            </Tooltip>,
                                            <Tooltip
                                                key="TTDeleteThisPriorityNo"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"You don't want to delete this priority"}
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
            this.props.openAddPriorityDialog(false);
        } else {
            this.props.openEditPriorityDialog(false);
        }
        this.handleCreateMore();
    }

    private handleCreate = () => {
        if (this.props.isAdd) {
            this.props.createPriorityRequest(this.props.createPriorityInput);
        } else {
            // this.props.createPriorityRequest({

            // })
        }
    }

    private handleCreateMore = () => {
        if (this.props.isAdd) {
            this.props.createPrioritySetInput({
                ...this.props.createPriorityInput,
                managers: [],
                title: "",
            });

            this.props.createPrioritySetResult({
                id: undefined,
                errors: undefined,
            });
        } else {
            // this.props.createPriorityRequest({

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

        this.props.deletePriorityRequest({
            id: this.props.updatePriorityInput.id,
        });

        this.props.deletePriorityFromBoard({
            id: this.props.updatePriorityInput.id,
        });

        this.props.openEditPriorityDialog(false);
    }

    private handleDelete = () => {
        this.setState({
            isConfirmingDelete: true,
        });
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ priorities }: IApplicationState) => ({
    editPriorityState: priorities.editPriorityState,
    // addPriorityState: priorities.addPriorityState,
    createPriorityInput: priorities.createPriorityInput,
    createPriorityLoading: priorities.createPriorityLoading,
    createPriorityResult: priorities.createPriorityResult,
    updatePriorityInput: priorities.updatePriorityInput,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openAddPriorityDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openAddPriorityDialog(isOpen)),
    openEditPriorityDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openEditPriorityDialog(isOpen)),
    createPriorityRequest: (input: IPriorityCreateInput) =>
        dispatch(prioritiesActions.createPriorityRequest(input)),
    createPrioritySetInput: (input: IPriorityCreateInput) =>
        dispatch(prioritiesActions.createPrioritySetInput(input)),
    createPrioritySetResult: (result: IPriorityCommonResult) =>
        dispatch(prioritiesActions.createPrioritySetResult(result)),
    deletePriorityRequest: (input: IPriorityDeleteInput) =>
        dispatch(prioritiesActions.deletePriorityRequest(input)),
    deletePriorityFromBoard: (input: IPriorityDeleteInput) =>
        dispatch(boardActions.deletePriorityFromBoard(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PriorityDetailDialog);

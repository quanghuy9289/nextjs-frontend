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
import * as columnsActions from "../../store/columns/actions";
import {
    IAddColumnState,
    IColumn,
    IColumnCommonResult,
    IColumnCreateInput,
    IColumnDeleteInput,
    IColumnUpdateInput,
    IEditColumnState,
} from "../../store/columns/types";
import * as dialogsActions from "../../store/dialogs/actions";
import ColumnDetailPanel from "./column-detail-panel";

const Container = styled.div`
    // display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-left: 20px;
    padding-top: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    overflow: auto;
`;

interface IColumnDetailState {
    isConfirmingDelete: boolean;
}

interface IPropsFromState {
    editColumnState: IEditColumnState;
    // addColumnState: IAddColumnState;
    createColumnInput: IColumnCreateInput;
    createColumnLoading: boolean;
    createColumnResult: IColumnCommonResult;
    updateColumnInput: IColumnUpdateInput;
}

interface IPropsFromDispatch {
    openAddColumnDialog: typeof dialogsActions.openAddColumnDialog;
    openEditColumnDialog: typeof dialogsActions.openEditColumnDialog;
    createColumnRequest: typeof columnsActions.createColumnRequest;
    createColumnSetInput: typeof columnsActions.createColumnSetInput;
    createColumnSetResult: typeof columnsActions.createColumnSetResult;
    deleteColumnRequest: typeof columnsActions.deleteColumnRequest;
    deleteColumnFromBoard: typeof boardActions.deleteColumnFromBoard;
}

interface IOwnProps {
    isOpen: boolean;
    title: string;
    isAdd: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class ColumnDetailDialog extends React.PureComponent<AllProps, IColumnDetailState> {
    public state: IColumnDetailState = {
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
                    <ColumnDetailPanel
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
                                (this.props.createColumnResult.id === undefined ?
                                    (
                                        <Tooltip
                                            position={Position.BOTTOM_RIGHT}
                                            content={"Add new column"}
                                        >
                                            <Button
                                                intent={Intent.PRIMARY}
                                                loading={this.props.createColumnLoading}
                                                onClick={this.handleCreate}
                                            >
                                                {"Add"}
                                            </Button>
                                        </Tooltip>
                                    ) :
                                    (
                                        <Tooltip
                                            position={Position.BOTTOM_RIGHT}
                                            content="Add more column"
                                        >
                                            <Button
                                                intent={Intent.PRIMARY}
                                                onClick={this.handleCreateMore}
                                                loading={this.props.createColumnLoading}
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
                                                key="TTDeleteThisColumn"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"Delete this column"}
                                            >
                                                <Button
                                                    intent={Intent.DANGER}
                                                    loading={this.props.createColumnLoading}
                                                    onClick={this.handleDelete}
                                                >
                                                    Delete
                                        </Button>
                                            </Tooltip>,
                                            // Auto save so don't need save button
                                            // <Tooltip
                                            //     key="TTSaveExistingColumn"
                                            //     position={Position.BOTTOM_RIGHT}
                                            //     content={"Save column"}
                                            // >
                                            //     <Button
                                            //         intent={Intent.PRIMARY}
                                            //         loading={this.props.createColumnLoading}
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
                                                key="TTDeleteThisColumnYes"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"Confirm that you want to delete this column"}
                                            >
                                                <Button
                                                    intent={Intent.PRIMARY}
                                                    onClick={this.handleConfirmDelete}
                                                >
                                                    Yes
                                        </Button>
                                            </Tooltip>,
                                            <Tooltip
                                                key="TTDeleteThisColumnNo"
                                                position={Position.BOTTOM_RIGHT}
                                                content={"You don't want to delete this column"}
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
            this.props.openAddColumnDialog(false);
        } else {
            this.props.openEditColumnDialog(false);
        }
        this.handleCreateMore();
    }

    private handleCreate = () => {
        if (this.props.isAdd) {
            this.props.createColumnRequest(this.props.createColumnInput);
        } else {
            // this.props.createColumnRequest({

            // })
        }
    }

    private handleCreateMore = () => {
        if (this.props.isAdd) {
            this.props.createColumnSetInput({
                ...this.props.createColumnInput,
                managers: [],
                title: "",
            });

            this.props.createColumnSetResult({
                id: undefined,
                errors: undefined,
            });
        } else {
            // this.props.createColumnRequest({

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

        this.props.deleteColumnRequest({
            id: this.props.updateColumnInput.id,
        });

        this.props.deleteColumnFromBoard({
            id: this.props.updateColumnInput.id,
        });

        this.props.openEditColumnDialog(false);
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
const mapStateToProps = ({ columns }: IApplicationState) => ({
    editColumnState: columns.editColumnState,
    // addColumnState: columns.addColumnState,
    createColumnInput: columns.createColumnInput,
    createColumnLoading: columns.createColumnLoading,
    createColumnResult: columns.createColumnResult,
    updateColumnInput: columns.updateColumnInput,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openAddColumnDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openAddColumnDialog(isOpen)),
    openEditColumnDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openEditColumnDialog(isOpen)),
    createColumnRequest: (input: IColumnCreateInput) =>
        dispatch(columnsActions.createColumnRequest(input)),
    createColumnSetInput: (input: IColumnCreateInput) =>
        dispatch(columnsActions.createColumnSetInput(input)),
    createColumnSetResult: (result: IColumnCommonResult) =>
        dispatch(columnsActions.createColumnSetResult(result)),
    deleteColumnRequest: (input: IColumnDeleteInput) =>
        dispatch(columnsActions.deleteColumnRequest(input)),
    deleteColumnFromBoard: (input: IColumnDeleteInput) =>
        dispatch(boardActions.deleteColumnFromBoard(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ColumnDetailDialog);

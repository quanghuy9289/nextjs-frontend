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
    ContextMenu,
    EditableText,
    FormGroup,
    H1,
    Icon,
    InputGroup,
    Intent,
    Popover,
    Position,
    Slider,
    Spinner,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as boardActions from "../../store/board/actions";
import { IStandardColor, IStandardColorGroup } from "../../store/colors/types";
import * as prioritiesActions from "../../store/priorities/actions";
import {
    IAddOrRemovePriorityManagerInput,
    IAddPriorityState,
    IEditPriorityState,
    IPriority,
    IPriorityCommonResult,
    IPriorityCreateInput,
    IPriorityUpdateColorInput,
    IPriorityUpdateInput,
    IPriorityUpdateTitleInput,
} from "../../store/priorities/types";
import * as usersActions from "../../store/users/actions";
import { IUser } from "../../store/users/types";
import { IStringTMap } from "../../utils/types";
import ColorsContextMenu from "../colors/colors-context-menu";
import UserAddButton from "../useraddbutton";
import UserImage from "../userimage";

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

}

interface IPropsFromState {
    createPriorityInput: IPriorityCreateInput;
    createPriorityResult: IPriorityCommonResult;
    updatePriorityInput: IPriorityUpdateInput;
    updatePriorityResult: IPriorityCommonResult;
    userMap: IStringTMap<IUser>;
    getUsersLoading: boolean;
    projectID: string;
    colorgroups: IStandardColorGroup[];
}

interface IPropsFromDispatch {
    createPrioritySetInput: typeof prioritiesActions.createPrioritySetInput;
    // setEditPriorityState: typeof prioritiesActions.setEditPriorityState;
    updatePrioritySetInput: typeof prioritiesActions.updatePrioritySetInput;
    getUsers: typeof usersActions.getUsers;
    updatePriorityTitleRequest: typeof prioritiesActions.updatePriorityTitleRequest;
    updatePriorityColorRequest: typeof prioritiesActions.updatePriorityColorRequest;
    insertOrUpdatePriorityBoard: typeof boardActions.insertOrUpdatePriorityBoard;
    addOrRemovePriorityManagerRequest: typeof prioritiesActions.addOrRemovePriorityManagerRequest;
}

interface IOwnProps {
    isAdd: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class PriorityDetailPanel extends React.PureComponent<AllProps> {

    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        if (!this.props.isAdd) {
            _.map(this.props.updatePriorityInput.managers, (eachUserID: string) => {
                const eachUser = this.props.userMap[eachUserID];
                if (eachUser === undefined) {
                    if (!this.props.getUsersLoading) {
                        this.props.getUsers();
                    }
                }
            });
        } else {
            // Set the project ID for create priority input
            this.props.createPrioritySetInput({
                ...this.props.createPriorityInput,
                projectID: this.props.projectID,
            });
        }
    }

    public render() {
        // const priority: IPriority = this.props.isAdd ?
        // this.props.addPriorityState.priority :
        // this.props.editPriorityState.priority;
        const managers: string[] = this.props.isAdd ?
            this.props.createPriorityInput.managers :
            this.props.updatePriorityInput.managers;

        const title = this.props.isAdd ?
            this.props.createPriorityInput.title :
            this.props.updatePriorityInput.title;

        const priorityColorCode: IStandardColor = this.props.isAdd ?
            this.props.createPriorityInput.backgroundColor :
            this.props.updatePriorityInput.backgroundColor;
        return (
            <Container>
                {this.props.createPriorityResult.errors === undefined ?
                    (<div />) :
                    (<Callout
                        intent={Intent.DANGER}
                        style={{ marginBottom: "20px" }}
                    >
                        Can not create your priority. Error: {this.props.createPriorityResult.errors}
                    </Callout>
                    )
                }
                {this.props.createPriorityResult.id === undefined ?
                    (
                        <div>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Title"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                <H1>
                                    <EditableText
                                        multiline={false}
                                        minLines={1}
                                        maxLines={1}
                                        value={title}
                                        confirmOnEnterKey={true}
                                        selectAllOnFocus={true}
                                        placeholder="Priority title..."
                                        onChange={this.onChangeTitleInput}
                                    />
                                </H1>
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Color code"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                <Button
                                    rightIcon={
                                        <Icon
                                            icon={IconNames.TINT}
                                            iconSize={Icon.SIZE_LARGE}
                                            color={
                                                `rgba(
                                                    ${priorityColorCode.red},
                                                    ${priorityColorCode.green},
                                                    ${priorityColorCode.blue},
                                                    ${priorityColorCode.alpha})`
                                            }
                                        />
                                    }
                                    text="Color"
                                    onClick={(e) => this.showContextMenu(e)}
                                />
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Priority managers"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                {
                                    managers.map((userID: string, index: number) => {
                                        const eachUser: IUser | undefined = this.props.userMap[userID];
                                        return (
                                            <UserImage
                                                key={userID}
                                                name={_.isUndefined(eachUser) ? "..." : eachUser.nickname}
                                                imgSource={_.isUndefined(eachUser) ? undefined : eachUser.avatarBase64}
                                                userID={userID}
                                                onRemoveUser={this.onRemoveProjectManager}
                                            />
                                        );
                                    })
                                }
                                <UserAddButton
                                    excludeMembers={managers}
                                    onSelectUser={this.onAddProjectManager}
                                    usePortal={false}
                                />
                            </FormGroup>
                        </div>
                    ) :
                    (<Callout
                        intent={Intent.SUCCESS}
                    >
                        Priority is added successfully
                    </Callout>
                    )
                }
            </Container>
        );
    }

    private onChangeTitleInput = (value: string) => {
        // this.props.setRegisterInput(e.target.value, this.props.password);
        if (this.props.isAdd) {
            this.props.createPrioritySetInput({
                ...this.props.createPriorityInput,
                title: value,
            });
        } else {
            this.props.updatePrioritySetInput({
                ...this.props.updatePriorityInput,
                title: value,
            });

            this.props.insertOrUpdatePriorityBoard({
                id: this.props.updatePriorityInput.id,
                managers: this.props.updatePriorityInput.managers,
                taskIDs: this.props.updatePriorityInput.taskIDs,
                title: value,
                backgroundColor: this.props.updatePriorityInput.backgroundColor,
            });

            this.props.updatePriorityTitleRequest({
                id: this.props.updatePriorityInput.id,
                title: value,
            });
        }
    }

    private onAddProjectManager = (selectedUser: IUser) => {
        if (this.props.isAdd) {
            this.props.createPrioritySetInput({
                ...this.props.createPriorityInput,
                managers: [...this.props.createPriorityInput.managers, selectedUser.id],
            });
        } else {
            const managers = [...this.props.updatePriorityInput.managers, selectedUser.id];
            this.props.updatePrioritySetInput({
                ...this.props.updatePriorityInput,
                managers,
            });

            this.props.insertOrUpdatePriorityBoard({
                id: this.props.updatePriorityInput.id,
                managers,
                taskIDs: this.props.updatePriorityInput.taskIDs,
                title: this.props.updatePriorityInput.title,
                backgroundColor: this.props.updatePriorityInput.backgroundColor,
            });

            this.props.addOrRemovePriorityManagerRequest({
                id: this.props.updatePriorityInput.id,
                isAdd: true,
                managerUserID: selectedUser.id,
            });
        }
    }

    private onRemoveProjectManager = (userID: string) => {
        if (this.props.isAdd) {
            this.props.createPrioritySetInput({
                ...this.props.createPriorityInput,
                managers: _.remove(
                    this.props.createPriorityInput.managers,
                    (eachUserID: string) => {
                        return eachUserID !== userID;
                    }),
            });
        } else {
            const managers = _.remove(
                this.props.updatePriorityInput.managers,
                (eachUserID: string) => {
                    return eachUserID !== userID;
                });

            this.props.updatePrioritySetInput({
                ...this.props.updatePriorityInput,
                managers,
            });

            this.props.insertOrUpdatePriorityBoard({
                id: this.props.updatePriorityInput.id,
                managers,
                taskIDs: this.props.updatePriorityInput.taskIDs,
                title: this.props.updatePriorityInput.title,
                backgroundColor: this.props.updatePriorityInput.backgroundColor,
            });

            this.props.addOrRemovePriorityManagerRequest({
                id: this.props.updatePriorityInput.id,
                isAdd: false,
                managerUserID: userID,
            });
        }
    }

    private showContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        // must prevent default to cancel parent's context menu
        e.preventDefault();
        // invoke static API, getting coordinates from mouse event
        ContextMenu.show(
            <ColorsContextMenu
                colorgroups={this.props.colorgroups}
                onSelectColor={(selectedColor: IStandardColor) => {
                    if (this.props.isAdd) {
                        this.props.createPrioritySetInput({
                            ...this.props.createPriorityInput,
                            backgroundColor: selectedColor,
                        });
                    } else {
                        this.props.updatePrioritySetInput({
                            ...this.props.updatePriorityInput,
                            backgroundColor: selectedColor,
                        });

                        this.props.insertOrUpdatePriorityBoard({
                            id: this.props.updatePriorityInput.id,
                            managers: this.props.updatePriorityInput.managers,
                            taskIDs: this.props.updatePriorityInput.taskIDs,
                            title: this.props.updatePriorityInput.title,
                            backgroundColor: selectedColor,
                        });

                        this.props.updatePriorityColorRequest({
                            id: this.props.updatePriorityInput.id,
                            backgroundColor: selectedColor,
                        });
                    }
                }}
            />,
            { left: e.clientX, top: e.clientY },
            () => this.setState({ isContextMenuOpen: false }),
        );
        // indicate that context menu is open so we can add a CSS class to this element
        this.setState({ isContextMenuOpen: true });
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ priorities, users, board, colors }: IApplicationState) => ({
    createPriorityInput: priorities.createPriorityInput,
    createPriorityResult: priorities.createPriorityResult,
    updatePriorityInput: priorities.updatePriorityInput,
    updatePriorityResult: priorities.updatePriorityResult,
    userMap: users.userMap,
    getUsersLoading: users.loading,
    projectID: board.projectID,
    colorgroups: colors.colorgroups,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    createPrioritySetInput: (input: IPriorityCreateInput) =>
        dispatch(prioritiesActions.createPrioritySetInput(input)),
    updatePrioritySetInput: (input: IPriorityUpdateInput) =>
        dispatch(prioritiesActions.updatePrioritySetInput(input)),
    getUsers: () =>
        dispatch(usersActions.getUsers()),
    updatePriorityTitleRequest: (input: IPriorityUpdateTitleInput) =>
        dispatch(prioritiesActions.updatePriorityTitleRequest(input)),
    updatePriorityColorRequest: (input: IPriorityUpdateColorInput) =>
        dispatch(prioritiesActions.updatePriorityColorRequest(input)),
    insertOrUpdatePriorityBoard: (priority: IPriority) =>
        dispatch(boardActions.insertOrUpdatePriorityBoard(priority)),
    addOrRemovePriorityManagerRequest: (input: IAddOrRemovePriorityManagerInput) =>
        dispatch(prioritiesActions.addOrRemovePriorityManagerRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PriorityDetailPanel);

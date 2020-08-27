/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import {
    Button,
    Callout,
    ContextMenu,
    EditableText,
    FormGroup,
    H1,
    Icon,
    InputGroup,
    Intent,
    Menu,
    MenuItem,
    NumericInput,
    Popover,
    Position,
    Slider,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import { IStandardColor, IStandardColorGroup } from "../../store/colors/types";
import * as projectsActions from "../../store/projects/actions";
import { ICreateProjectInput, ICreateProjectResult } from "../../store/projects/types";
import * as usersActions from "../../store/users/actions";
import { IUser } from "../../store/users/types";
import { CONST_MAXIMUM_UNIT_POINTS_POSSIBLE } from "../../utils/constants";
import { IStringTMap } from "../../utils/types";
import UnitItemPointsField from "../board/unit-item-points-field";
import ColorsContextMenu from "../colors/colors-context-menu";
import UserAddButton from "../useraddbutton";
import UserImage from "../userimage";

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

const UserSelect = Select.ofType<IUser>();

interface IPriorityDetailState {

}

interface IPropsFromState {
    createProjectInput: ICreateProjectInput;
    createProjectResult: ICreateProjectResult;
    usersLoading: boolean;
    usersLoaded: boolean;
    users: IUser[];
    userMap: IStringTMap<IUser>;
    colorgroups: IStandardColorGroup[];
}

interface IPropsFromDispatch {
    createProjectSetInput: typeof projectsActions.createProjectSetInput;
    createProjectSetResult: typeof projectsActions.createProjectSetResult;
    getUsers: typeof usersActions.getUsers;
}

interface IOwnProps {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class ProjectDetailPanel extends React.PureComponent<AllProps, IPriorityDetailState> {
    public state: IPriorityDetailState = {

    };

    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // To do
    }

    public render() {
        return (
            <Container>
                {this.props.createProjectResult.errors === undefined ?
                    (<div />) :
                    (<Callout
                        intent={Intent.DANGER}
                        style={{ marginBottom: "20px" }}
                    >
                        Can not create your project. Error: {this.props.createProjectResult.errors}
                    </Callout>
                    )
                }
                {this.props.createProjectResult.id === undefined ?
                    (
                        <div>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Name"
                                labelFor="text-input"
                                labelInfo="(required)"
                            >
                                <InputGroup
                                    placeholder="Project name..."
                                    value={this.props.createProjectInput.name}
                                    onChange={this.handleNameChange}
                                />
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
                                            color={
                                                `rgba(
                                                    ${this.props.createProjectInput.color.red},
                                                    ${this.props.createProjectInput.color.green},
                                                    ${this.props.createProjectInput.color.blue},
                                                    ${this.props.createProjectInput.color.alpha})`
                                            }
                                        />
                                    }
                                    text="Color"
                                    onClick={(e) => this.showContextMenu(e)}
                                />
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Members"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                {this.props.createProjectInput.members.map((memberID: string, index: number) => {
                                    const eachUser: IUser | undefined = this.props.userMap[memberID];
                                    if (eachUser !== undefined) {
                                        return (
                                            <UserImage
                                                key={memberID}
                                                name={eachUser.nickname}
                                                imgSource={eachUser.avatarBase64}
                                                userID={memberID}
                                                onRemoveUser={this.onRemoveMember}
                                            />
                                        );
                                    } else {
                                        return (
                                            <UserImage
                                                key={memberID}
                                                name={"???"}
                                            />
                                        );
                                    }
                                })}
                                <UserAddButton
                                    onSelectUser={this.onAddMember}
                                    excludeMembers={this.props.createProjectInput.members}
                                    usePortal={false}
                                />
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Minimum unit points"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                <UnitItemPointsField
                                    initialPoints={this.props.createProjectInput.minUnitPoints}
                                    minUnitPoints={0}
                                    maxUnitPoints={this.props.createProjectInput.maxUnitPoints}
                                    onChange={((newPoints: number) => {
                                        if (this.onMinUnitPointsChange !== undefined) {
                                            this.onMinUnitPointsChange(newPoints);
                                        }
                                    })}
                                />
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="Maximum unit points"
                                labelFor="text-input"
                            // labelInfo="(required)"
                            >
                                <UnitItemPointsField
                                    initialPoints={this.props.createProjectInput.maxUnitPoints}
                                    minUnitPoints={this.props.createProjectInput.minUnitPoints}
                                    maxUnitPoints={CONST_MAXIMUM_UNIT_POINTS_POSSIBLE}
                                    onChange={((newPoints: number) => {
                                        if (this.onMaxUnitPointsChange !== undefined) {
                                            this.onMaxUnitPointsChange(newPoints);
                                        }
                                    })}
                                />
                            </FormGroup>
                            {/* <FormGroup
                                // helperText="Helper text with details..."
                                label="Errors"
                                labelFor="text-input"
                                // labelInfo="(required)"
                            >
                                <InputGroup
                                    placeholder="..."
                                    readOnly={true}
                                    value={this.props.createProjectResult.errors}
                                    onChange={this.handleNameChange}
                                />
                            </FormGroup>
                            <FormGroup
                                // helperText="Helper text with details..."
                                label="ID"
                                labelFor="text-input"
                                // labelInfo="(required)"
                            >
                                <InputGroup
                                    placeholder="..."
                                    readOnly={true}
                                    value={this.props.createProjectResult.id}
                                    onChange={this.handleNameChange}
                                />
                            </FormGroup> */}
                        </div>
                    ) :
                    (<Callout
                        intent={Intent.SUCCESS}
                    >
                        Project is created successfully
                    </Callout>
                    )
                }
            </Container>
        );
    }

    private handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.createProjectSetInput({
            ...this.props.createProjectInput,
            name: e.target.value,
        });
    }

    private onAddMember = (selectedUser: IUser) => {
        // To do
        this.props.createProjectSetInput({
            ...this.props.createProjectInput,
            members: [...this.props.createProjectInput.members, selectedUser.id],
        });
    }

    private onRemoveMember = (userID: string) => {
        this.props.createProjectSetInput({
            ...this.props.createProjectInput,
            members: _.remove(this.props.createProjectInput.members, (eachUserID: string) => {
                return eachUserID !== userID;
            }),
        });
    }

    private onMinUnitPointsChange = (newPoints: number) => {
        this.props.createProjectSetInput({
            ...this.props.createProjectInput,
            minUnitPoints: newPoints,
        });
    }

    private onMaxUnitPointsChange = (newPoints: number) => {
        this.props.createProjectSetInput({
            ...this.props.createProjectInput,
            maxUnitPoints: newPoints,
        });
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
                    this.props.createProjectSetInput({
                        ...this.props.createProjectInput,
                        color: selectedColor,
                    });
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
const mapStateToProps = ({ projects, users, colors }: IApplicationState) => ({
    createProjectInput: projects.createProjectInput,
    createProjectResult: projects.createProjectResult,
    usersLoading: users.loading,
    usersLoaded: users.loaded,
    users: users.result.users,
    userMap: users.userMap,
    colorgroups: colors.colorgroups,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    createProjectSetInput: (input: ICreateProjectInput) =>
        dispatch(projectsActions.createProjectSetInput(input)),
    createProjectSetResult: (result: ICreateProjectResult) =>
        dispatch(projectsActions.createProjectSetResult(result)),
    getUsers: () =>
        dispatch(usersActions.getUsers()),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProjectDetailPanel);

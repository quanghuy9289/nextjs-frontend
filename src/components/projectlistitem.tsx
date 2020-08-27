/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Alignment,
    Button,
    Card,
    Classes,
    EditableText,
    Elevation,
    Icon,
    Intent,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Popover,
    Position,
    Spinner,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import _ from "lodash";
import React from "react";
import { Draggable, DraggableProvidedDragHandleProps, DraggableStateSnapshot } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../store";
import * as loginsActions from "../store/logins/actions";
import { IEmailNotificationInput } from "../store/logins/types";
import * as projectsActions from "../store/projects/actions";
import { IAddOrRemoveProjectMemberInput, IProject, IUpdateProjectNameInput } from "../store/projects/types";
import * as usersActions from "../store/users/actions";
import { IUser } from "../store/users/types";
import { getHostAndProtocol } from "../utils/strings";
import { IStringTMap } from "../utils/types";
import ProjectItemContextMenu from "./projects/project-item-context-menu";
import UserAddButton from "./useraddbutton";
import UserImage from "./userimage";

const Container = styled.div<DraggableStateSnapshot>`
    margin-bottom: 8px;
    flex-grow: 1;
    ${"" /* height: 200px; */}
`;

const DragHandleContainer = styled.div`
    padding-left:20px;
`;

interface IProjectListItemState {

}

interface IProjectListTabPanelState {
    selectedTabId: string | number;
}

interface IPropsFromState {
    getProjectsLoading: boolean;
    getUsersLoading: boolean;
    userMap: IStringTMap<IUser>;
}

interface IPropsFromDispatch {
    getUsers: typeof usersActions.getUsers;
    updateProjectNameRequest: typeof projectsActions.updateProjectNameRequest;
    addOrRemoveProjectMemberRequest: typeof projectsActions.addOrRemoveProjectMemberRequest;
    sendEmailNotificationRequest: typeof loginsActions.sendEmailNotificationRequest;
}

interface IOwnProps {
    project: IProject;
    // projectMap: IStringTMap<IProject>;
    index: number;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class ProjectListItem extends React.PureComponent<AllProps, IProjectListItemState> {
    // public state: IProjectListItemState = {
    //     title: this.props.project.title,
    // };

    public componentDidMount() {
        _.map(this.props.project.memberUserIDs, (eachUserID: string) => {
            const eachUser = this.props.userMap[eachUserID];
            if (eachUser === undefined) {
                if (!this.props.getUsersLoading) {
                    this.props.getUsers();
                }
            }
        });
    }

    public render() {
        const contextMenu = (
            <ProjectItemContextMenu
                project={this.props.project}
            />
        );
        return (
            <Draggable
                draggableId={this.props.project.id}
                index={this.props.index}
                // isDragDisabled = {true}
            >
                {(provided, snapshot) => (
                    // provided Draggable component require its
                    // children to be a function, the parameter is a provided object
                    // snapshot the component during Drag
                    <Container
                        // draggableProps these props need to be applied
                        // to the component that we want to move around in response to user input
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        isDragging={snapshot.isDragging}
                        isDropAnimating={true}
                        // isDragDisabled = {isDragDisabled}
                    >
                        {/* <Card interactive={false} elevation={Elevation.ONE}> */}
                            {/* <p className=".bp3-ui-text">
                                {this.props.project.title}
                            </p> */}
                            <Navbar
                                style={{
                                    borderLeftStyle: "solid",
                                    borderLeftWidth: "10px",
                                    borderLeftColor:
                                        `rgba(
                                            ${this.props.project.color.red},
                                            ${this.props.project.color.green},
                                            ${this.props.project.color.blue},
                                            ${this.props.project.color.alpha})`,
                                }}
                            >
                                <NavbarGroup align={Alignment.LEFT}>
                                    <Route
                                        render={({history}) => (
                                            <Button
                                                className={Classes.MINIMAL}
                                                icon={IconNames.CIRCLE_ARROW_RIGHT}
                                                disabled={this.props.project.name.length === 0}
                                                onClick={() => {
                                                    history.push(`/projects/${this.props.project.shortcode}`);
                                                }}
                                            />)}
                                    />
                                    {/* <Link to={`/projects/${this.props.project.id}`}>Go</Link> */}
                                    <NavbarDivider />
                                    <NavbarHeading onClick={this.stopPropagation}>
                                        <EditableText
                                            maxLength={255}
                                            multiline={false}
                                            minLines={1}
                                            maxLines={1}
                                            value={this.props.project.name}
                                            confirmOnEnterKey={true}
                                            selectAllOnFocus={true}
                                            onChange={this.handleTitleChange}
                                            placeholder={"Enter project title..."}
                                        />
                                    </NavbarHeading>
                                    {/* <NavbarDivider /> */}
                                    {/* <Button className={Classes.MINIMAL} icon="home" text="Home" />
                                    <Button className={Classes.MINIMAL} icon="list" text="Projects" /> */}
                                </NavbarGroup>
                                <NavbarGroup align={Alignment.RIGHT}>
                                    {/* <NavbarDivider /> */}
                                    {/* <Button className={Classes.MINIMAL} icon="arrow-right"/> */}
                                    {/* <Button
                                        className={Classes.MINIMAL}
                                        icon={IconNames.DELETE}
                                        onClick={this.stopPropagation}
                                    /> */}
                                    {/* <div onClick={(e) => e.stopPropagation()}>
                                        <Popover
                                            captureDismiss={true}
                                            content={settingsMenu}
                                            position={Position.RIGHT_BOTTOM}
                                        >
                                            <Button icon={IconNames.COG}/>
                                        </Popover>
                                    </div> */}
                                    <DragHandleContainer
                                        // dragHandleProps Need to apply to the path of the
                                        // component that we want to use to be able to control
                                        // the entire component, and you can use this to drag
                                        // a large item by just a small part of it, for this
                                        // application we want the whole projectListItem to be
                                        // draggble so we are going to apply these props to the same element
                                        {...provided.dragHandleProps}
                                    >
                                        <Icon
                                            icon={IconNames.DRAG_HANDLE_VERTICAL}
                                            iconSize={Icon.SIZE_LARGE}
                                            intent={Intent.PRIMARY}
                                        />
                                    </DragHandleContainer>
                                </NavbarGroup>
                            </Navbar>
                            <Navbar
                                style={{
                                    borderLeftStyle: "solid",
                                    borderLeftWidth: "10px",
                                    borderLeftColor:
                                        `rgba(
                                            ${this.props.project.color.red},
                                            ${this.props.project.color.green},
                                            ${this.props.project.color.blue},
                                            ${this.props.project.color.alpha})`,
                                }}
                            >
                                <NavbarGroup
                                    align={Alignment.LEFT}
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        width: "90%",
                                    }}
                                >
                                    <Route
                                        render={({history}) => (
                                            <Button
                                                icon={IconNames.PEOPLE}
                                                minimal={true}
                                                disabled={true}
                                            />)}
                                    />
                                    {/* <Link to={`/projects/${this.props.project.id}`}>Go</Link> */}
                                    <NavbarDivider />
                                    <NavbarHeading onClick={this.stopPropagation}>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                            }}
                                        >
                                            {
                                                _.map(this.props.project.memberUserIDs, (eachUserID: string) => {
                                                    const eachUser = this.props.userMap[eachUserID];
                                                    return (
                                                        <UserImage
                                                            key={eachUserID}
                                                            sizeInPx={30}
                                                            name={_.isUndefined(eachUser) ? "..." : eachUser.nickname}
                                                            imgSource={
                                                                _.isUndefined(eachUser) ?
                                                                undefined : eachUser.avatarBase64
                                                            }
                                                            doesDisplayName={false}
                                                            allowContextMenu={true}
                                                            displayTooltip={true}
                                                            userID={eachUserID}
                                                            onRemoveUser={this.onRemoveMember}
                                                        />
                                                    );
                                                })
                                            }
                                            <UserAddButton
                                                onSelectUser={this.onAddMember}
                                                excludeMembers={this.props.project.memberUserIDs}
                                                sizeInPx={30}
                                                doesDisplayName={false}
                                                usePortal={true}
                                            />
                                        </div>
                                    </NavbarHeading>
                                </NavbarGroup>
                                <NavbarGroup align={Alignment.RIGHT}>
                                    <div
                                        style={{
                                            marginRight: "-5px",
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Popover
                                            captureDismiss={true}
                                            content={contextMenu}
                                            position={Position.LEFT_TOP}
                                            // usePortal={true}
                                        >
                                            <Button
                                                minimal={true}
                                                icon={
                                                    <Icon
                                                        icon={IconNames.MORE}
                                                        style={{
                                                            transform: "rotate(90deg)",
                                                            verticalAlign: "top",
                                                        }}
                                                    />
                                                }
                                            />
                                        </Popover>
                                    </div>
                                </NavbarGroup>
                            </Navbar>
                        {/* </Card> */}
                    </Container>
                )}
            </Draggable>
        );
    }

    public stopPropagation = (e: any) => {
        e.stopPropagation();
    }

    private handleTitleChange = (title: string) => {
        this.props.updateProjectNameRequest({
            id: this.props.project.id,
            name: title,
        });
    }

    private onAddMember = (selectedUser: IUser) => {
        this.props.addOrRemoveProjectMemberRequest({
            id: this.props.project.id,
            memberUserID: selectedUser.id,
            isAdd: true,
        });

        this.props.sendEmailNotificationRequest({
            subject: `[Project assignment] You are assigned to the project ${this.props.project.name} (Task Ripple)`,
            content: `You have been assigned to a project ${this.props.project.name}` +
            `<br/><a href="${getHostAndProtocol()}/projects/` +
            `${this.props.project.shortcode}">` +
            `Click to access the project</a>` +
            ``,
            userID: selectedUser.id,
            // columnID: this.props.project.columnID,
        });
    }

    private onRemoveMember = (userID: string) => {
        this.props.addOrRemoveProjectMemberRequest({
            id: this.props.project.id,
            memberUserID: userID,
            isAdd: false,
        });
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar, projects, users }: IApplicationState) => ({
    boardTitle: navbar.boardTitle,
    getProjectsLoading: projects.getProjectsLoading,
    getUsersLoading: users.loading,
    userMap: users.userMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    getUsers: () =>
        dispatch(usersActions.getUsers()),
    updateProjectNameRequest: (input: IUpdateProjectNameInput) =>
        dispatch(projectsActions.updateProjectNameRequest(input)),
    addOrRemoveProjectMemberRequest: (input: IAddOrRemoveProjectMemberInput) =>
        dispatch(projectsActions.addOrRemoveProjectMemberRequest(input)),
    sendEmailNotificationRequest: (input: IEmailNotificationInput) =>
        dispatch(loginsActions.sendEmailNotificationRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProjectListItem);

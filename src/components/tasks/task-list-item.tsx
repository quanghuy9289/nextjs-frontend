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
import { IApplicationState } from "../../store";
import { IStandardColor } from "../../store/colors/types";
import * as loginsActions from "../../store/logins/actions";
import { IEmailNotificationInput } from "../../store/logins/types";
import * as projectsActions from "../../store/projects/actions";
import { IAddOrRemoveProjectMemberInput, IProject, IUpdateProjectNameInput } from "../../store/projects/types";
import { ITask } from "../../store/tasks/types";
import * as usersActions from "../../store/users/actions";
import { IUser } from "../../store/users/types";
import { getEpochSecondsOfDate } from "../../utils/dates";
import { generateUUID, getHostAndProtocol } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import Task from "../board/task";
import ProjectItemContextMenu from "../projects/project-item-context-menu";

const Container = styled.div`
    margin-bottom: 8px;
    min-height: 130px;
    max-height: 130px;
`;

interface ITaskListItemState {

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
    task: ITask;
    project: IProject;
    // projectMap: IStringTMap<IProject>;
    // priorityBackgroundColor: IStandardColor;
    index: number;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class TaskListItem extends React.PureComponent<AllProps, ITaskListItemState> {
    // public state: ITaskListItemState = {
    //     title: this.props.project.title,
    // };

    public componentDidMount() {
        _.map(this.props.task.appointees, (eachUserID: string) => {
            const eachUser = this.props.userMap[eachUserID];
            if (eachUser === undefined) {
                if (!this.props.getUsersLoading) {
                    this.props.getUsers();
                }
            }
        });

        _.map(this.props.task.managers, (eachUserID: string) => {
            const eachUser = this.props.userMap[eachUserID];
            if (eachUser === undefined) {
                if (!this.props.getUsersLoading) {
                    this.props.getUsers();
                }
            }
        });
    }

    public render() {
        // const taskDemo: ITask = {
        //     appointees: [],
        //     columnID: generateUUID(),
        //     createdByUserID: generateUUID(),
        //     createdOn: getEpochSecondsOfDate(new Date()),
        //     doesHaveZeroUnit: false,
        //     id: generateUUID(),
        //     incrementcode: 1,
        //     managers: [],
        //     priorityID: generateUUID(),
        //     sprintID: generateUUID(),
        //     title: "This is a title " + generateUUID(),
        //     totalUnitPoints: 0,
        //     totalUnitPointsCompleted: 0,
        //     units: [],
        // };
        // const projectDemo: IProject = {
        //      color: {alpha: 1, blue: 127, red: 127, green: 127},
        //      currentSprint: {
        //          beginOn: getEpochSecondsOfDate(new Date()),
        //          endOn: getEpochSecondsOfDate(new Date()),
        //          id: generateUUID(),
        //          name: "W1 April 2019",
        //          projectID: generateUUID(),
        //      },
        //      id: generateUUID(),
        //      maxUnitPoints: 100,
        //      memberUserIDs: [],
        //      minUnitPoints: 0,

        // }
        return (
            <Task
                index={0}
                columnID={this.props.task.columnID}
                key={generateUUID()}
                priorityBackgroundColor={{alpha: 1, blue: 127, red: 127, green: 127}}
                priorityID={this.props.task.columnID}
                task={this.props.task}
                isDragDisabled={true}
                isClickable={false}
                allowContextMenu={true}
                project={this.props.project}
            />
        );
    }

    public stopPropagation = (e: any) => {
        e.stopPropagation();
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
)(TaskListItem);

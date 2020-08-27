/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Alignment,
    Boundary,
    Breadcrumbs,
    Button,
    Classes,
    EditableText,
    IBreadcrumbProps,
    Icon,
    Intent,
    IPanelProps,
    MenuItem,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Popover,
    Position,
    Tag,
    Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import dateFormat from "dateformat";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Dispatch } from "redux";
import { IApplicationState } from "../store";
import * as boardActions from "../store/board/actions";
import * as dialogsActions from "../store/dialogs/actions";
import { IActiveUserProfile } from "../store/logins/types";
import * as navbarActions from "../store/navbar/actions";
import { IProject } from "../store/projects/types";
import * as rolesActions from "../store/roles/actions";
import { IRole } from "../store/roles/types";
import * as sprintrequirementsActions from "../store/sprintrequirements/actions";
import { ISprintRequirement } from "../store/sprintrequirements/types";
import * as sprintsActions from "../store/sprints/actions";
import { ISprint, ISprintCreateInput, ISprintUpdateInput } from "../store/sprints/types";
import * as tasksActions from "../store/tasks/actions";
import { ITask, ITaskUpdateInput, ITaskWithUserInfo } from "../store/tasks/types";
import { IUser } from "../store/users/types";
import {
    CONST_CREATE_NEW_SPRINT_ITEM,
    CONST_PAGE_PROJECTS,
    CONST_PAGE_TASKS,
    CONST_ROUNDING_STANDARD_PRECISION,
} from "../utils/constants";
import { getDateFromUTCEpoch, getEpochSecondsOfDate } from "../utils/dates";
import { combineIDs } from "../utils/strings";
import { IStringTMap } from "../utils/types";
import GESettingMenu from "./gesettingmenu";
import { roleSelectProps } from "./roles/role-select-item";
import { taskSelectProps } from "./tasks/task-select-item";
import { userSelectProps } from "./users/user-select-item";

// const ITEMS: IBreadcrumbProps[] = [
//     { icon: "folder-close", text: "All files" },
//     { icon: "folder-close", text: "Users" },
//     { icon: "folder-close", text: "Janet" },
//     { href: "#", icon: "folder-close", text: "Photos" },
//     { href: "#", icon: "folder-close", text: "Wednesday" },
//     { icon: "document", text: "image.jpg" },
// ];

const SprintSelect = Select.ofType<ISprint>();
const UserSelect = Select.ofType<IUser>();
const TaskSelect = Select.ofType<ITaskWithUserInfo>();

// Props passed from mapStateToProps
interface IPropsFromState {
    isUsingDarkTheme: boolean;
    title?: string;
    boardTitle?: string;
    // rolesLoaded: boolean;
    // rolesLoading: boolean;
    getBoardLoading: boolean;
    getBoardLoaded: boolean;
    sprintsOrder: string[];
    loadedSprintID?: string;
    currentSprint: ISprint;
    currentProject: IProject;
    taskMap: IStringTMap<ITask>;
    sprintMap: IStringTMap<ISprint>;
    usersLoading: boolean;
    users: IUser[];
    userMap: IStringTMap<IUser>;
    filterByUserID?: string;
    boardScaleFactor?: number;
    activeUserProfile: IActiveUserProfile;
    sprintRequirementBySprintIDAndUserIDMap: IStringTMap<ISprintRequirement>;
}

// Props passed from mapDispatchToProps
interface IPropsFromDispatch {
    enableDarkTheme: typeof navbarActions.enableDarkTheme;
    changeTitle: typeof navbarActions.changeTitle;
    getRoles: typeof rolesActions.getRoles;
    openAddSprintDialog: typeof dialogsActions.openAddSprintDialog;
    openEditSprintDialog: typeof dialogsActions.openEditSprintDialog;
    createSprintSetInput: typeof sprintsActions.createSprintSetInput;
    updateSprintSetInput: typeof sprintsActions.updateSprintSetInput;
    getBoardRequest: typeof boardActions.getBoardRequest;
    setFilterByUserID: typeof boardActions.setFilterByUserID;
    setBoardScaleFactor: typeof boardActions.setBoardScaleFactor;
    getSprintRequirementRequestBySprintAndUser:
        typeof sprintrequirementsActions.getSprintRequirementRequestBySprintAndUser;
    openEditTaskDialog: typeof dialogsActions.openEditTaskDialog;
    updateTaskSetInput: typeof tasksActions.updateTaskSetInput;
}

interface IRouteParams {
    id: string;
}

// Component-specific props.
interface IOtherProps {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState &
    IPropsFromDispatch &
    RouteComponentProps<IRouteParams>;

// type GENavBarProps = {
//     enableDarkTheme: boolean,
//     breadcrumbs?: IBreadcrumbProps[]
// }

interface IGENavBarState {
    title?: string;
    sprint?: ISprint;
}

class GENavBar extends React.PureComponent<AllProps & IOtherProps, IGENavBarState> {
    public state: IGENavBarState = {
        title: "TASK RIPPLE",
        sprint: undefined,
    };

    public componentDidMount() {
        // To do
    }

    public componentDidUpdate() {
        const sprint: ISprint | undefined = this.props.loadedSprintID === undefined ?
            this.props.currentSprint :
            this.props.sprintMap[this.props.loadedSprintID];

        if (!_.isUndefined(sprint !== undefined) &&
            !_.isEmpty(sprint.id) &&
            !_.isEmpty(this.props.activeUserProfile.id)
        ) {
            // Try to load sprint requirement for the current user if needed
            const sprintRequirement: ISprintRequirement | undefined =
            this.props.sprintRequirementBySprintIDAndUserIDMap[
                combineIDs(sprint.id, this.props.activeUserProfile.id)
            ];

            if (_.isUndefined(sprintRequirement)) {
                // Perform loading sprint requirement
                this.props.getSprintRequirementRequestBySprintAndUser(sprint.id, this.props.activeUserProfile.id);
            }
        }
    }

    public render() {
        // const appState = store.getState();
        const settingsMenu = (
            <GESettingMenu />
        );

        const sprints: ISprint[] = [{
            id: "",
            name: CONST_CREATE_NEW_SPRINT_ITEM,
            beginOn: 0,
            endOn: 0,
            projectID: ""},
        ..._.map(this.props.sprintsOrder, (eachSprintID: string) => {
            return this.props.sprintMap[eachSprintID];
        })];

        // Generate breadcrumbs based on history
        const pathname = this.props.history.location.pathname;
        const pathComps = _.values(_.omitBy(pathname.split("/"), _.isEmpty));
        let masterCrumbPath = pathComps[0];
        let masterCrumbText = "";
        if (masterCrumbPath === "" || masterCrumbPath === undefined || masterCrumbPath === CONST_PAGE_PROJECTS) {
            masterCrumbText = "All projects";
            masterCrumbPath = CONST_PAGE_PROJECTS;
        } else if (masterCrumbPath === CONST_PAGE_TASKS) {
            masterCrumbText = "All tasks";
        }

        const breadcrumbs: IBreadcrumbProps[] = [
            { icon: "folder-close", text: masterCrumbText, onClick: () => {
                this.props.history.push(`/${masterCrumbPath}`);
            }},
        ];

        if (pathComps.length > 1) {
            _.forEach(pathComps, (eachPathComp, index: number) => {
                let title = eachPathComp;
                if (index > 0) {
                    if (index === 1) { // Project
                        const theProject = this.props.currentProject;
                        title = !_.isUndefined(theProject) && !_.isEmpty(theProject.name) ? theProject.name : "...";
                    } else if (index === 2) { // Task
                        const theTaskID = eachPathComp;
                        const theTask = this.props.taskMap[theTaskID];
                        title = !_.isUndefined(theTask) && !_.isEmpty(theTask.title) ?
                            (theTask.title.length > 30 ? theTask.title.substring(0, 30) + "..." : theTask.title) :
                            "...";
                    }
                    breadcrumbs.push({ icon: "folder-close", text: title, onClick: () => {
                        const pathCompsUntilHere = _.take(pathComps, index + 1);
                        const pathToPush = _.join(pathCompsUntilHere, "/");
                        this.props.history.push(`/${pathToPush}`);
                    }});
                }
            });
        }

        // Get sprint
        const sprint: ISprint | undefined = this.props.loadedSprintID === undefined ?
            this.props.currentSprint :
            this.props.sprintMap[this.props.loadedSprintID];

        // Get sprint requirement of the current active user
        const sprintRequirement: ISprintRequirement | undefined =
            this.props.sprintRequirementBySprintIDAndUserIDMap[
                combineIDs(sprint.id, this.props.activeUserProfile.id)
            ];

        const taskWithUserInfos: ITaskWithUserInfo[] =
        _.values(this.props.taskMap).filter((task: ITask) => {
            return task.projectID === this.props.currentProject.id;
        }).map((task: ITask) => {
            const taskWithUserInfo: ITaskWithUserInfo = {
                task,
                createdBy: this.props.userMap[task.createdByUserID],
            };
            return taskWithUserInfo;
        });

        return (
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>
                        <Icon
                            icon={IconNames.TINT}
                            iconSize={Icon.SIZE_LARGE}
                        />
                        {this.props.title}
                        {/* <EditableText
                            multiline={false}
                            minLines={1}
                            maxLines={1}
                            value={this.props.title}
                            confirmOnEnterKey={true}
                            selectAllOnFocus={true}
                            onChange={this.handleTitleChange}
                        /> */}
                    </NavbarHeading>
                    <NavbarDivider />
                    {/* <Button className={Classes.MINIMAL} icon="home" text="Home" />
                    <Button className={Classes.MINIMAL} icon="list" text="Projects" /> */}
                    <Breadcrumbs
                        collapseFrom={Boundary.START}
                        items={breadcrumbs}
                    />
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <NavbarDivider />
                    {pathComps.length === 2 ?
                    <SprintSelect
                        {...roleSelectProps}
                        items={sprints}
                        // {...flags}
                        filterable={true}
                        disabled={this.props.getBoardLoading}
                        // isItemDisabled={false}
                        // initialContent={undefined}
                        noResults={<MenuItem disabled={true} text="No results." />}
                        onItemSelect={this.onChangeProjectSprint}
                        popoverProps={{
                            minimal: true,
                            usePortal: true,
                            autoFocus: true,
                            enforceFocus: true,
                            position: "auto",
                            boundary: "viewport",
                        }}
                    >
                        <Button
                            // icon={IconNames.STAR}
                            loading={this.props.getBoardLoading}
                            rightIcon={IconNames.CARET_DOWN}
                            text={sprint === undefined ? "Unknown" : `${sprint.name}`}
                            disabled={false}
                            intent={Intent.NONE}
                        />
                    </SprintSelect> : null
                    }
                    {pathComps.length === 2 ?
                    <UserSelect
                        {...userSelectProps}
                        items={this.props.users}
                        // {...flags}
                        filterable={true}
                        disabled={this.props.usersLoading}
                        activeItem={null}
                        // isItemDisabled={false}
                        // initialContent={undefined}
                        noResults={<MenuItem disabled={true} text="No results." />}
                        onItemSelect={this.onSelectFilterByUser}
                        popoverProps={{
                            minimal: true,
                            usePortal: true,
                            autoFocus: true,
                            enforceFocus: true,
                            position: "auto",
                            boundary: "viewport",
                        }}
                    >
                        <Tooltip
                            position={Position.BOTTOM_RIGHT}
                            content="Filter the board"
                        >
                            <Button
                                icon={IconNames.FILTER}
                                loading={this.props.usersLoading || this.props.getBoardLoading}
                                intent={this.props.filterByUserID ? Intent.SUCCESS : Intent.NONE}
                                minimal={true}
                                onClick={this.handleClearFilter}
                            />
                        </Tooltip>
                    </UserSelect>
                    : null
                    }
                    {pathComps.length === 2 ?
                    <Tooltip
                        position={Position.BOTTOM_RIGHT}
                        content="Refresh the board"
                    >
                        <Button
                            icon={IconNames.REFRESH}
                            loading={this.props.getBoardLoading}
                            disabled={false}
                            intent={Intent.NONE}
                            onClick={this.handleRefreshBoard}
                            minimal={true}
                        />
                    </Tooltip>
                    : null
                    }
                    {pathComps.length === 2 ?
                    <Tooltip
                        position={Position.BOTTOM_RIGHT}
                        content="Toggle board scaling"
                    >
                        <Button
                            icon={IconNames.ZOOM_TO_FIT}
                            loading={this.props.getBoardLoading}
                            disabled={false}
                            intent={this.props.boardScaleFactor ? Intent.SUCCESS : Intent.NONE}
                            onClick={this.toggleBoardScaleFactor}
                            minimal={true}
                        />
                    </Tooltip>
                    : null
                    }
                    {/* {pathComps.length === 2 ?
                    <Button
                        icon={IconNames.SEARCH}
                        loading={this.props.getBoardLoading}
                        disabled={true}
                        intent={Intent.NONE}
                        // onClick={this.handleRefreshBoard}
                        minimal={true}
                    />
                    : null
                    } */}
                    {pathComps.length === 2 ?
                    <TaskSelect
                        {...taskSelectProps}
                        items={taskWithUserInfos}
                        // {...flags}
                        filterable={true}
                        disabled={this.props.usersLoading}
                        activeItem={null}
                        // isItemDisabled={false}
                        // initialContent={undefined}
                        noResults={<MenuItem disabled={true} text="No results." />}
                        onItemSelect={this.onSelectTask}
                        popoverProps={{
                            minimal: true,
                            usePortal: true,
                            autoFocus: true,
                            enforceFocus: true,
                            position: "auto",
                            boundary: "viewport",
                        }}
                    >
                        <Tooltip
                            position={Position.BOTTOM_RIGHT}
                            content="Search the task"
                        >
                            <Button
                                icon={IconNames.SEARCH}
                                loading={this.props.getBoardLoading}
                                // disabled={true}
                                intent={Intent.NONE}
                                // onClick={this.handleRefreshBoard}
                                minimal={true}
                            />
                        </Tooltip>
                    </TaskSelect>
                    : null
                    }
                    {/* <Button className={Classes.MINIMAL} icon="user"/> */}
                    <Button
                        minimal={true}
                        disabled={true}
                        icon={IconNames.NOTIFICATIONS}
                    />
                    {!_.isUndefined(sprintRequirement) && !_.isEmpty(sprintRequirement.id) ?
                    <Tooltip
                        position={Position.BOTTOM_RIGHT}
                        content={
                            `Your total completed points for the sprint: From ` +
                            `${dateFormat(getDateFromUTCEpoch(sprint.beginOn), "dddd, mmmm dS, yyyy")} ` +
                            `to ` +
                            `${dateFormat(getDateFromUTCEpoch(sprint.endOn), "dddd, mmmm dS, yyyy")}`
                        }
                    >
                        {/* <Tag
                            intent={
                                sprintRequirement.totalCompletedPoints >= sprintRequirement.minUnitPoints ?
                                Intent.SUCCESS :
                                Intent.WARNING
                            }
                            round={true}
                            large={true}
                            className="tag-score"
                            style={{
                                marginLeft: "5px",
                                marginRight: "10px",
                            }}
                        >
                            {
                                `${_.round(
                                sprintRequirement.totalCompletedPoints,
                                CONST_ROUNDING_STANDARD_PRECISION)
                                }/` +
                                `${sprintRequirement.minUnitPoints}`
                            }
                        </Tag> */}
                        <Tag
                            intent={
                                sprintRequirement.minUnitPoints > 0 ?
                                (sprintRequirement.totalCompletedPoints >= sprintRequirement.minUnitPoints ?
                                Intent.SUCCESS :
                                Intent.WARNING) :
                                Intent.NONE
                            }
                            round={true}
                            large={true}
                            className="tag-score"
                            style={{
                                marginLeft: "5px",
                                marginRight: "10px",
                            }}
                        >
                            {
                                sprintRequirement.minUnitPoints > 0 ?
                                `${_.round(
                                    sprintRequirement.totalCompletedPoints,
                                    CONST_ROUNDING_STANDARD_PRECISION)
                                    }/` +
                                    `${sprintRequirement.minUnitPoints}` :
                                `${_.round(
                                    sprintRequirement.totalCompletedPoints,
                                    CONST_ROUNDING_STANDARD_PRECISION)
                                    } points`
                            }
                        </Tag>
                    </Tooltip>
                    : null
                    }
                    <Popover content={settingsMenu} position={Position.RIGHT_BOTTOM}>
                        <Button icon="cog"/>
                    </Popover>
                </NavbarGroup>
            </Navbar>
        );
    }

    private handleRefreshBoard = () => {
        this.props.getBoardRequest(this.props.currentProject.shortcode, this.props.loadedSprintID);
    }

    private handleTitleChange = (title: string) => {
        // this.setState({title})
        this.props.changeTitle(title);
    }

    private onSelectFilterByUser = (selectedUser: IUser) => {
        this.props.setFilterByUserID(selectedUser.id);
    }

    private onSelectTask = (selectedTaskWithUserInfo: ITaskWithUserInfo) => {
        this.props.updateTaskSetInput({
            ...selectedTaskWithUserInfo.task,
            projectID: selectedTaskWithUserInfo.task.projectID,
            sprintID: selectedTaskWithUserInfo.task.sprintID,
            description: "", // To do
        });
        this.props.openEditTaskDialog(true);
    }

    private toggleBoardScaleFactor = () => {
        if (_.isUndefined(this.props.boardScaleFactor)) {
            this.props.setBoardScaleFactor(0.5);
        } else {
            this.props.setBoardScaleFactor(undefined);
        }
    }

    private handleClearFilter = () => {
        if (!_.isUndefined(this.props.filterByUserID)) {
            this.props.setFilterByUserID(undefined);
        }
    }

    private onChangeProjectSprint = (selectedSprint: ISprint) => {
        if (selectedSprint.name === CONST_CREATE_NEW_SPRINT_ITEM) {
            this.props.createSprintSetInput({
                beginOn: getEpochSecondsOfDate(new Date()),
                endOn: getEpochSecondsOfDate(new Date()),
                name: dateFormat(new Date(), "mmmm yyyy"),
                projectID: this.props.currentProject.id,
            });
            this.props.openAddSprintDialog(true);
        } else {
            // this.setState({
            //     sprint: selectedSprint,
            // });

            this.props.updateSprintSetInput({
                beginOn: selectedSprint.beginOn,
                endOn: selectedSprint.endOn,
                name: selectedSprint.name,
                id: selectedSprint.id,
                projectID: selectedSprint.projectID,
            });
            this.props.openEditSprintDialog(true);
        }
    }
}

// GENavBar.propTypes = {
//     enableDarkTheme: PropTypes.bool,
// };

// GENavBar.defaultProps = {
//     enableDarkTheme: true,
// };

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar, logins, board, users }: IApplicationState) => ({
    isUsingDarkTheme: navbar.isUsingDarkTheme,
    title: navbar.title,
    boardTitle: navbar.boardTitle,
    getBoardLoaded: board.getBoardLoaded,
    getBoardLoading: board.getBoardLoading,
    sprintsOrder: board.sprintsOrder,
    currentSprint: board.project.currentSprint,
    currentProject: board.project,
    taskMap: board.taskMap,
    sprintMap: board.sprintMap,
    loadedSprintID: board.loadedSprintID,
    usersLoading: users.loading,
    users: users.result.users,
    userMap: users.userMap,
    filterByUserID: board.filterByUserID,
    boardScaleFactor: board.boardScaleFactor,
    activeUserProfile: logins.activeUserProfile,
    sprintRequirementBySprintIDAndUserIDMap: board.sprintRequirementBySprintIDAndUserIDMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    enableDarkTheme: (enableDarkTheme: boolean) => dispatch(navbarActions.enableDarkTheme(enableDarkTheme)),
    changeTitle: (title: string) => dispatch(navbarActions.changeTitle(title)),
    getRoles: () =>
        dispatch(rolesActions.getRoles()),
    openAddSprintDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openAddSprintDialog(isOpen)),
    openEditSprintDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openEditSprintDialog(isOpen)),
    createSprintSetInput: (input: ISprintCreateInput) =>
        dispatch(sprintsActions.createSprintSetInput(input)),
    updateSprintSetInput: (input: ISprintUpdateInput) =>
        dispatch(sprintsActions.updateSprintSetInput(input)),
    getBoardRequest: (projectShortcode: string, sprintID?: string) =>
        dispatch(boardActions.getBoardRequest(projectShortcode, sprintID)),
    setFilterByUserID: (userID?: string) =>
        dispatch(boardActions.setFilterByUserID(userID)),
    setBoardScaleFactor: (boardScaleFactor?: number) =>
        dispatch(boardActions.setBoardScaleFactor(boardScaleFactor)),
    getSprintRequirementRequestBySprintAndUser: (sprintID: string, userID: string) =>
        dispatch(sprintrequirementsActions.getSprintRequirementRequestBySprintAndUser(sprintID, userID)),
    openEditTaskDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openEditTaskDialog(isOpen)),
    updateTaskSetInput: (input: ITaskUpdateInput) =>
        dispatch(tasksActions.updateTaskSetInput(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(GENavBar));

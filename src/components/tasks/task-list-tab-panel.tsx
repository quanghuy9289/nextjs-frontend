/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IBreadcrumbProps, InputGroup, Intent, Spinner, Tab, TabId, Tabs } from "@blueprintjs/core";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as navbarActions from "../../store/navbar/actions";
import * as tasksActions from "../../store/tasks/actions";
import TaskListPanel from "./task-list-panel";

const TabContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 15px;
`;

interface ITaskListTabPanelState {
    selectedTabId: string | number;
}

interface IPropsFromState {
    boardTitle?: string;
    breadcrumbs?: IBreadcrumbProps[];
    getTasksLoading: boolean;
    getTasksLoaded: boolean;
}

interface IPropsFromDispatch {
    changeBoardTitle: typeof navbarActions.changeBoardTitle;
    getTasksRequest: typeof tasksActions.getTasksRequest;
}

interface IOwnProps {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class TaskListTabPanel extends React.PureComponent<AllProps, ITaskListTabPanelState> {
    public state: ITaskListTabPanelState = {
        selectedTabId: "active-tasks",
    };

    public componentDidMount() {
        // Load projects
        if (!this.props.getTasksLoaded) {
            this.props.getTasksRequest();
        }
    }

    public render() {
        return (
            <TabContainer>
                {this.props.getTasksLoading ?
                (
                    <Spinner
                        intent={Intent.NONE}
                        size={50}
                    />
                ) :
                (
                    <Tabs
                        animate={true}
                        renderActiveTabPanelOnly={false}
                        onChange={this.handleTabChange}
                        selectedTabId={this.state.selectedTabId}
                    >
                        <Tab
                            id="active-tasks"
                            title="Active"
                            panel={
                                <TaskListPanel
                                    goToProjectBoard={this.goToProjectBoard}
                                    allowAddNewProject={true}
                                />
                            }
                        />
                        <Tab
                            id="completed-tasks"
                            title="Completed"
                            panel={
                                <TaskListPanel
                                    goToProjectBoard={this.goToProjectBoard}
                                    allowAddNewProject={false}
                                />
                            }
                        />
                        <Tab
                            id="archived-tasks"
                            title="Archived"
                            panel={
                                <TaskListPanel
                                    goToProjectBoard={this.goToProjectBoard}
                                    allowAddNewProject={false}
                                />
                            }
                        />
                        {/* <input className="bp3-input" type="text" placeholder="Search..." /> */}
                        <InputGroup placeholder="Search..." />
                        <Tabs.Expander />
                    </Tabs>
                )  }
            </TabContainer>
        );
    }

    public goToProjectBoard = (props: any) => {
        const {id, title} = props;
        this.props.changeBoardTitle(title);
        // this.props.openPanel({
        //     component: Board, // <- class or stateless function type
        //     // props: {
        //     //     title: title as string
        //     // }, // <- props without IPanelProps
        //     title,        // <- appears in header and back button
        // });
    }

    private handleTabChange = (selectedTabId: TabId) => {
        this.setState({
            selectedTabId,
        });
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar, tasks }: IApplicationState) => ({
    boardTitle: navbar.boardTitle,
    getTasksLoading: tasks.getTasksLoading,
    getTasksLoaded: tasks.getTasksLoaded,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    changeBoardTitle: (title: string) =>
        dispatch(navbarActions.changeBoardTitle(title)),
    getTasksRequest: () =>
        dispatch(tasksActions.getTasksRequest()),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TaskListTabPanel);

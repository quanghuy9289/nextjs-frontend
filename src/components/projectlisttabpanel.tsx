/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IBreadcrumbProps, InputGroup, Intent, IPanelProps, Spinner, Tab, TabId, Tabs } from "@blueprintjs/core";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import projectTestData from "../data/project-test-data";
import { IApplicationState } from "../store";
import * as navbarActions from "../store/navbar/actions";
import * as projectsActions from "../store/projects/actions";
import Board from "./board";
import ProjectListPanel from "./projectlistpanel";
import TaskDetailPanel from "./taskdetailpanel";

const TabContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 15px;
`;

interface IProjectListTabPanelState {
    selectedTabId: string | number;
}

interface IPropsFromState {
    boardTitle?: string;
    breadcrumbs?: IBreadcrumbProps[];
    projectsLoading: boolean;
}

interface IPropsFromDispatch {
    changeBoardTitle: typeof navbarActions.changeBoardTitle;
    setProjectsLoading: typeof projectsActions.setProjectsLoading;
    getProjectsRequest: typeof projectsActions.getProjectsRequest;
}

interface IOwnProps {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class ProjectListTabPanel extends React.PureComponent<AllProps & IPanelProps, IProjectListTabPanelState> {
    public state: IProjectListTabPanelState = {
        selectedTabId: "active-projects",
    };

    // componentDidUpdate() {
    //     if (this.props.breadcrumbs !== undefined) {
    //         if (this.props.breadcrumbs!.length == 3) {
    //             console.log("Task detail", "componentDidUpdate(Board)");
    //             this.props.changeBoardTitle("Task detail")
    //             this.props.openPanel({
    //                 component: TaskDetailPanel, // <- class or stateless function type
    //                 // props: {
    //                 //     title: title as string
    //                 // }, // <- props without IPanelProps
    //                 title: "Task detail",        // <- appears in header and back button
    //             });
    //         } else if (this.props.breadcrumbs!.length == 2) {
    //             console.log("Board", "componentDidUpdate(Board)");
    //         } else if (this.props.breadcrumbs!.length == 1) {
    //             console.log("All projects", "componentDidUpdate(Board)");
    //             this.props.closePanel();
    //         }
    //     }
    // }

    public componentDidMount() {
        // Load projects
        this.props.getProjectsRequest();
    }

    public render() {
        return (
            <TabContainer>
                {this.props.projectsLoading ?
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
                            id="active-projects"
                            title="Active"
                            panel={
                                <ProjectListPanel
                                    goToProjectBoard={this.goToProjectBoard}
                                    allowAddNewProject={true}
                                />
                            }
                        />
                        <Tab
                            id="archived-projects"
                            title="Archived"
                            panel={
                                <ProjectListPanel
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
const mapStateToProps = ({ navbar, projects }: IApplicationState) => ({
    boardTitle: navbar.boardTitle,
    projectsLoading: projects.projectsLoading,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    changeBoardTitle: (title: string) =>
        dispatch(navbarActions.changeBoardTitle(title)),
    setProjectsLoading: (isLoading: boolean) =>
        dispatch(projectsActions.setProjectsLoading(isLoading)),
    getProjectsRequest: () =>
        dispatch(projectsActions.getProjectsRequest()),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProjectListTabPanel);

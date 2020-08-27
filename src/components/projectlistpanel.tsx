/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Button, Classes, Spinner } from "@blueprintjs/core";
import _ from "lodash";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Route } from "react-router";
import { Dispatch } from "redux";
import styled from "styled-components";
import projectTestData from "../data/project-test-data";
import { IApplicationState } from "../store";
import * as dialogsActions from "../store/dialogs/actions";
import * as projectsActions from "../store/projects/actions";
import { IProject, IProjectUpdateSortOrderInput } from "../store/projects/types";
import { generateMidString } from "../utils/strings";
import { IStringTMap } from "../utils/types";
import Board from "./board";
import ProjectListItem from "./projectlistitem";

const ProjectList = styled.div`
    ${"" /* padding: 8px;*/}
    transition: background-color 0.2s ease;
    ${"" /* background-color: ${props => (props.isDraggingOver ? 'lightgrey' : 'inherit')}; */}
    ${"" /* min-height: 100px; */}
`;

const AddCardContainer = styled.div`
    ${"" /* padding: 8px;*/}
    margin-bottom: 8px;
    margin-top: 0px;
`;

interface IProjectListTabPanelState {
    selectedTabId: string | number;
}

interface IPropsFromState {
    getProjectsLoading: boolean;
    projectMap: IStringTMap<IProject>;
    projectsOrder: string[];
}

interface IPropsFromDispatch {
    openCreateProjectDialog: typeof dialogsActions.openCreateProjectDialog;
    updateProjectSortOrderRequest: typeof projectsActions.updateProjectSortOrderRequest;
    setProjectsOrder: typeof projectsActions.setProjectsOrder;
}

interface IOwnProps {
    goToProjectBoard: (props: any) => void;
    allowAddNewProject: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

interface IProjectListPanelState {
    projects: any[any];
    projectOrder: string[];
}

class ProjectListPanel extends React.PureComponent<AllProps, IProjectListPanelState> {
    public state: IProjectListPanelState = {
        projects: {
            "project-1": {id: "project-1", title: "Cooking the Books"},
            "project-2": {id: "project-2", title: "Drinking the Profit"},
            "project-3": {id: "project-3", title: "Keeping it cool"},
        },
        // Facilitate reordering of the projects
        projectOrder: ["project-1", "project-2", "project-3"],
    };

    public onDragStart = (result: any) => {
        // To do
    }

    public onDragUpdate = (update: any) => {
        // To do
    }

    public onDragEnd = (result: any) => {
        // document.body.style.color = 'inherit';
        // document.body.style.backgroundColor = 'inherit';
        const { destination, source, draggableId, type } = result;
        // Check if there is destination
        if (!destination) {
            return;
        }
        // Check if the location is the same
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === "project") {
            const newProjectsOrder = Array.from(this.props.projectsOrder);
            // Removing the old project id
            newProjectsOrder.splice(source.index, 1);
            // Add the new project id
            newProjectsOrder.splice(destination.index, 0, draggableId);

            // const newState = {
            //     ...this.state,
            //     projectOrder: newProjectsOrder,
            // };

            // this.setState(newState);
            const currentNewIndex: number = newProjectsOrder.indexOf(draggableId);
            const afterProjectID: string | undefined = newProjectsOrder[currentNewIndex - 1];
            const beforeProjectID: string | undefined = newProjectsOrder[currentNewIndex + 1];
            // let prevProjectLocation: string = "";
            // let nextProjectLocation: string = "";
            // if (!_.isUndefined(prevProjectID)) {
            //     const prevProject = this.props.projectMap[prevProjectID];
            //     if (!_.isUndefined(prevProject)) {
            //         prevProjectLocation = prevProject.location;
            //     }
            // }
            // if (!_.isUndefined(nextProjectID)) {
            //     const nextProject = this.props.projectMap[nextProjectID];
            //     if (!_.isUndefined(nextProject)) {
            //         nextProjectLocation = nextProject.location;
            //     }
            // }
            // const newLocation: string = generateMidString(prevProjectLocation, nextProjectLocation);
            // console.log("New location = ", newLocation,
            //     "prevProjectLocation = ", prevProjectLocation,
            //     "nextProjectLocation = ", nextProjectLocation);

            // Set new projects order
            this.props.setProjectsOrder(newProjectsOrder);
            // Request server to update as well
            this.props.updateProjectSortOrderRequest({
                id: draggableId,
                beforeProjectID,
                afterProjectID,
            });

            return;
        }
    }

    public render() {
        // return <Button onClick={this.openSettingsPanel} text="Settings" />
        return (
            <DragDropContext
                onDragStart={this.onDragStart}
                onDragUpdate={this.onDragUpdate}
                onDragEnd={this.onDragEnd}
            >
                <Droppable
                    droppableId="all-projects"
                    direction="vertical"
                    type="project"
                >
                    {(provided) => (
                        <ProjectList
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {/* {this.state.projectOrder.map((projectId, index) => {
                                const project = this.state.projects[projectId];
                                return (
                                    <ProjectListItem
                                        key={project.id}
                                        project={project}
                                        projectMap={this.state.projects}
                                        index={index}
                                    />
                                );
                            })} */}
                            {
                                _.map(this.props.projectsOrder, (projectID: string, index: number) => {
                                    const eachProject = this.props.projectMap[projectID];
                                    // const index = _.indexOf(_.keys(this.props.projectMap), projectID);
                                    return (
                                        <ProjectListItem
                                            key={eachProject.id}
                                            project={eachProject}
                                            // projectMap={this.props.projectMap}
                                            index={index}
                                        />
                                    );
                                })
                            }
                        </ProjectList>
                    )}
                </Droppable>
                {
                    this.props.allowAddNewProject ?
                    (
                        <AddCardContainer>
                            {this.props.getProjectsLoading ?
                                (
                                    <Spinner
                                        size={50}
                                    />
                                ) :
                                (
                                    <Route
                                        render={({history}) => (
                                            <Button
                                                onClick={this.handleAddNewProject}
                                                text="Add new project"
                                                icon="add"
                                                className={Classes.NAVBAR}
                                            />
                                        )}
                                    />
                                )
                            }
                        </AddCardContainer>
                    )
                    :
                    (
                        <div/>
                    )
                }
            </DragDropContext>
        );
    }

    private handleAddNewProject = () => {
        this.props.openCreateProjectDialog(true);
        // console.log("generateMidString aaaaa-bbbbb", generateMidString("aaaaa", "bbbbb"));
        // console.log("generateMidString aaaaa-aaaab", generateMidString("aaaaa", "aaaab"));
        // console.log("generateMidString aaaam-aaaan", generateMidString("aaaam", "aaaan"));
        // console.log("generateMidString aaaaa-aaaac", generateMidString("aaaaa", "aaaac"));
        // console.log("generateMidString aaaaa-aaaaa", generateMidString("aaaaa", "aaaaa"));
        // console.log("generateMidString -aaaaa", generateMidString("", "aaaaa"));
        // console.log("generateMidString aaaaa-", generateMidString("aaaaa", ""));
        // console.log("generateMidString -", generateMidString("", ""));
        // console.log("generateMidString -aaa", generateMidString("", "aaa"));
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar, projects }: IApplicationState) => ({
    boardTitle: navbar.boardTitle,
    getProjectsLoading: projects.getProjectsLoading,
    projectMap: projects.projectMap,
    projectsOrder: projects.projectsOrder,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    openCreateProjectDialog: (isOpen: boolean) =>
        dispatch(dialogsActions.openCreateProjectDialog(isOpen)),
    updateProjectSortOrderRequest: (input: IProjectUpdateSortOrderInput) =>
        dispatch(projectsActions.updateProjectSortOrderRequest(input)),
    setProjectsOrder: (projectsOrder: string[]) =>
        dispatch(projectsActions.setProjectsOrder(projectsOrder)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProjectListPanel);

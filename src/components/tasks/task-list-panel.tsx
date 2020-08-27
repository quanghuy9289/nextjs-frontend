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
import { IApplicationState } from "../../store";
import * as dialogsActions from "../../store/dialogs/actions";
import * as projectsActions from "../../store/projects/actions";
import { IProject } from "../../store/projects/types";
import { ITask, ITaskUpdateSortOrderInput } from "../../store/tasks/types";
import { getEpochSecondsOfDate } from "../../utils/dates";
import { generateUUID } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import TaskListItem from "./task-list-item";

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

interface ITaskListTabPanelState {
    selectedTabId: string | number;
}

interface IPropsFromState {
    getTasksLoading: boolean;
    projectMap: IStringTMap<IProject>;
    taskMap: IStringTMap<ITask>;
    tasksOrder: string[];
}

interface IPropsFromDispatch {

}

interface IOwnProps {
    goToProjectBoard: (props: any) => void;
    allowAddNewProject: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class TaskListPanel extends React.PureComponent<AllProps> {
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

        if (type === "task") {
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
                                    <TaskListItem
                                        key={project.id}
                                        project={project}
                                        taskMap={this.state.projects}
                                        index={index}
                                    />
                                );
                            })} */}
                            {
                                _.map(this.props.tasksOrder, (taskID: string, index: number) => {
                                    const eachTask: ITask = this.props.taskMap[taskID];
                                    const projectID = eachTask !== undefined ? eachTask.projectID : "";
                                    const eachProject = this.props.projectMap[projectID];
                                    if (eachTask !== undefined && eachProject !== undefined) {
                                        return (
                                            <TaskListItem
                                                key={eachTask.id}
                                                project={eachProject}
                                                task={eachTask}
                                                // taskMap={this.props.taskMap}
                                                index={index}
                                            />
                                        );
                                    } else {
                                        return null;
                                    }
                                })
                            }
                        </ProjectList>
                    )}
                </Droppable>
                {
                    this.props.allowAddNewProject ?
                    (
                        <AddCardContainer>
                            {this.props.getTasksLoading ?
                                (
                                    <Spinner
                                        size={50}
                                    />
                                ) :
                                (
                                    <Route
                                        render={({history}) => (
                                            <Button
                                                onClick={this.handleAddNewTask}
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

    private handleAddNewTask = () => {
        // this.props.openCreateProjectDialog(true);
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar, tasks, projects }: IApplicationState) => ({
    boardTitle: navbar.boardTitle,
    getTasksLoading: tasks.getTasksLoading,
    projectMap: projects.projectMap,
    taskMap: tasks.taskMap,
    tasksOrder: tasks.tasksOrder,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TaskListPanel);

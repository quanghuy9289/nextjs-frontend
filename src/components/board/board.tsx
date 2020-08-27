/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import { Spinner } from "@blueprintjs/core";
import _ from "lodash";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import ScrollBooster from "scrollbooster";
import styled from "styled-components";
import { IApplicationState } from "../../store";
import * as boardActions from "../../store/board/actions";
import * as columnsActions from "../../store/columns/actions";
import { IColumn, IColumnUpdateSortOrderInput } from "../../store/columns/types";
import * as commentsActions from "../../store/comments/actions";
import { ICommentCreateInput } from "../../store/comments/types";
import { IUserConfig } from "../../store/logins/types";
import { IPriority } from "../../store/priorities/types";
import { IProject } from "../../store/projects/types";
import * as tasksActions from "../../store/tasks/actions";
import { ITask, ITaskUpdateSortOrderInput } from "../../store/tasks/types";
import { CONST_CSS_CLS_DRAG_SCROLL_HANDLE } from "../../utils/constants";
import { getDraftJSEditorJSONStringFromText } from "../../utils/strings";
import { IStringTMap } from "../../utils/types";
import Column from "./column";
import ColumnAddButton from "./column-add-button";

const Container = styled.div`
    display: inline-flex;
`;

// const ScrollViewport = styled.div`
//     overflow: auto;
// `;

// interface InnerListColumnType {
//     tasks: any[any];
//     columnIds: string[];
//     columnOrder: string[];
//     columns: any[any];
// }

interface InnerListState {
    columnMap: IStringTMap<IColumn>;
    columnsOrder: string[];
    taskMap: IStringTMap<ITask>;
    priorityMap: IStringTMap<IPriority>;
    prioritiesOrder: string[];
    projectID: string;
    project: IProject;
    shouldShowStickyHeader: boolean;
    userConfig?: IUserConfig;
}

class InnerList extends React.PureComponent<InnerListState> {
    // PureComponent do the shouldComponentUpdate automatically
    public render() {
        return this.props.columnsOrder.map((columnID: string, index: number) => {
            const column = this.props.columnMap[columnID];

            const tasks = column.taskIDs.map((eachTaskID: string) => {
                return this.props.taskMap[eachTaskID];
            });

            const columnTaskIDsMap: string[][] = [];
            _.values(this.props.columnMap).map((eachColumn: IColumn) => {
                columnTaskIDsMap.push(eachColumn.taskIDs);
            });

            const collapsed: boolean | undefined =
                this.props.userConfig !== undefined &&
                    this.props.userConfig.collapsedColumns !== undefined ?
                    this.props.userConfig.collapsedColumns[column.id] :
                    undefined;

            return (
                <Column
                    key={column.id}
                    column={column}
                    index={index}
                    priorityMap={this.props.priorityMap}
                    prioritiesOrder={this.props.prioritiesOrder}
                    projectID={this.props.projectID}
                    project={this.props.project}
                    tasks={tasks}
                    columnTaskIDsMap={columnTaskIDsMap}
                    shouldShowStickyHeader={this.props.shouldShowStickyHeader}
                    collapsed={collapsed}
                />
            );
        });
    }
}

interface IBoardState {
    shouldShowStickyHeader: boolean;
}

interface IPropsFromState {
    prioritiesOrder: string[];
    priorityMap: IStringTMap<IPriority>;
    columnsOrder: string[];
    columnMap: IStringTMap<IColumn>;
    taskMap: IStringTMap<ITask>;
    getBoardLoaded: boolean;
    getBoardLoading: boolean;
    projectID: string;
    project: IProject;
    boardScaleFactor?: number;
    enableDragToScroll: boolean;
    userConfig?: IUserConfig;
}

interface IPropsFromDispatch {
    updateColumnSortOrderRequest: typeof columnsActions.updateColumnSortOrderRequest;
    setColumnsOrder: typeof boardActions.setColumnsOrder;
    insertOrUpdateColumnBoard: typeof boardActions.insertOrUpdateColumnBoard;
    insertOrUpdatePriorityBoard: typeof boardActions.insertOrUpdatePriorityBoard;
    updateTaskSortOrderRequest: typeof tasksActions.updateTaskSortOrderRequest;
    insertOrUpdateTaskBoard: typeof boardActions.insertOrUpdateTaskBoard;
    createCommentRequest: typeof commentsActions.createCommentRequest;
}

interface IOwnProps {
    projectShortcode: string;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class Board extends React.PureComponent<AllProps, IBoardState> {
    public state: IBoardState = {
        shouldShowStickyHeader: false,
    };
    private refScrollViewport: any;
    private refScrollContent: any;
    private scrollBooster?: ScrollBooster;
    public componentWillMount = () => {
        // To do
    }

    public componentDidMount() {
        // if (!_.isEmpty(this.props.projectShortcode)) {
        //     if (!this.props.getBoardLoaded) {
        //         this.props.getBoardRequest(this.props.projectShortcode);
        //     }
        // }
        this.scrollBooster = new ScrollBooster({
            viewport: this.refScrollViewport, // required
            content: this.refScrollContent,
            bounce: false,
            textSelection: false,
            emulateScroll: true,
            // mode: "x", // scroll only in horizontal dimension
            onUpdate: (data) => {
                // your scroll logic goes here
                // this.refScrollContent.style.transform = `translate(
                //     ${-data.position.x}px,
                //     ${-data.position.y}px
                // )`;
                if (this.refScrollViewport !== null) {
                    this.refScrollViewport.scrollLeft = data.position.x;
                    this.refScrollViewport.scrollTop = data.position.y;
                    if (data.position.y >= 100 && !this.state.shouldShowStickyHeader) {
                        this.setState({
                            shouldShowStickyHeader: true,
                        });
                    } else if (data.position.y < 100 && this.state.shouldShowStickyHeader) {
                        this.setState({
                            shouldShowStickyHeader: false,
                        });
                    }
                }
            },
            shouldScroll: (data, event) => {
                if (this.props.enableDragToScroll &&
                    event.target.classList.contains(CONST_CSS_CLS_DRAG_SCROLL_HANDLE)
                ) {
                    return true;
                } else {
                    return false;
                }
            },
        });
        // sb.updateMetrics();
        // sb.setPosition({
        //     x: 100,
        //     y: 100,
        // });
    }

    public componentWillUnmount() {
        if (this.scrollBooster !== undefined) {
            this.scrollBooster.destroy();
        }
    }

    public onDragStart = (result: any) => {
        // document.body.style.color = 'orange';
        // document.body.style.transition = 'background-color 0.2s ease';
    }

    public onDragUpdate = (update: any) => {
        // const { destination } = update;
        // const opacity = destination
        // ? destination.index / Object.keys(this.state.tasks).length
        // : 0;

        // document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
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

        if (type === "column") {
            const newColumnsOrder = Array.from(this.props.columnsOrder);
            // Removing the old column id
            newColumnsOrder.splice(source.index, 1);
            // Add the new column id
            newColumnsOrder.splice(destination.index, 0, draggableId);

            const newStateWithColumn = {
                ...this.state,
                columnOrder: newColumnsOrder,
            };

            // <To do>
            // this.setState(newStateWithColumn);
            // </To do>
            // Set new column order
            const currentNewIndex: number = newColumnsOrder.indexOf(draggableId);
            const afterColumnID: string | undefined = newColumnsOrder[currentNewIndex - 1];
            const beforeColumnID: string | undefined = newColumnsOrder[currentNewIndex + 1];
            this.props.setColumnsOrder(newColumnsOrder);
            // Request server to update as well
            this.props.updateColumnSortOrderRequest({
                id: draggableId,
                beforeColumnID,
                afterColumnID,
            });

            return;
        }

        // At this point, we need to reorder the tasks array for the column
        // Start by retrieving our columns
        const movingTaskId = draggableId;
        const [startColumnId, startPriorityId] = _.split(source.droppableId, "|");
        const [finishColumnId, finishPriorityId] = _.split(destination.droppableId, "|");
        const startColumn = this.props.columnMap[startColumnId];
        const finishColumn = this.props.columnMap[finishColumnId];
        // This list contain taskIDs following the correct render order in startColumn based on the order of priorities
        const startColumnTaskIDsInPriorityOrder = this.getColumnTaskIDsInPriorityOrder(startColumn);
        // This list contain taskIDs following the correct render order in finishColumn based on the order of priorities
        const finishColumnTaskIDsInPriorityOrder = startColumn === finishColumn ?
            startColumnTaskIDsInPriorityOrder :
            this.getColumnTaskIDsInPriorityOrder(finishColumn);
        const startPriority = this.props.priorityMap[startPriorityId];
        const finishPriority = this.props.priorityMap[finishPriorityId];
        const theTask: ITask | undefined = this.props.taskMap[draggableId];
        // Moving in the same column and same priority
        if (startColumn === finishColumn && startPriority === finishPriority) {
            const column = startColumn;
            const newTaskIDs = Array.from(startColumnTaskIDsInPriorityOrder);
            // Remove one item at the source index
            newTaskIDs.splice(source.index, 1);
            // Insert one item at the destination index
            newTaskIDs.splice(destination.index, 0, draggableId);

            const newColumn: IColumn = {
                ...column, // spread
                taskIDs: newTaskIDs, // replace
            };

            this.props.insertOrUpdateColumnBoard(newColumn);
            // Because same column and same priority, no need to update task

            const currentNewIndex: number = newColumn.taskIDs.indexOf(draggableId);
            const afterTaskID: string | undefined = newColumn.taskIDs[currentNewIndex - 1];
            const beforeTaskID: string | undefined = newColumn.taskIDs[currentNewIndex + 1];

            this.props.updateTaskSortOrderRequest({
                id: draggableId,
                afterTaskID,
                beforeTaskID,
                toColumnID: finishColumn.id,
                toPriorityID: finishPriority.id,
            });
            return;
        }

        // Moving in the same column but to different priority
        if (startColumn === finishColumn) {
            const column = startColumn;
            // ========================================================================================================
            // Begin: Fix a bug in beautiful dnd (10.0.4) where the destination index is just not return correctly
            // ========================================================================================================
            let destinationIndexFixedBugInBeautifulDnd: number = 0;
            // _.forEach(this.state.priorityOrder, (priorityId: string) => {
            //     if (priorityId === )
            // });

            for (const priorityID of this.props.prioritiesOrder) {
                // const priorityId = this.state.priorityOrder[i];
                if (priorityID === finishPriorityId) {
                    destinationIndexFixedBugInBeautifulDnd += destination.index;
                    break;
                } else {
                    destinationIndexFixedBugInBeautifulDnd += _.intersection(
                        this.props.priorityMap[priorityID].taskIDs, column.taskIDs,
                    ).length;
                }
            }

            // Check the card is moving down
            if (_.indexOf(this.props.prioritiesOrder, startPriorityId) <
                _.indexOf(this.props.prioritiesOrder, finishPriorityId)
            ) {
                // Moving down, subtract the destination index by 1
                if (destinationIndexFixedBugInBeautifulDnd > 0) {
                    destinationIndexFixedBugInBeautifulDnd -= 1;
                }
            }

            destination.index = destinationIndexFixedBugInBeautifulDnd;
            // ========================================================================================================
            // End: Fix a bug in beautiful dnd (10.0.4) where the destination index is just not return correctly
            // ========================================================================================================

            const newColumnTaskIds = Array.from(startColumnTaskIDsInPriorityOrder);
            // Remove one item at the source index
            newColumnTaskIds.splice(source.index, 1);
            // Insert one item at the destination index
            newColumnTaskIds.splice(destination.index, 0, draggableId);

            const newColumn: IColumn = {
                ...column, // spread
                taskIDs: newColumnTaskIds, // replace
            };

            const newStartPriorityTaskIds = _.filter(startPriority.taskIDs, (taskId: string) => {
                return movingTaskId !== taskId;
            });

            const newFinishPriorityTaskIds = Array.from(finishPriority.taskIDs);
            newFinishPriorityTaskIds.push(movingTaskId);

            const newStartPriority: IPriority = {
                ...startPriority,
                taskIDs: newStartPriorityTaskIds,
            };

            const newFinishPriority: IPriority = {
                ...finishPriority,
                taskIDs: newFinishPriorityTaskIds,
            };

            // Update board state
            this.props.insertOrUpdateColumnBoard(newColumn);
            this.props.insertOrUpdatePriorityBoard(newStartPriority);
            this.props.insertOrUpdatePriorityBoard(newFinishPriority);

            // Update priority of the task
            if (theTask !== undefined) {
                this.props.insertOrUpdateTaskBoard({
                    ...theTask,
                    priorityID: newFinishPriority.id,
                });
            }

            // Send update request
            const currentNewIndex: number = newColumn.taskIDs.indexOf(draggableId);
            const afterTaskID: string | undefined = newColumn.taskIDs[currentNewIndex - 1];
            const beforeTaskID: string | undefined = newColumn.taskIDs[currentNewIndex + 1];
            this.props.updateTaskSortOrderRequest({
                id: draggableId,
                afterTaskID,
                beforeTaskID,
                toColumnID: finishColumn.id,
                toPriorityID: finishPriority.id,
            });

            // Insert action history comment
            this.props.createCommentRequest({
                taskID: draggableId,
                content: getDraftJSEditorJSONStringFromText(
                    `Move priority: [${startPriority.title}] -> [${finishPriority.title}]`,
                ),
                plain: "",
            });

            return;
        }

        // Moving to the different column and to same/different priority
        if (startColumn !== finishColumn) {
            // ========================================================================================================
            // Begin: Fix a bug in beautiful dnd (10.0.4) where the destination index is just not return correctly
            // ========================================================================================================
            let destinationIndexFixedBugInBeautifulDnd: number = 0;
            // _.forEach(this.state.priorityOrder, (priorityId: string) => {
            //     if (priorityId === )
            // });

            for (const priorityID of this.props.prioritiesOrder) {
                // const priorityId = this.state.priorityOrder[i];
                if (priorityID === finishPriorityId) {
                    destinationIndexFixedBugInBeautifulDnd += destination.index;
                    break;
                } else {
                    destinationIndexFixedBugInBeautifulDnd += _.intersection(
                        this.props.priorityMap[priorityID].taskIDs, finishColumn.taskIDs,
                    ).length;
                }
            }

            // // Check the card is moving down (Just don't need it when moving to a different column)
            // if (_.indexOf(this.state.priorityOrder, startPriorityId) >
            //     _.indexOf(this.state.priorityOrder, finishPriorityId)
            // ) {
            //     // Moving down, subtract the destination index by 1
            //     if (destinationIndexFixedBugInBeautifulDnd > 0) {
            //         destinationIndexFixedBugInBeautifulDnd -= 1;
            //     }
            // }

            destination.index = destinationIndexFixedBugInBeautifulDnd;
            // ========================================================================================================
            // End: Fix a bug in beautiful dnd (10.0.4) where the destination index is just not return correctly
            // ========================================================================================================

            const startTaskIds = Array.from(startColumnTaskIDsInPriorityOrder);
            console.log(source, "source");
            console.log(destination, "destination");
            startTaskIds.splice(source.index, 1); // Remove task from start column
            const newStartColumn: IColumn = {
                ...startColumn,
                taskIDs: startTaskIds,
            };

            const finishTaskIds = Array.from(finishColumnTaskIDsInPriorityOrder);
            finishTaskIds.splice(destination.index, 0, draggableId); // Insert task to the finish column
            const newFinishColumn: IColumn = {
                ...finishColumn,
                taskIDs: finishTaskIds,
            };

            const newStartPriorityTaskIds = _.filter(startPriority.taskIDs, (taskId: string) => {
                return movingTaskId !== taskId;
            });

            const newFinishPriorityTaskIds = Array.from(finishPriority.taskIDs);
            newFinishPriorityTaskIds.push(movingTaskId);

            const newStartPriority: IPriority = {
                ...startPriority,
                taskIDs: newStartPriorityTaskIds,
            };

            const newFinishPriority: IPriority = {
                ...finishPriority,
                taskIDs: newFinishPriorityTaskIds,
            };

            // Update board state
            this.props.insertOrUpdateColumnBoard(newStartColumn);
            this.props.insertOrUpdateColumnBoard(newFinishColumn);
            this.props.insertOrUpdatePriorityBoard(newStartPriority);
            this.props.insertOrUpdatePriorityBoard(newFinishPriority);

            // Update column and priority of the task
            if (theTask !== undefined) {
                this.props.insertOrUpdateTaskBoard({
                    ...theTask,
                    columnID: newFinishColumn.id,
                    priorityID: newFinishPriority.id,
                });
            }

            // Send update request
            const currentNewIndex: number = newFinishColumn.taskIDs.indexOf(draggableId);
            const afterTaskID: string | undefined = newFinishColumn.taskIDs[currentNewIndex - 1];
            const beforeTaskID: string | undefined = newFinishColumn.taskIDs[currentNewIndex + 1];
            this.props.updateTaskSortOrderRequest({
                id: draggableId,
                afterTaskID,
                beforeTaskID,
                toColumnID: finishColumn.id,
                toPriorityID: finishPriority.id,
            });

            // Insert action history comment
            this.props.createCommentRequest({
                taskID: draggableId,
                content: getDraftJSEditorJSONStringFromText(
                    `Move column: [${startColumn.title}] -> [${finishColumn.title}]` +
                    (
                        startPriority.id !== finishPriority.id ?
                            `\nMove priority: [${startPriority.title}] -> [${finishPriority.title}]` : ``
                    ),
                ),
                plain: "",
            });
        }
    }

    public render() {
        return (
            // <ScrollViewport
            //     ref={(element) => {
            //         this.refScrollViewport = element;
            //     }}
            //     className={
            //         `touchscroll ` +
            //         `${!_.isUndefined(this.props.boardScaleFactor) ? "board-scale-50-percent" : ""}`}
            // >
            <DragDropContext
                onDragStart={this.onDragStart}
                onDragUpdate={this.onDragUpdate}
                onDragEnd={this.onDragEnd}
            >
                <Droppable
                    droppableId="all-columns"
                    direction="horizontal"
                    type="column"
                >
                    {(provided) => (
                        <Container
                            {...provided.droppableProps}
                            // ref={provided.innerRef}
                            ref={(element) => {
                                provided.innerRef(element);
                                this.refScrollViewport = element;
                                this.refScrollContent = element;
                            }}
                            className={
                                `touchscroll ${CONST_CSS_CLS_DRAG_SCROLL_HANDLE} ` +
                                `${!_.isUndefined(this.props.boardScaleFactor) ? "board-scale-50-percent" : ""}`}
                        >
                            <InnerList
                                // ref={(element) => {
                                //     this.refScrollContent = element;
                                // }}
                                columnMap={this.props.columnMap}
                                columnsOrder={this.props.columnsOrder}
                                taskMap={this.props.taskMap}
                                priorityMap={this.props.priorityMap}
                                prioritiesOrder={this.props.prioritiesOrder}
                                projectID={this.props.projectID}
                                project={this.props.project}
                                shouldShowStickyHeader={this.state.shouldShowStickyHeader}
                                userConfig={this.props.userConfig}
                            />
                            <ColumnAddButton />
                        </Container>
                    )}
                </Droppable>
            </DragDropContext>
            // </ScrollViewport>
        );
    }

    private getColumnTaskIDsInPriorityOrder = (column: IColumn) => {
        // Build Task IDs of the column in correct order of priority
        const columnTaskIDsInPriorityOrder: string[] = [];
        this.props.prioritiesOrder.forEach((eachPriorityID: string) => {
            const eachPriority = this.props.priorityMap[eachPriorityID];
            if (eachPriority !== undefined) {
                const taskIDsFilteredByPriority = _.intersection(column.taskIDs, eachPriority.taskIDs);
                columnTaskIDsInPriorityOrder.push(...taskIDsFilteredByPriority);
            }
        });
        return columnTaskIDsInPriorityOrder;
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ board, logins }: IApplicationState) => ({
    prioritiesOrder: board.prioritiesOrder,
    priorityMap: board.priorityMap,
    columnsOrder: board.columnsOrder,
    columnMap: board.columnMap,
    taskMap: board.taskMap,
    getBoardLoaded: board.getBoardLoaded,
    getBoardLoading: board.getBoardLoading,
    projectID: board.projectID,
    project: board.project,
    boardScaleFactor: board.boardScaleFactor,
    enableDragToScroll: board.enableDragToScroll,
    userConfig: logins.activeUserProfile.config,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateColumnSortOrderRequest: (input: IColumnUpdateSortOrderInput) =>
        dispatch(columnsActions.updateColumnSortOrderRequest(input)),
    setColumnsOrder: (columnsOrder: string[]) =>
        dispatch(boardActions.setColumnsOrder(columnsOrder)),
    insertOrUpdateColumnBoard: (column: IColumn) =>
        dispatch(boardActions.insertOrUpdateColumnBoard(column)),
    insertOrUpdatePriorityBoard: (priority: IPriority) =>
        dispatch(boardActions.insertOrUpdatePriorityBoard(priority)),
    insertOrUpdateTaskBoard: (task: ITask) =>
        dispatch(boardActions.insertOrUpdateTaskBoard(task)),
    updateTaskSortOrderRequest: (input: ITaskUpdateSortOrderInput) =>
        dispatch(tasksActions.updateTaskSortOrderRequest(input)),
    createCommentRequest: (input: ICommentCreateInput) =>
        dispatch(commentsActions.createCommentRequest(input)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Board);

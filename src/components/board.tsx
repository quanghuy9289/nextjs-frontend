/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import _ from "lodash";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import initialData from "../data/initial-data";
import { IApplicationState } from "../store";
import * as dialogsActions from "../store/dialogs/actions";
import * as navbarActions from "../store/navbar/actions";
import Column from "./column";
import ColumnAddButton from "./columnaddbutton";

const Container = styled.div`
    display: flex;
    flex-direction: row;
    overflow: auto;
`;

// interface InnerListColumnType {
//     tasks: any[any];
//     columnIds: string[];
//     columnOrder: string[];
//     columns: any[any];
// }

interface InnerListState {
    columns: any[any];
    columnOrder: string[];
    tasks: any[any];
    priorities: any[any];
    priorityOrder: string[];
}

class InnerList extends React.PureComponent<InnerListState> {
    // PureComponent do the shouldComponentUpdate automatically
    public render() {
        // const {priority, columnMap, index} = this.props;
        // const columns = priority.columnIds.map((columnId) => columnMap[columnId]);
        // const tasks = priority.tasks;
        // const columnOrder = priority.columnOrder;
        // return (
        //     <Priority
        //             priority={priority}
        //             columns={columns}
        //             columnOrder={columnOrder}
        //             tasks={tasks}
        //             index={index}
        //     />
        // );
        return this.props.columnOrder.map((columnId: string, index: number) => {
            const column = this.props.columns[columnId];
            return (
                <Column
                    key={column.id}
                    column={column}
                    // tasks={column.taskIds.map((taskId) => this.props.tasks[taskId])}
                    tasks={this.props.tasks}
                    index={index}
                    priorities={this.props.priorities}
                    priorityOrder={this.props.priorityOrder}
                />
            );
        });
    }
}

interface IBoardState {
    priorityOrder: string[];
    priorities: any[any];
    columnOrder: string[];
    columns: any[any];
    tasks: any[any];
    priority: any;
    index: number;
}

interface IPropsFromState {
    boardTitle?: string;
}

interface IPropsFromDispatch {
    changeBoardTitle: typeof navbarActions.changeBoardTitle;
}

interface IOwnProps {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class Board extends React.Component<AllProps, IBoardState> {
    // state = initialData;

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
            const newColumnOrder = Array.from(this.state.columnOrder);
            // Removing the old column id
            newColumnOrder.splice(source.index, 1);
            // Add the new column id
            newColumnOrder.splice(destination.index, 0, draggableId);

            const newStateWithColumn = {
                ...this.state,
                columnOrder: newColumnOrder,
            };

            this.setState(newStateWithColumn);
            return;
        }

        // At this point, we need to reorder the tasks array for the column
        // Start by retrieving our columns
        const movingTaskId = draggableId;
        const [startColumnId, startPriorityId] = _.split(source.droppableId, "|");
        const [finishColumnId, finishPriorityId] = _.split(destination.droppableId, "|");
        const startColumn = this.state.columns[startColumnId];
        const finishColumn = this.state.columns[finishColumnId];
        const startPriority = this.state.priorities[startPriorityId];
        const finishPriority = this.state.priorities[finishPriorityId];
        // Moving in the same column and same priority
        if (startColumn === finishColumn && startPriority === finishPriority) {
            const column = startColumn;
            const newTaskIds = Array.from(column.taskIds);
            // Remove one item at the source index
            newTaskIds.splice(source.index, 1);
            // Insert one item at the destination index
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...column, // spread
                taskIds: newTaskIds, // replace
            };

            const newStateWithColumn = {
                ...this.state, // spread
                columns: { // replace
                    ...this.state.columns, // spread
                    [newColumn.id]: newColumn, // replace
                },
            };

            this.setState(newStateWithColumn);
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

            for (const priorityId of this.state.priorityOrder) {
                // const priorityId = this.state.priorityOrder[i];
                if (priorityId === finishPriorityId) {
                    destinationIndexFixedBugInBeautifulDnd += destination.index;
                    break;
                } else {
                    destinationIndexFixedBugInBeautifulDnd += _.intersection(
                        this.state.priorities[priorityId].taskIds, column.taskIds,
                    ).length;
                }
            }

            // Check the card is moving down
            if (_.indexOf(this.state.priorityOrder, startPriorityId) <
                _.indexOf(this.state.priorityOrder, finishPriorityId)
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

            const newColumnTaskIds = Array.from(column.taskIds);
            // Remove one item at the source index
            newColumnTaskIds.splice(source.index, 1);
            // Insert one item at the destination index
            console.log(movingTaskId, "movingTaskId");
            console.log(source, "source");
            console.log(destination, "destination");
            newColumnTaskIds.splice(destination.index, 0, draggableId);
            console.log(newColumnTaskIds, "newColumnTaskIds");

            const newColumn = {
                ...column, // spread
                taskIds: newColumnTaskIds, // replace
            };

            console.log(finishPriority.taskIds, "startPriority.taskIds");
            const newStartPriorityTaskIds = _.filter(startPriority.taskIds, (taskId: string) => {
                return movingTaskId !== taskId;
            });
            console.log(newStartPriorityTaskIds, "newStartPriorityTaskIds");

            const newFinishPriorityTaskIds = Array.from(finishPriority.taskIds);
            console.log(finishPriority.taskIds, "finishPriority.taskIds");
            newFinishPriorityTaskIds.push(movingTaskId);
            console.log(newFinishPriorityTaskIds, "newFinishPriorityTaskIds");

            const newStartPriority = {
                ...startPriority,
                taskIds: newStartPriorityTaskIds,
            };

            const newFinishPriority = {
                ...finishPriority,
                taskIds: newFinishPriorityTaskIds,
            };

            const newStateWithSameColumnAndDifferentPriority = {
                ...this.state, // spread
                columns: { // replace
                    ...this.state.columns, // spread
                    [newColumn.id]: newColumn, // replace
                },
                priorities: { // replace
                    ...this.state.priorities, // spread
                    [newStartPriority.id]: newStartPriority, // replace
                    [newFinishPriority.id]: newFinishPriority, // replace
                },
            };

            this.setState(newStateWithSameColumnAndDifferentPriority);

            return;
        }

        // Moving to the different column and to different priority
        if (startColumn !== finishColumn) {
            // ========================================================================================================
            // Begin: Fix a bug in beautiful dnd (10.0.4) where the destination index is just not return correctly
            // ========================================================================================================
            let destinationIndexFixedBugInBeautifulDnd: number = 0;
            // _.forEach(this.state.priorityOrder, (priorityId: string) => {
            //     if (priorityId === )
            // });

            for (const priorityId of this.state.priorityOrder) {
                // const priorityId = this.state.priorityOrder[i];
                if (priorityId === finishPriorityId) {
                    destinationIndexFixedBugInBeautifulDnd += destination.index;
                    break;
                } else {
                    destinationIndexFixedBugInBeautifulDnd += _.intersection(
                        this.state.priorities[priorityId].taskIds, finishColumn.taskIds,
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

            const startTaskIds = Array.from(startColumn.taskIds);
            console.log(source, "source");
            console.log(destination, "destination");
            startTaskIds.splice(source.index, 1); // Remove task from start column
            const newStartColumn = {
                ...startColumn,
                taskIds: startTaskIds,
            };

            const finishTaskIds = Array.from(finishColumn.taskIds);
            finishTaskIds.splice(destination.index, 0, draggableId); // Insert task to the finish column
            const newFinishColumn = {
                ...finishColumn,
                taskIds: finishTaskIds,
            };

            const newStartPriorityTaskIds = _.filter(startPriority.taskIds, (taskId: string) => {
                return movingTaskId !== taskId;
            });

            const newFinishPriorityTaskIds = Array.from(finishPriority.taskIds);
            newFinishPriorityTaskIds.push(movingTaskId);

            const newStartPriority = {
                ...startPriority,
                taskIds: newStartPriorityTaskIds,
            };

            const newFinishPriority = {
                ...finishPriority,
                taskIds: newFinishPriorityTaskIds,
            };

            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newStartColumn.id]: newStartColumn,
                    [newFinishColumn.id]: newFinishColumn,
                },
                priorities: { // replace
                    ...this.state.priorities, // spread
                    [newStartPriority.id]: newStartPriority, // replace
                    [newFinishPriority.id]: newFinishPriority, // replace
                },
            };

            this.setState(newState);
        }
    }

    public componentDidMount() {
        fetch(`${process.env.REACT_APP_TASK_RIPPLE_API}/v1/board/board_11111`)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                console.log(json, "loaded data");
                console.log(process.env.REACT_APP_TASK_RIPPLE_API, "REACT_APP_TASK_RIPPLE_API");
                this.setState(json);
            });
    }

    public render() {
        if (this.state != null) {
            return (
                // <DragDropContext
                //     onDragStart={this.onDragStart}
                //     onDragUpdate={this.onDragUpdate}
                //     onDragEnd={this.onDragEnd}
                // >
                //     <Droppable
                //         droppableId="all-columns"
                //         direction="horizontal"
                //         type="column"
                //     >
                //         {(provided) => (
                //             <Container
                //                 {...provided.droppableProps}
                //                 ref={provided.innerRef}
                //             >
                //                 {this.state.priorityOrder.map((priorityId, index) => {
                //                     const priority = this.state.priorities[priorityId];
                //                     return (
                //                         <InnerList
                //                             key={priority.id}
                //                             // column={column}
                //                             // taskMap={this.state.tasks}
                //                             priority={priority}
                //                             columnMap={priority.columns}
                //                             index={index}
                //                         />
                //                     );
                //                 })}
                //             </Container>
                //         )}
                //     </Droppable>
                // </DragDropContext>
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
                                ref={provided.innerRef}
                            >
                                <InnerList
                                    columns={this.state.columns}
                                    columnOrder={this.state.columnOrder}
                                    tasks={this.state.tasks}
                                    priorities={this.state.priorities}
                                    priorityOrder={this.state.priorityOrder}
                                />
                                <ColumnAddButton />
                            </Container>
                        )}
                    </Droppable>
                </DragDropContext>
            );
        }
        return "";
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ navbar }: IApplicationState) => ({
    boardTitle: navbar.boardTitle,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({
    changeBoardTitle: (title: string) => dispatch(navbarActions.changeBoardTitle(title)),
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Board);

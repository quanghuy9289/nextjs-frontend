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
import { IPriority } from "../../store/priorities/types";
import { IProject } from "../../store/projects/types";
import * as tasksActions from "../../store/tasks/actions";
import { ITask, ITaskUpdateSortOrderInput } from "../../store/tasks/types";
import { CONST_CSS_CLS_DRAG_SCROLL_HANDLE } from "../../utils/constants";
import { IStringTMap } from "../../utils/types";
import ColumnAddButton from "./column-add-button";
import ColumnHeaderOnly from "./column-header-only";

const Container = styled.table`
    vertical-align: top;
    width: auto;
    height: 80px;
`;

const ScrollViewport = styled.div`
    overflow: hidden !important;
`;

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
    projectID: string;
    project: IProject;
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

            return (
                <td
                    key={column.id}
                    className={CONST_CSS_CLS_DRAG_SCROLL_HANDLE}
                >
                    <ColumnHeaderOnly
                        key={column.id}
                        column={column}
                        index={index}
                        projectID={this.props.projectID}
                        project={this.props.project}
                        tasks={tasks}
                        columnTaskIDsMap={columnTaskIDsMap}
                    />
                </td>
            );
        });
    }
}

// interface IBoardState {
//     priorityOrder: string[];
//     priorities: any[any];
//     columnOrder: string[];
//     columns: any[any];
//     tasks: any[any];
//     priority: any;
//     index: number;
// }

interface IPropsFromState {
    columnsOrder: string[];
    columnMap: IStringTMap<IColumn>;
    taskMap: IStringTMap<ITask>;
    getBoardLoaded: boolean;
    getBoardLoading: boolean;
    projectID: string;
    project: IProject;
    boardScaleFactor?: number;
    enableDragToScroll: boolean;
}

interface IPropsFromDispatch {
    updateColumnSortOrderRequest: typeof columnsActions.updateColumnSortOrderRequest;
    setColumnsOrder: typeof boardActions.setColumnsOrder;
    insertOrUpdateColumnBoard: typeof boardActions.insertOrUpdateColumnBoard;
    insertOrUpdatePriorityBoard: typeof boardActions.insertOrUpdatePriorityBoard;
    updateTaskSortOrderRequest: typeof tasksActions.updateTaskSortOrderRequest;
    insertOrUpdateTaskBoard: typeof boardActions.insertOrUpdateTaskBoard;
}

interface IOwnProps {
    projectShortcode: string;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class BoardColumnHeaderOnly extends React.PureComponent<AllProps> {
    private refScrollViewport: any;
    private refScrollContent: any;
    private scrollBooster: ScrollBooster;
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
            bounce: true,
            textSelection: false,
            emulateScroll: true,
            mode: "x", // scroll only in horizontal dimension
            onUpdate: (data) => {
                // your scroll logic goes here
                // this.refScrollContent.style.transform = `translate(
                //     ${-data.position.x}px,
                //     ${-data.position.y}px
                // )`;
                if (this.refScrollViewport !== null) {
                    this.refScrollViewport.scrollLeft = data.position.x;
                    this.refScrollViewport.scrollTop = data.position.y;
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
        if (this.scrollBooster !== null) {
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

        return;
    }

    public render() {
        return (
            <ScrollViewport
                ref={(element) => {
                    this.refScrollViewport = element;
                }}
                className={
                    `touchscroll ` +
                    `${!_.isUndefined(this.props.boardScaleFactor) ? "board-header-scale-50-percent" : ""}`}
            >
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
                                    this.refScrollContent = element;
                                }}
                                cellPadding={0}
                                cellSpacing={0}
                                className={`${CONST_CSS_CLS_DRAG_SCROLL_HANDLE}`}
                            >
                                <tbody
                                    style={{
                                        borderBottom: "none",
                                    }}
                                >
                                    <tr>
                                        <InnerList
                                            columnMap={this.props.columnMap}
                                            columnsOrder={this.props.columnsOrder}
                                            taskMap={this.props.taskMap}
                                            projectID={this.props.projectID}
                                            project={this.props.project}
                                        />
                                        <td
                                            className={CONST_CSS_CLS_DRAG_SCROLL_HANDLE}
                                        >
                                            <ColumnAddButton />
                                        </td>
                                    </tr>
                                </tbody>
                            </Container>
                        )}
                    </Droppable>
                </DragDropContext>
            </ScrollViewport>
        );
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ board }: IApplicationState) => ({
    columnsOrder: board.columnsOrder,
    columnMap: board.columnMap,
    taskMap: board.taskMap,
    getBoardLoaded: board.getBoardLoaded,
    getBoardLoading: board.getBoardLoading,
    projectID: board.projectID,
    project: board.project,
    boardScaleFactor: board.boardScaleFactor,
    enableDragToScroll: board.enableDragToScroll,
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
});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(BoardColumnHeaderOnly);

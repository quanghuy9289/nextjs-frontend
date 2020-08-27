import React from 'react';

import { storiesOf } from '@storybook/react';
import Column from '../components/column';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
`
const DemoProps = {
    column: {
        id: 'column-1',
        title: 'To do',
        taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
    tasks: [
        {id: 'task-1', content: 'Take out the garbage'},
        {id: 'task-2', content: 'Working on the project'},
        {id: 'task-3', content: 'Prepare the dinner'},
        {id: 'task-4', content: 'Brush the teeth and go to bed'},
        {id: 'task-5', content: 'Cook breakfast'},
        {id: 'task-6', content: 'Eat lunch'},
        {id: 'task-7', content: 'Go shopping'},
        {id: 'task-8', content: 'Getting some motivation'},
    ],
    index: 1
}

const onDragEnd = () => {
  return false;
}

const DemoColumnWithTask = () => (
    <DragDropContext
        onDragEnd = {onDragEnd}
    >
        <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
        >
            {(provided)=>(
                <Container ref={provided.innerRef}>
                <Column {...DemoProps} />
                </Container>
            )}
        </Droppable>
    </DragDropContext>
);

const DemoColumnWithNoTask = () => (
    <DragDropContext
        onDragEnd = {onDragEnd}
    >
        <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
        >
            {(provided)=>(
                <Container ref={provided.innerRef}>
                <Column {...DemoProps} tasks={[]} />
                </Container>
            )}
        </Droppable>
    </DragDropContext>
);

storiesOf('Column', module)
    .add('no task', () =><DemoColumnWithNoTask />)
    .add('with tasks', () =><DemoColumnWithTask />);
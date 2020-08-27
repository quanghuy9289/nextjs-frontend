import React from 'react';

import { storiesOf } from '@storybook/react';
import Task from '../components/task';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const TaskList = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    background-color: ${props => (props.isDraggingOver ? 'lightgrey' : 'inherit')};
    flex-grow: 1;
    min-height: 100px;
`;

const DemoProps = {
  key: 'testkey',
  task: { id: 'task-1', content: 'Take out the garbage' },
  index: 1,
}

const onDragEnd = () => {
  return false;
}

const DemoComp = () => (
  <DragDropContext
      onDragEnd = {onDragEnd}
  >
      <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
      >
          {(provided)=>(
            <TaskList ref={provided.innerRef}>
              <Task {...DemoProps} />
            </TaskList>
          )}
      </Droppable>
  </DragDropContext>
);

storiesOf('Task', module)
  .add('with content', () =><DemoComp />);
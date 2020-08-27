import React from 'react';
import { storiesOf } from '@storybook/react';
import Board from '../components/board';

// const BluePrintDarkModeDecorator = (storyFn) => (
//   <div style={{backgroundColor: Colors.DARK_GRAY3}}>
//       { storyFn() }
//   </div>
// );
// addDecorator(BluePrintDarkModeDecorator);

const DemoComp = () => (
    <Board />
);

storiesOf('Board', module)
    .add('with state persistence', () =><DemoComp />);
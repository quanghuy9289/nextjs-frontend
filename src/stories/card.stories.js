import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button, Card, Elevation } from "@blueprintjs/core";
import styled from 'styled-components';

const Container = styled.div`
    padding: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
    margin-bottom: 8px;
    background-color: white;
`;

storiesOf('Card', module)
.add('with elevation', () => 
  <Container>
    <Card interactive={false} elevation={Elevation.ONE}>
      <h3 class="bp3-heading">Card heading</h3>
      <p>Card content</p>
        <Button
          intent="success"
        >
          Submit
        </Button>
    </Card>
  </Container>
)
.add('with elevation and interactive', () => 
  <Container>
    <Card interactive={true} elevation={Elevation.ONE}>
      <h3 class="bp3-heading">Card heading</h3>
      <p>Card content</p>
        <Button
          intent="success"
        >
          Submit
        </Button>
    </Card>
  </Container>
);
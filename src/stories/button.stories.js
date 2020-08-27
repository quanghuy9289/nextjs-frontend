import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from "@blueprintjs/core";

storiesOf('Button', module)
  .add('with Blueprint', () => <Button intent="success" text="button content" onClick={action('clicked')} />);
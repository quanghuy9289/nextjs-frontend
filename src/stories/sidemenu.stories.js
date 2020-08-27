import React from 'react';

import { storiesOf } from '@storybook/react';
import GESettingMenu from '../components/gesettingmenu';
import styled from 'styled-components';

const DemoComp = () => (
  <GESettingMenu />
);

storiesOf('Setting menu', module)
  .add('with items', () =><DemoComp />);
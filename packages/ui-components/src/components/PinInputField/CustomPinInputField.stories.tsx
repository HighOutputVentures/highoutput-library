import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import CustomPinInputField from './CustomPinInputField';

export default {
  title: 'UI Components/Form/PinInput Field',
  component: CustomPinInputField,
} as ComponentMeta<typeof CustomPinInputField>;

const Template: ComponentStory<typeof CustomPinInputField> = args => (
  <ThemeProvider>
    <CustomPinInputField {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

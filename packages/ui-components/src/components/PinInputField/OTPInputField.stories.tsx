import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import OTPInputField from './OTPInputField';

export default {
  title: 'UI Components/Form/PinInput Field',
  component: OTPInputField,
} as ComponentMeta<typeof OTPInputField>;

const Template: ComponentStory<typeof OTPInputField> = args => (
  <ThemeProvider>
    <OTPInputField {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

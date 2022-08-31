import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';

import OTPForm from './OTPForm';
export default {
  title: 'Layouts/Auth/OTP Form',
  component: OTPForm,
} as ComponentMeta<typeof OTPForm>;

const Template: ComponentStory<typeof OTPForm> = args => (
  <ThemeProvider>
    <OTPForm {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';

import OTPLoginForm from './OTPLoginForm';
export default {
  title: 'UI Layouts/Auth/OTP Login',
  component: OTPLoginForm,
} as ComponentMeta<typeof OTPLoginForm>;

const Template: ComponentStory<typeof OTPLoginForm> = args => (
  <ThemeProvider>
    <OTPLoginForm {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

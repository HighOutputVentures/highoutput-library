import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';

import OTPWithEmailLoginForm from './OTPWithEmailLoginForm';
export default {
  title: 'UI Layouts/Auth/Email-OTP Login',
  component: OTPWithEmailLoginForm,
} as ComponentMeta<typeof OTPWithEmailLoginForm>;

const Template: ComponentStory<typeof OTPWithEmailLoginForm> = args => (
  <ThemeProvider>
    <OTPWithEmailLoginForm {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

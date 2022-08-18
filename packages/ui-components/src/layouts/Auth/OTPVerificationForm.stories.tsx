import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';

import OTPVerificationForm from './OTPVerificationForm';
export default {
  title: 'Layouts/Auth/OTP Login',
  component: OTPVerificationForm,
} as ComponentMeta<typeof OTPVerificationForm>;

const Template: ComponentStory<typeof OTPVerificationForm> = args => (
  <ThemeProvider>
    <OTPVerificationForm {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

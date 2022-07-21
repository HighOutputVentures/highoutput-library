import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';

import OneTimePasswordLoginForm from './OneTimePasswordLoginForm';
export default {
  title: 'UI Layouts/Auth/Pin Login',
  component: OneTimePasswordLoginForm,
} as ComponentMeta<typeof OneTimePasswordLoginForm>;

const Template: ComponentStory<typeof OneTimePasswordLoginForm> = args => (
  <ThemeProvider>
    <OneTimePasswordLoginForm {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

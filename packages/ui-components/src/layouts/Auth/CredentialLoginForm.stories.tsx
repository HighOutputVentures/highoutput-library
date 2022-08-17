import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import CredentialLoginForm from './CredentialLoginForm';
export default {
  title: 'Layouts/Auth/Credential Login',
  component: CredentialLoginForm,
} as ComponentMeta<typeof CredentialLoginForm>;

const Template: ComponentStory<typeof CredentialLoginForm> = args => (
  <ThemeProvider>
    <CredentialLoginForm {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

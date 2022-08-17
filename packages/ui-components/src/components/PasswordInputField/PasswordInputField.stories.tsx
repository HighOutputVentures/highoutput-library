import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import PasswordInputField from './PasswordInputField';

export default {
  title: 'Components/Form/Password Input Field',
  component: PasswordInputField,
} as ComponentMeta<typeof PasswordInputField>;

const Template: ComponentStory<typeof PasswordInputField> = args => (
  <ThemeProvider>
    <PasswordInputField {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

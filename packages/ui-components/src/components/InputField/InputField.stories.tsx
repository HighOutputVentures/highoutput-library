import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import InputField from './InputField';

export default {
  title: 'Components/Form/Input Field',
  component: InputField,
} as ComponentMeta<typeof InputField>;

const Template: ComponentStory<typeof InputField> = args => (
  <ThemeProvider>
    <InputField {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
  id: 'name',
  label: 'Name',
  placeholder: 'Input your name',
};

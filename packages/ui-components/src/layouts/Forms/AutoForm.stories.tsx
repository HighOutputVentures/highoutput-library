import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import AutoForm from './AutoForm';
import { schema } from './schema';

export default {
  title: 'UI Layouts/AutoForm/AutoForm Login',
  component: AutoForm,
} as ComponentMeta<typeof AutoForm>;

const Template: ComponentStory<typeof AutoForm> = args => (
  <ThemeProvider>
    <AutoForm {...args} yupSchema={schema} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

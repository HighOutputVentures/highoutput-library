import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import AutoForm from './AutoForm';
import { autoFormSchema } from './validations';

export default {
  title: 'Layouts/Form/AutoForm',
  component: AutoForm,
} as ComponentMeta<typeof AutoForm>;

const Template: ComponentStory<typeof AutoForm> = args => (
  <ThemeProvider>
    <AutoForm {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
  yupSchema: autoFormSchema,
  placeholders: ['Enter title', 'Enter description'],
};

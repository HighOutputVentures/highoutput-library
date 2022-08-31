import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import SelectField from './SelectField';

export default {
  title: 'Components/Form/Select Field',
  component: SelectField,
} as ComponentMeta<typeof SelectField>;

const Template: ComponentStory<typeof SelectField> = args => (
  <ThemeProvider>
    <SelectField {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
  id: 'category',
  label: 'Category',
  placeholder: 'Select category',
  options: [{ label: 'test', value: 'test' }],
};

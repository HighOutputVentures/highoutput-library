import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import TextareaField from './TextareaField';

export default {
  title: 'Components/Form/Textarea Field',
  component: TextareaField,
} as ComponentMeta<typeof TextareaField>;

const Template: ComponentStory<typeof TextareaField> = args => (
  <ThemeProvider>
    <TextareaField {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
  id: 'desciption',
  label: 'Description',
  placeholder: 'Write something here ...',
};

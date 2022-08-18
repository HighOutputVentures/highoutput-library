import { Input } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import FormContainer from './FormContainer';

export default {
  title: 'Components/Form/Form Container',
  component: FormContainer,
} as ComponentMeta<typeof FormContainer>;

const Template: ComponentStory<typeof FormContainer> = args => (
  <ThemeProvider>
    <FormContainer {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
  children: <Input />,
  label: 'Form Container Label',
  errorMsg: 'Error message',
};

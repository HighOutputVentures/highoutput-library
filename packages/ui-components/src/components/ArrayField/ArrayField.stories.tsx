import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import ArrayField from './ArrayField';

export default {
  title: 'Components/Form/Array Field',
  component: ArrayField,
} as ComponentMeta<typeof ArrayField>;

const Template: ComponentStory<typeof ArrayField> = args => (
  <ThemeProvider>
    <ArrayField {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
  placeholder: 'Enter an Input',
  defaultValues: {
    input: [
      {
        value: '',
      },
    ],
  },
};

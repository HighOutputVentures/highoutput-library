import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import PinInputField from './PinInputField';

export default {
  title: 'Components/Form/Pin Input Field',
  component: PinInputField,
} as ComponentMeta<typeof PinInputField>;

const Template: ComponentStory<typeof PinInputField> = args => (
  <ThemeProvider>
    <PinInputField {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

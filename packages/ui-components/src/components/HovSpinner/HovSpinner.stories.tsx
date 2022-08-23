import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import HovSpinner from './HovSpinner';

export default {
  title: 'Components/Spinner/HovSpinner',
  component: HovSpinner,
} as ComponentMeta<typeof HovSpinner>;

const Template: ComponentStory<typeof HovSpinner> = args => (
  <HovSpinner {...args}>
    <div>Hello, world!</div>
  </HovSpinner>
);

export const Default = Template.bind({});

Default.args = {
  duration: 1200,
};

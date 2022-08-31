import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import LogoSpinner from './LogoSpinner';

export default {
  title: 'Components/Spinner/LogoSpinner',
  component: LogoSpinner,
} as ComponentMeta<typeof LogoSpinner>;

const Template: ComponentStory<typeof LogoSpinner> = args => (
  <LogoSpinner {...args}>
    <div>Hello, world!</div>
  </LogoSpinner>
);

export const Default = Template.bind({});

Default.args = {
  duration: 1200,
};

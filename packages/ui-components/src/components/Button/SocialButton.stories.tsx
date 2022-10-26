import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';

import SocialButton from './SocialButton';

export default {
  title: 'Components/Button/SocialButton',
  component: SocialButton,
} as ComponentMeta<typeof SocialButton>;

const Template: ComponentStory<typeof SocialButton> = args => (
  <ThemeProvider>
    <SocialButton {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

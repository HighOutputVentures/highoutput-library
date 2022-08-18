import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import RadioImage from './RadioImage';

export default {
  title: 'Components/Radio/Radio Image',
  component: RadioImage,
} as ComponentMeta<typeof RadioImage>;

const Template: ComponentStory<typeof RadioImage> = args => (
  <ThemeProvider>
    <RadioImage {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
  value: 'Kat',
  image: 'https://randomuser.me/api/portraits/women/44.jpg',
};

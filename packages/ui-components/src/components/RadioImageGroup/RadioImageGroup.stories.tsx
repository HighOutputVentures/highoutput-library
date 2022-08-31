import { Text } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';

import ThemeProvider from '../ThemeProvider';
import RadioImageGroup from './RadioImageGroup';

export default {
  title: 'Components/Radio/Radio Image Group',
  component: RadioImageGroup,
} as ComponentMeta<typeof RadioImageGroup>;

const Template: ComponentStory<typeof RadioImageGroup> = args => {
  const [value, setValue] = useState('');
  return (
    <ThemeProvider>
      <Text>Select Image: {value}</Text>
      <RadioImageGroup {...args} onChange={v => setValue(v)} />
    </ThemeProvider>
  );
};

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
  avatars: [
    {
      value: 'Kat',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      value: 'Kevin',
      image: 'https://randomuser.me/api/portraits/men/86.jpg',
    },
    {
      value: 'Andy',
      image: 'https://randomuser.me/api/portraits/men/29.jpg',
    },
    {
      value: 'Jess',
      image: 'https://randomuser.me/api/portraits/women/95.jpg',
    },
  ],
};

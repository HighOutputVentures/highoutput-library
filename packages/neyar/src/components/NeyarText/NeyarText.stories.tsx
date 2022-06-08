import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import NeyarText from './NeyarText';

export default {
  title: 'Block/NeyarText',
  component: NeyarText,
} as ComponentMeta<typeof NeyarText>;

const Template: ComponentStory<typeof NeyarText> = args => (
  <NeyarText {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  blockIndex: 0,
  data: '',
  readOnly: false,
  mentions: [
    {
      value: '29856d46-50c5-4a0b-b1e2-b965d7c67b8d',
      label: 'Edward Kenway',
      avatar:
        'https://thumbs.dreamstime.com/b/url-type-icon-simple-illustration-129166668.jpg',
    },
    {
      value: '29856d46-50c5-4a0b-b1e2-b965d7c67b8a',
      label: 'John Connor Kenway',
      avatar:
        'https://play-lh.googleusercontent.com/ZvMvaLTdYMrD6U1B3wPKL6siMYG8nSTEnzhLiMsH7QHwQXs3ZzSZuYh3_PTxoU5nKqU',
    },
  ],
};

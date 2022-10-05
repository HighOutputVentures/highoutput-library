import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import For, { ForProps } from './For';

export default {
  title: 'Components/Utilities/For',
  component: For,
} as ComponentMeta<typeof For>;

// there's currently no way pass a generic component to ComponentStory
// so this is merely a workaround
const Alias = (props: ForProps<{ id: number; name: string }[]>) => For(props);

const Template: ComponentStory<typeof Alias> = args => (
  <For {...args}>{user => <div>{user.name}</div>}</For>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
  each: [
    { id: 1, name: 'Mary' },
    { id: 2, name: 'John' },
    { id: 3, name: 'Will' },
    { id: 4, name: 'Susan' },
    { id: 5, name: 'Karen' },
  ],
};

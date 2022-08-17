import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import ContactCard from './ContactCard';

export default {
  title: 'Layouts/Contact/Contact Card',
  component: ContactCard,
} as ComponentMeta<typeof ContactCard>;

const Template: ComponentStory<typeof ContactCard> = args => (
  <ThemeProvider>
    <ContactCard {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import ContactPage from './ContactPage';

export default {
  title: 'Layouts/Contact/Contact Page',
  component: ContactPage,
} as ComponentMeta<typeof ContactPage>;

const Template: ComponentStory<typeof ContactPage> = args => (
  <ThemeProvider>
    <ContactPage {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

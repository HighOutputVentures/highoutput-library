import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../..';
import ContactForm from './ContactForm';

export default {
  title: 'Layouts/Contact/Contact Form',
  component: ContactForm,
} as ComponentMeta<typeof ContactForm>;

const Template: ComponentStory<typeof ContactForm> = args => (
  <ThemeProvider>
    <ContactForm {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

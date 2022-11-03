import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Flex, ThemeProvider } from '../..';
import PinInputField from './PinInputField';

export default {
  title: 'Components/Form/Pin Input Field',
  component: PinInputField,
} as ComponentMeta<typeof PinInputField>;

const Template: ComponentStory<typeof PinInputField> = args => (
  <ThemeProvider>
    <Flex w="full" flexDirection="column" gap={4}>
      <PinInputField {...args} numberOfFields={4} />
      <PinInputField {...args} numberOfFields={4} size="md" />
      <PinInputField {...args} numberOfFields={4} size="lg" />
      <PinInputField {...args} numberOfFields={4} defaultValue="0000" />
      <PinInputField
        {...args}
        numberOfFields={4}
        size="md"
        defaultValue="0000"
      />
      <PinInputField
        {...args}
        numberOfFields={4}
        size="lg"
        defaultValue="0000"
      />

      <PinInputField {...args} numberOfFields={4} disabled />
      <PinInputField {...args} numberOfFields={4} size="md" disabled />
      <PinInputField {...args} numberOfFields={4} size="lg" disabled />

      <br />
      <PinInputField {...args} numberOfFields={6} />
      <PinInputField {...args} numberOfFields={6} size="md" />
      <PinInputField {...args} numberOfFields={6} size="lg" />

      <PinInputField {...args} numberOfFields={6} defaultValue="000000" />
      <PinInputField
        {...args}
        numberOfFields={6}
        size="md"
        defaultValue="000000"
      />
      <PinInputField
        {...args}
        numberOfFields={6}
        size="lg"
        defaultValue="000000"
      />
      <PinInputField {...args} numberOfFields={6} disabled />
      <PinInputField {...args} numberOfFields={6} size="md" disabled />
      <PinInputField {...args} numberOfFields={6} size="lg" disabled />
    </Flex>
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
  variant: 'outline',
  helperMsg: 'This is a hint to help user.',
};

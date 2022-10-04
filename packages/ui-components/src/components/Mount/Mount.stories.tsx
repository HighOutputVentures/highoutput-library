import { Box, Button, Text } from '@chakra-ui/react';
import { useArgs } from '@storybook/addons';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import Mount from './Mount';

export default {
  title: 'Components/Utilities/Mount',
  component: Mount,
} as ComponentMeta<typeof Mount>;

const Template: ComponentStory<typeof Mount> = defaultArgs => {
  const [args, setArgs] = useArgs();

  const toggle = () => {
    setArgs({ ...args, when: !args.when });
  };

  return (
    <Box p={4}>
      <Mount {...defaultArgs}>
        <Text>Hello World!!</Text>
      </Mount>

      <Button mt={4} onClick={toggle}>
        Toggle
      </Button>
    </Box>
  );
};

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
  when: true,
};

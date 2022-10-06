import { Box, Center, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { FC } from 'react';

import ThemeProvider from '../../components/ThemeProvider';

const ColorCircle: FC<{ color: string; isWhite?: boolean }> = ({
  color,
  isWhite,
}) => {
  return (
    <Box mr="25" w="300px">
      <Center>
        <Box
          bg={color}
          w="50px"
          h="50px"
          borderRadius="50%"
          border={isWhite ? 'solid 0.5px black' : ''}
          mr="5"
        ></Box>
        <Text>{color}</Text>
      </Center>
    </Box>
  );
};

const ColorSytemComponent: FC<any> = () => {
  return (
    <Box>
      {/* Alpha */}
      <Heading size="lg">Alpha</Heading>
      <SimpleGrid columns={4} spacing={10}>
        <ColorCircle color="alpha.white.500" isWhite />
        <ColorCircle color="alpha.black.500" />
      </SimpleGrid>

      {/* Canvas */}
      <Heading size="lg" mt="35">
        Canvas
      </Heading>
      <SimpleGrid columns={4} spacing={10}>
        <ColorCircle color="canvas.light.500" />
        <ColorCircle color="canvas.dark.500" />
      </SimpleGrid>

      {/* Brand Primary */}
      <Heading size="lg" mt="35">
        Brand Primary
      </Heading>
      <SimpleGrid columns={4} spacing={10}>
        <ColorCircle color="brand.primary.900" />
        <ColorCircle color="brand.primary.800" />
        <ColorCircle color="brand.primary.700" />
        <ColorCircle color="brand.primary.600" />
        <ColorCircle color="brand.primary.500" />
      </SimpleGrid>

      {/* Brand Secondary */}
      <Heading size="lg" mt="35">
        Brand Secondary
      </Heading>
      <SimpleGrid columns={4} spacing={10}>
        <ColorCircle color="brand.secondary.900" />
        <ColorCircle color="brand.secondary.800" />
        <ColorCircle color="brand.secondary.700" />
        <ColorCircle color="brand.secondary.600" />
        <ColorCircle color="brand.secondary.500" />
      </SimpleGrid>

      {/* Brand Tertiary */}
      <Heading size="lg" mt="35">
        Brand Tertiary
      </Heading>
      <SimpleGrid columns={4} spacing={10}>
        <ColorCircle color="brand.tertiary.900" />
        <ColorCircle color="brand.tertiary.800" />
        <ColorCircle color="brand.tertiary.700" />
        <ColorCircle color="brand.tertiary.600" />
        <ColorCircle color="brand.tertiary.500" />
      </SimpleGrid>

      {/* Neutrals */}
      <Heading size="lg" mt="35">
        Neutrals
      </Heading>
      <SimpleGrid columns={5} spacing={10}>
        <ColorCircle color="neutrals.900" />
        <ColorCircle color="neutrals.800" />
        <ColorCircle color="neutrals.700" />
        <ColorCircle color="neutrals.600" />
        <ColorCircle color="neutrals.500" />
      </SimpleGrid>

      <SimpleGrid mt="25" columns={5} spacing={10}>
        <ColorCircle color="neutrals.400" />
        <ColorCircle color="neutrals.300" />
        <ColorCircle color="neutrals.200" />
        <ColorCircle color="neutrals.100" />
      </SimpleGrid>

      {/* Interface Error */}
      <Heading size="lg" mt="35">
        Interface Error
      </Heading>
      <SimpleGrid columns={4} spacing={10}>
        <ColorCircle color="interface.error.900" />
        <ColorCircle color="interface.error.800" />
        <ColorCircle color="interface.error.700" />
        <ColorCircle color="interface.error.600" />
        <ColorCircle color="interface.error.500" />
      </SimpleGrid>

      {/* Interface Success */}
      <Heading size="lg" mt="35">
        Interface Success
      </Heading>
      <SimpleGrid columns={4} spacing={10}>
        <ColorCircle color="interface.success.900" />
        <ColorCircle color="interface.success.800" />
        <ColorCircle color="interface.success.700" />
        <ColorCircle color="interface.success.600" />
        <ColorCircle color="interface.success.500" />
      </SimpleGrid>

      {/* Interface Warning */}
      <Heading size="lg" mt="35">
        Interface Warning
      </Heading>
      <SimpleGrid columns={4} spacing={10}>
        <ColorCircle color="interface.warning.900" />
        <ColorCircle color="interface.warning.800" />
        <ColorCircle color="interface.warning.700" />
        <ColorCircle color="interface.warning.600" />
        <ColorCircle color="interface.warning.500" />
      </SimpleGrid>
    </Box>
  );
};

export default {
  title: 'System Design/Color System',
  component: ColorSytemComponent,
} as ComponentMeta<typeof ColorSytemComponent>;

const Template: ComponentStory<typeof ColorSytemComponent> = args => (
  <ThemeProvider>
    <ColorSytemComponent {...args} />
  </ThemeProvider>
);

export const Colors = Template.bind({});

Colors.args = {
  ...Colors.args,
};

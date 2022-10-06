import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import ThemeProvider from '../../../components/ThemeProvider';
export default {
  title: 'System Design/Text System',
  component: Text,
} as ComponentMeta<typeof Text>;
interface TextRowProps {
  size: string;
  label: string;
}

const TextRow: React.FC<TextRowProps> = ({ size, label }) => {
  return (
    <Tr>
      <Td>
        {' '}
        <Text size="paragraph-md-bold">{size}</Text>
      </Td>
      <Td>
        {' '}
        <Text size={size}>{label}</Text>
      </Td>
    </Tr>
  );
};

const Template: ComponentStory<typeof Text> = () => (
  <ThemeProvider>
    <TableContainer>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>
              <Text size="heading-web-6">
                <Text size="paragraph-md-bold">Text Size</Text>
              </Text>
            </Th>
            <Th>
              <Text size="paragraph-md-bold">Result</Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <TextRow size="heading-web-1" label="Heading Web 1" />
          <TextRow size="heading-web-2" label="Heading Web 2" />
          <TextRow size="heading-web-3" label="Heading Web 3" />
          <TextRow size="heading-web-4" label="Heading Web 4" />
          <TextRow size="heading-web-5" label="Heading Web 5" />
          <TextRow size="heading-web-6" label="Heading Web 6" />
          <TextRow size="heading-mobile-1" label="Heading mobile 1" />
          <TextRow size="heading-mobile-2" label="Heading mobile 2" />
          <TextRow size="heading-mobile-3" label="Heading mobile 3" />
          <TextRow size="heading-mobile-4" label="Heading mobile 4" />
          <TextRow size="heading-mobile-5" label="Heading mobile 5" />
          <TextRow size="heading-mobile-6" label="Heading mobile 6" />

          <TextRow size="paragraph-xxl-default" label="Paragraph xxl default" />
          <TextRow size="paragraph-xl-default" label="Paragraph xl default" />
          <TextRow size="paragraph-lg-default" label="Paragraph lg default" />
          <TextRow size="paragraph-md-default" label="Paragraph md default" />
          <TextRow size="paragraph-sm-default" label="Paragraph sm default" />
          <TextRow size="paragraph-xs-default" label="Paragraph xs default" />
          <TextRow size="paragraph-xxs-default" label="Paragraph xxs default" />
          <TextRow size="paragraph-xxl-italic" label="Paragraph xxl italic" />
          <TextRow size="paragraph-xl-italic" label="Paragraph xl italic" />
          <TextRow size="paragraph-lg-italic" label="Paragraph lg italic" />
          <TextRow size="paragraph-md-italic" label="Paragraph md italic" />
          <TextRow size="paragraph-sm-italic" label="Paragraph sm italic" />
          <TextRow size="paragraph-xs-italic" label="Paragraph xs italic" />
          <TextRow size="paragraph-xxs-italic" label="Paragraph xxs italic" />
          <TextRow size="paragraph-xxl-bold" label="Paragraph xxl bold" />
          <TextRow size="paragraph-xl-bold" label="Paragraph xl bold" />
          <TextRow size="paragraph-lg-bold" label="Paragraph lg bold" />
          <TextRow size="paragraph-md-bold" label="Paragraph md bold" />
          <TextRow size="paragraph-sm-bold" label="Paragraph sm bold" />
          <TextRow size="paragraph-xs-bold" label="Paragraph xs bold" />
          <TextRow size="paragraph-xxs-bold" label="Paragraph xxs bold" />

          <TextRow size="label-xl-default" label="Label xl default" />
          <TextRow size="label-lg-default" label="Label lg default" />
          <TextRow size="label-md-default" label="Label md default" />
          <TextRow size="label-sm-default" label="Label sm default" />
          <TextRow size="label-xs-default" label="Label xs default" />
          <TextRow size="label-xxs-default" label="Label xxs default" />
          <TextRow size="label-xl-italic" label="Label xl italic" />
          <TextRow size="label-lg-italic" label="Label lg italic" />
          <TextRow size="label-md-italic" label="Label md italic" />
          <TextRow size="label-sm-italic" label="Label sm italic" />
          <TextRow size="label-xs-italic" label="Label xs italic" />
          <TextRow size="label-xxs-italic" label="Label xxs italic" />
          <TextRow size="label-xl-medium" label="Label xl medium" />
          <TextRow size="label-lg-medium" label="Label lg medium" />
          <TextRow size="label-md-medium" label="Label md medium" />
          <TextRow size="label-sm-medium" label="Label sm medium" />
          <TextRow size="label-xs-medium" label="Label xs medium" />
          <TextRow size="label-xxs-medium" label="Label xxs medium" />
          <TextRow size="label-xl-bold" label="Label xl bold" />
          <TextRow size="label-lg-bold" label="Label lg bold" />
          <TextRow size="label-md-bold" label="Label md bold" />
          <TextRow size="label-sm-bold" label="Label sm bold" />
          <TextRow size="label-xs-bold" label="Label xs bold" />
          <TextRow size="label-xxs-bold" label="Label xxs bold" />

          <TextRow size="uppercase-xl-default" label="Uppercase xl default" />
          <TextRow size="uppercase-lg-default" label="Uppercase lg default" />
          <TextRow size="uppercase-md-default" label="Uppercase md default" />
          <TextRow size="uppercase-sm-default" label="Uppercase sm default" />
          <TextRow size="uppercase-xs-default" label="Uppercase xs default" />
          <TextRow size="uppercase-xxs-default" label="Uppercase xxs default" />
          <TextRow size="uppercase-xl-italic" label="Uppercase xl italic" />
          <TextRow size="uppercase-lg-italic" label="Uppercase lg italic" />
          <TextRow size="uppercase-md-italic" label="Uppercase md italic" />
          <TextRow size="uppercase-sm-italic" label="Uppercase sm italic" />
          <TextRow size="uppercase-xs-italic" label="Uppercase xs italic" />
          <TextRow size="uppercase-xxs-italic" label="Uppercase xxs italic" />
          <TextRow size="uppercase-xl-medium" label="Uppercase xl medium" />
          <TextRow size="uppercase-lg-medium" label="Uppercase lg medium" />
          <TextRow size="uppercase-md-medium" label="Uppercase md medium" />
          <TextRow size="uppercase-sm-medium" label="Uppercase sm medium" />
          <TextRow size="uppercase-xs-medium" label="Uppercase xs medium" />
          <TextRow size="uppercase-xxs-medium" label="Uppercase xxs medium" />
          <TextRow size="uppercase-xl-bold" label="Uppercase xl bold" />
          <TextRow size="uppercase-lg-bold" label="Uppercase lg bold" />
          <TextRow size="uppercase-md-bold" label="Uppercase md bold" />
          <TextRow size="uppercase-sm-bold" label="Uppercase sm bold" />
          <TextRow size="uppercase-xs-bold" label="Uppercase xs bold" />
          <TextRow size="uppercase-xxs-bold" label="Uppercase xxs bold" />

          <TextRow size="monospace-xl-default" label="Monospace xl default" />
          <TextRow size="monospace-lg-default" label="Monospace lg default" />
          <TextRow size="monospace-md-default" label="Monospace md default" />
          <TextRow size="monospace-sm-default" label="Monospace sm default" />
          <TextRow size="monospace-xs-default" label="Monospace xs default" />
          <TextRow size="monospace-xxs-default" label="Monospace xxs default" />
          <TextRow size="monospace-xl-italic" label="Monospace xl italic" />
          <TextRow size="monospace-lg-italic" label="Monospace lg italic" />
          <TextRow size="monospace-md-italic" label="Monospace md italic" />
          <TextRow size="monospace-sm-italic" label="Monospace sm italic" />
          <TextRow size="monospace-xs-italic" label="Monospace xs italic" />
          <TextRow size="monospace-xxs-italic" label="Monospace xxs italic" />
          <TextRow size="monospace-xl-medium" label="Monospace xl medium" />
          <TextRow size="monospace-lg-medium" label="Monospace lg medium" />
          <TextRow size="monospace-md-medium" label="Monospace md medium" />
          <TextRow size="monospace-sm-medium" label="Monospace sm medium" />
          <TextRow size="monospace-xs-medium" label="Monospace xs medium" />
          <TextRow size="monospace-xxs-medium" label="Monospace xxs medium" />
          <TextRow size="monospace-xl-bold" label="Monospace xl bold" />
          <TextRow size="monospace-lg-bold" label="Monospace lg bold" />
          <TextRow size="monospace-md-bold" label="Monospace md bold" />
          <TextRow size="monospace-sm-bold" label="Monospace sm bold" />
          <TextRow size="monospace-xs-bold" label="Monospace xs bold" />
          <TextRow size="monospace-xxs-bold" label="Monospace xxs bold" />

          <TextRow size="button-default" label="Button Default" />
          <TextRow size="button-uppercase" label="Button Uppercase" />
        </Tbody>
      </Table>
    </TableContainer>
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

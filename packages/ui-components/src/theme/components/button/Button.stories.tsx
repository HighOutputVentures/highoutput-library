import {
  Button,
  HStack,
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
import CloseButton from '../../../components/Button/CloseButton';
import SocialButton from '../../../components/Button/SocialButton';

import ThemeProvider from '../../../components/ThemeProvider';
import { buttonVariants } from '../button';
export default {
  title: 'System Design/Button System',
  component: Text,
} as ComponentMeta<typeof Text>;
interface ButtonRowProps {
  type?: string;
  button: Array<JSX.Element> | JSX.Element;
  variant?: string;
}

const ButtonRow: React.FC<ButtonRowProps> = ({ type, variant, button }) => {
  console.log(Object.keys(buttonVariants));
  return (
    <Tr>
      <Td>
        <Text size="paragraph-md-bold">{type}</Text>
      </Td>
      <Td>
        <Text size="paragraph-md-bold">{variant}</Text>
      </Td>
      {!Array.isArray(button) && <Td>{button}</Td>}
      {Array.isArray(button) && (
        <Td>
          <HStack spacing={'10px'}>{button.map(b => b)}</HStack>
        </Td>
      )}
    </Tr>
  );
};

const Template: ComponentStory<typeof Text> = () => (
  <ThemeProvider>
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>
              <Text size="heading-web-6">
                <Text size="paragraph-md-bold">Component Type</Text>
              </Text>
            </Th>
            <Th>
              <Text size="heading-web-5">
                <Text size="paragraph-md-bold">Variant Type</Text>
              </Text>
            </Th>
            <Th>
              <Text size="paragraph-md-bold">Result</Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <ButtonRow
            type="Button"
            variant="solid-primary"
            button={<Button variant={'solid-primary'}>Solid Primary</Button>}
          />
          <ButtonRow
            type="Button"
            variant="outline-primary"
            button={
              <Button variant={'outline-primary'}>Outline Primary</Button>
            }
          />
          <ButtonRow
            type="Button"
            variant="ghost-primary"
            button={<Button variant={'ghost-primary'}>Ghost Primary</Button>}
          />
          <ButtonRow
            type="Button"
            variant="solid-error"
            button={<Button variant={'solid-error'}>Solid Error</Button>}
          />
          <ButtonRow
            type="Button"
            variant="outline-error"
            button={<Button variant={'outline-error'}>Outline Error</Button>}
          />
          <ButtonRow
            type="Button"
            variant="ghost-error"
            button={<Button variant={'ghost-error'}>Ghost Error</Button>}
          />
          <ButtonRow
            type="CloseButton"
            variant="solid-close-btn"
            button={<CloseButton variant={'solid-close-btn'} />}
          />
          <ButtonRow
            type="CloseButton"
            variant="outline-close-btn"
            button={<CloseButton variant={'outline-close-btn'} />}
          />
          <ButtonRow
            type="CloseButton"
            variant="ghost-close-btn"
            button={<CloseButton variant={'ghost-close-btn'} />}
          />
          <ButtonRow
            type="SocialButton"
            variant="solid"
            button={[
              <SocialButton
                type="facebook"
                variant={'solid'}
                buttonText={'Facebook'}
              />,
              <SocialButton type="facebook" variant={'solid'} />,
            ]}
          />
          <ButtonRow
            type="SocialButton"
            variant="solid"
            button={[
              <SocialButton
                type="twitter"
                variant={'solid'}
                buttonText={'Twitter'}
              />,
              <SocialButton type="twitter" variant={'solid'} />,
            ]}
          />
          <ButtonRow
            type="SocialButton"
            variant="solid"
            button={[
              <SocialButton
                type="figma"
                variant={'solid'}
                buttonText={'Figma'}
              />,
              <SocialButton type="figma" variant={'solid'} />,
            ]}
          />
          <ButtonRow
            type="SocialButton"
            variant="solid"
            button={[
              <SocialButton
                type="dribble"
                variant={'solid'}
                buttonText={'Dribble'}
              />,
              <SocialButton type="dribble" variant={'solid'} />,
            ]}
          />
          <ButtonRow
            type="SocialButton"
            variant="solid"
            button={[
              <SocialButton
                type="apple"
                variant={'solid'}
                buttonText={'Apple'}
              />,
              <SocialButton type="apple" variant={'solid'} />,
            ]}
          />
          <ButtonRow
            type="SocialButton"
            variant="solid"
            button={[
              <SocialButton
                type="google"
                variant={'solid'}
                buttonText={'Google'}
              />,
              <SocialButton type="google" variant={'solid'} />,
            ]}
          />
          <ButtonRow
            type="SocialButton"
            variant="outline"
            button={[
              <SocialButton
                type="facebook"
                variant={'outline'}
                buttonText={'Facebook'}
              />,
              <SocialButton type="facebook" variant={'outline'} />,
            ]}
          />
          <ButtonRow
            type="SocialButton"
            variant="outline"
            button={[
              <SocialButton
                type="twitter"
                variant={'outline'}
                buttonText={'Twitter'}
              />,
              <SocialButton type="twitter" variant={'outline'} />,
            ]}
          />
          <ButtonRow
            type="SocialButton"
            variant="outline"
            button={[
              <SocialButton
                type="figma"
                variant={'outline'}
                buttonText={'Figma'}
              />,
              <SocialButton type="figma" variant={'outline'} />,
            ]}
          />
          <ButtonRow
            type="SocialButton"
            variant="outline"
            button={[
              <SocialButton
                type="dribble"
                variant={'outline'}
                buttonText={'Dribble'}
              />,
              <SocialButton type="dribble" variant={'outline'} />,
            ]}
          />
          <ButtonRow
            type="SocialButton"
            variant="outline"
            button={[
              <SocialButton
                type="apple"
                variant={'outline'}
                buttonText={'Apple'}
              />,
              <SocialButton type="apple" variant={'outline'} />,
            ]}
          />
          <ButtonRow
            type="SocialButton"
            variant="outline"
            button={[
              <SocialButton
                type="google"
                variant={'outline'}
                buttonText={'Google'}
              />,
              <SocialButton type="google" variant={'outline'} />,
            ]}
          />
          <ButtonRow
            type="SocialButton"
            variant="outline"
            button={[
              <SocialButton
                type="google"
                variant={'outline'}
                buttonText={'Disabled Button '}
                buttonProps={{ disabled: true }}
              />,
              <SocialButton
                type="google"
                variant={'outline'}
                buttonProps={{ disabled: true }}
              />,
            ]}
          />
        </Tbody>
      </Table>
    </TableContainer>
  </ThemeProvider>
);

export const Default = Template.bind({});

Default.args = {
  ...Default.args,
};

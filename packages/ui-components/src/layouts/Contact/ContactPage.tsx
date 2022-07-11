import { Box, Center, Text } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { HovIcon } from '../../icons';

import ContactCard, { ContactCardProps } from './ContactCard';

export interface ContagePageProps {
  contactCardProps?: ContactCardProps;
  title?: string;
  secondaryTitle?: string;
  iconNode?: ReactNode;
}

const ContactPage: FC<ContagePageProps> = props => {
  const {
    contactCardProps,
    title = 'Contact Us',
    secondaryTitle = `Tell us what you need and we'll help you out.`,
    iconNode,
  } = props;
  return (
    <Box pos="relative" w="100%">
      <Box bg="#000" w="100%" h="400px">
        <Center pt={20} pb={8}>
          {iconNode ? iconNode : <HovIcon />}
        </Center>

        <Center>
          <Text size="text-5xl" color="white">
            {title}
          </Text>
        </Center>

        <Center>
          <Text size="text-base" color="gray.200">
            {secondaryTitle}
          </Text>
        </Center>
      </Box>
      <Center>
        <ContactCard
          pos="absolute"
          top="250px"
          w="512px"
          {...contactCardProps}
        />
      </Center>
    </Box>
  );
};

export default ContactPage;

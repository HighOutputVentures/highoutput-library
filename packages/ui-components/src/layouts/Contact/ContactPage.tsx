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
    <Box pos="relative" w="100%" data-testid="box.contactpage.container">
      <Box bg="#000" w="100%" h="400px" data-testid="box.contactpage.banner">
        <Center pt={20} pb={8} data-testid="center.contactpage.iconposition">
          {iconNode ? (
            iconNode
          ) : (
            <HovIcon data-testid="icon.contactpage.hovicon" />
          )}
        </Center>

        <Center data-testid="center.contactpage.titlepostion">
          <Text
            size="text-5xl"
            color="white"
            data-testid="text.contactpage.title"
          >
            {title}
          </Text>
        </Center>

        <Center data-testid="center.contactpage.secondarytitleposition">
          <Text
            size="text-base"
            color="gray.200"
            data-testid="text.contactpage.secondarytitle"
          >
            {secondaryTitle}
          </Text>
        </Center>
      </Box>
      <Center data-testid="center.contactpage.secondarytitleposition">
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

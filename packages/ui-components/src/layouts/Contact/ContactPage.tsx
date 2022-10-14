import { Box, BoxProps, Center, Text, TextProps } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { HovIcon } from '../../icons';

import ContactCard, { ContactCardProps } from './ContactCard';

type WithoutChildren<T> = Omit<T, 'children'>;

export interface ContagePageProps extends BoxProps {
  title?: string;
  secondaryTitle?: string;
  iconNode?: ReactNode;
  url?: string;
  partProps?: {
    contactCard?: WithoutChildren<ContactCardProps>;
    title?: WithoutChildren<TextProps>;
    secondaryTitle?: WithoutChildren<TextProps>;
  };
}

const ContactPage: FC<ContagePageProps> = props => {
  const {
    partProps,
    title = 'Contact Us',
    secondaryTitle = `Tell us what you need and we'll help you out.`,
    iconNode,
    url,
  } = props;
  return (
    <Box pos="relative" w="100%" data-testid="box.contactpage.container">
      <Box
        minW={'600px'}
        bg="#000"
        w="100%"
        h="400px"
        {...props}
        data-testid="box.contactpage.banner"
      >
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
            {...partProps?.title}
            data-testid="text.contactpage.title"
          >
            {title}
          </Text>
        </Center>

        <Center data-testid="center.contactpage.secondarytitleposition">
          <Text
            size="text-base"
            color="gray.200"
            {...partProps?.secondaryTitle}
            data-testid="text.contactpage.secondarytitle"
          >
            {secondaryTitle}
          </Text>
        </Center>
      </Box>
      <Center
        minW={'600px'}
        data-testid="center.contactpage.secondarytitleposition"
      >
        <ContactCard
          pos="absolute"
          top="250px"
          w="512px"
          url={url}
          {...partProps?.contactCard}
        />
      </Center>
    </Box>
  );
};

export default ContactPage;

import { Box, BoxProps, Center, Text } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import ContactForm, { ContactFormProps } from './ContactForm';

export interface ContactCardProps extends BoxProps {
  children?: ReactNode;
  title?: string;
  contactFormProps?: ContactFormProps;
  url?: string;
}

const ContactCard: FC<ContactCardProps> = props => {
  const {
    children,
    title = 'Drop your message',
    contactFormProps,
    url,
  } = props;
  return (
    <Box
      w={512}
      bg="white"
      borderRadius="8px"
      padding="56px"
      boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
      data-testid="box.contactcard.container"
      {...props}
    >
      <Center mb={8} data-testid="center.contactcard.titleposition">
        <Text size="text-3xl" data-testid="text.contactcard.title">
          {title}
        </Text>
      </Center>
      {children ? children : <ContactForm {...contactFormProps} url={url} />}
    </Box>
  );
};

export default ContactCard;

import { Box, BoxProps, Center, Text, TextProps } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import ContactForm, { ContactFormProps } from './ContactForm';

type WithoutChildren<T> = Omit<T, 'children'>;
export interface ContactCardProps extends BoxProps {
  children?: ReactNode;
  title?: string;
  url?: string;
  partProps?: {
    contactForm?: WithoutChildren<ContactFormProps>;
    text?: WithoutChildren<TextProps>;
  };
}

const ContactCard: FC<ContactCardProps> = props => {
  const { children, title = 'Drop your message', partProps, url } = props;
  return (
    <Box
      w={512}
      bg="white"
      borderRadius="8px"
      padding="56px"
      boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
      {...props}
      data-testid="box.contactcard.container"
    >
      <Center mb={8} data-testid="center.contactcard.titleposition">
        <Text
          size="text-3xl"
          {...partProps?.text}
          data-testid="text.contactcard.title"
        >
          {title}
        </Text>
      </Center>
      {children ? (
        children
      ) : (
        <ContactForm {...partProps?.contactForm} url={url} />
      )}
    </Box>
  );
};

export default ContactCard;

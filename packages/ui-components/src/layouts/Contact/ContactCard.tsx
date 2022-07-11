import { Box, BoxProps, Center, Text } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import ContactForm from './ContactForm';

export interface ContactCardProps extends BoxProps {
  children?: ReactNode;
  title?: string;
}

const ContactCard: FC<ContactCardProps> = props => {
  const { children, title = 'Drop your message' } = props;
  return (
    <Box
      maxW={512}
      bg="white"
      borderRadius="8px"
      padding="56px"
      boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
      {...props}
    >
      <Center mb={8}>
        <Text size="leading-9-bold">{title}</Text>
      </Center>
      {children ? children : <ContactForm />}
    </Box>
  );
};

export default ContactCard;

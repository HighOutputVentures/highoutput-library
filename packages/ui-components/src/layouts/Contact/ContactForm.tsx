import { Box, Button, ButtonProps, Stack } from '@chakra-ui/react';
import React, { FC } from 'react';

import InputField from '../../components/InputField/InputField';
import SelectField from '../../components/SelectField/SelectField';
import TextAreaField from '../../components/TextareaField/TextareaField';

export interface ContactFormProps {
  buttonStyle?: ButtonProps;
}

const ContactForm: FC<ContactFormProps> = props => {
  const { buttonStyle } = props;
  return (
    <div>
      <Box maxW={512}>
        <Stack spacing={4}>
          <InputField id="name" label="Name" placeholder="Input your name" />
          <InputField
            id="email"
            label="Email"
            placeholder="Input your email address"
          />
          <SelectField
            id="category"
            label="Category"
            placeholder="Select category"
            options={[
              { label: 'Integration', value: 'integration' },
              { label: 'General', value: 'general' },
              { label: 'How-to’s', value: 'howto' },
            ]}
          />
          <TextAreaField
            id="description"
            label="Desciption of concern"
            placeholder="Enter description"
          />
          <Button w="full" variant="primary">
            Send
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default ContactForm;

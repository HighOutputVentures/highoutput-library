import { Box, Button, ButtonProps, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';

import InputField from '../../components/InputField/InputField';
import TextAreaField from '../../components/TextareaField/TextareaField';
import {
  withContactFormSchema,
  withContactFormSchemaValues,
} from './validation';

export interface ContactFormProps {
  buttonProps?: ButtonProps;
}

const ContactForm: FC<ContactFormProps> = props => {
  const { buttonProps } = props;
  const { register, handleSubmit, formState } = useForm<
    withContactFormSchemaValues
  >({
    resolver: yupResolver(withContactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      description: '',
    },
    shouldUnregister: true,
  });

  const onSubmit = async (values: withContactFormSchemaValues) => {
    console.log(values);
  };

  const { isSubmitting, errors } = formState;

  return (
    <Box maxW={512} data-testid="box.contactform.container">
      <Box
        as="form"
        onSubmitCapture={handleSubmit(onSubmit)}
        data-testid="box.contactform.form"
      >
        <Stack spacing={4}>
          <InputField
            {...register('name')}
            id="name"
            label="Name"
            placeholder="Input your name"
            errorMsg={errors.name?.message}
            disabled={isSubmitting}
          />
          <InputField
            {...register('email')}
            id="email"
            label="Email"
            placeholder="Input your email address"
            errorMsg={errors.email?.message}
            disabled={isSubmitting}
            data-testid="input.contactform.email"
          />
          <TextAreaField
            {...register('description')}
            id="description"
            label="Desciption of concern"
            placeholder="Enter description"
            errorMsg={errors.description?.message}
            disabled={isSubmitting}
            data-testid="textarea.contactform.description"
          />
          <Button
            w="full"
            variant="primary"
            isLoading={isSubmitting}
            type="submit"
            data-testid="button.contactform.submit"
            {...buttonProps}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ContactForm;

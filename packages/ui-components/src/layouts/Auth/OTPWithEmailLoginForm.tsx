import { Box, Button, BoxProps, ButtonProps } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import InputField from '../../components/InputField/InputField';

import OTPLoginForm from './OTPLoginForm';

import {
  AuthenticateNumberSchemaValues,
  generateEmailOTPSchema,
  GenerateEmailOTPSchemaValues,
} from './validation';

export interface OTPDefaultLoginProps {
  onSubmitEmailValue?(value: GenerateEmailOTPSchemaValues): void;
  onSubmitOTPValue?(value: AuthenticateNumberSchemaValues): void;
  otpReceived?: boolean;
  containerProps?: BoxProps;
  buttonProps?: ButtonProps;
  title?: ReactNode;
  subTitle?: ReactNode;
  otpType?: 'number' | 'alphanumeric';
}

const OTPWithEmailLoginForm = (props: OTPDefaultLoginProps) => {
  const {
    otpReceived,
    onSubmitEmailValue,
    containerProps,
    buttonProps,

    onSubmitOTPValue,
  } = props;

  const { register, handleSubmit, formState } = useForm<
    GenerateEmailOTPSchemaValues
  >({
    resolver: yupResolver(generateEmailOTPSchema),
    defaultValues: {
      emailAddress: '',
    },
    shouldUnregister: true,
  });

  const onSubmitEmail = async (value: GenerateEmailOTPSchemaValues) => {
    if (onSubmitEmailValue) {
      onSubmitEmailValue(value);
    }
  };
  const onSubmitOTP = async (value: AuthenticateNumberSchemaValues) => {
    if (onSubmitOTPValue) {
      onSubmitOTPValue(value);
    }
  };

  const { errors, isSubmitting } = formState;

  return (
    <Box
      as={'form'}
      data-testid="box.emailform.form"
      w={350}
      {...containerProps}
      onSubmit={handleSubmit(onSubmitEmail)}
    >
      {!otpReceived ? (
        <Box
          as={'form'}
          data-testid="box.emailform.form"
          w={350}
          {...containerProps}
          onSubmit={handleSubmit(onSubmitEmail)}
        >
          <InputField
            id="emailAddress"
            {...register('emailAddress')}
            errorMsg={errors.emailAddress?.message}
            disabled={isSubmitting}
            placeholder={'Enter your email address'}
            inputChakraProps={{
              'aria-label': 'email-input',
              role: 'input',
            }}
          />

          <Button
            variant={'primary'}
            type="submit"
            isLoading={isSubmitting}
            width={'100%'}
            marginTop={'10px'}
            data-testid="button.email.submit"
            {...buttonProps}
          >
            Sign In
          </Button>
        </Box>
      ) : (
        <OTPLoginForm
          {...buttonProps}
          {...containerProps}
          onSubmitOTPValue={value => onSubmitOTP(value)}
        />
      )}
    </Box>
  );
};

export default OTPWithEmailLoginForm;

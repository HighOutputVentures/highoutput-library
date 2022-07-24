import { Box, Button, BoxProps, ButtonProps } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import InputField from '../../components/InputField/InputField';

import OTPLoginForm from './OTPLoginForm';

import {
  AuthenticateSchemaValues,
  generateEmailOTPSchema,
  GenerateEmailOTPSchemaValues,
} from './validation';

export interface OTPDefaultLoginProps {
  onSubmitEmailValue?(value: GenerateEmailOTPSchemaValues): void;
  onSubmitOTPValue?(value: AuthenticateSchemaValues): void;
  otpReceived: boolean;
  containerProps?: BoxProps;
  buttonProps?: ButtonProps;
  title?: ReactNode;
  subTitle?: ReactNode;
  numberOfFields?: number;
  otpType?: 'number' | 'alphanumeric';
}

const OTPWithEmailLoginForm = (props: OTPDefaultLoginProps) => {
  const {
    otpReceived,
    onSubmitEmailValue,
    containerProps,
    buttonProps,
    numberOfFields,
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
  const onSubmitOTP = async (value: AuthenticateSchemaValues) => {
    if (onSubmitOTPValue) {
      onSubmitOTPValue(value);
    }
  };

  const { errors, isSubmitting } = formState;

  return (
    <Box>
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
        <Box data-testid="otp.component">
          <OTPLoginForm
            {...buttonProps}
            {...containerProps}
            onSubmitOTPValue={value => onSubmitOTP(value)}
            numberOfFields={numberOfFields}
          />
        </Box>
      )}
    </Box>
  );
};

export default OTPWithEmailLoginForm;

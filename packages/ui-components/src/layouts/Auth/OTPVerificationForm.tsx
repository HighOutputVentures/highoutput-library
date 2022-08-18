import { Box, Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';

import InputField from '../../components/InputField/InputField';
import OTPForm, { OTPFormProps } from './OTPForm';

import {
  AuthenticateSchemaValues,
  generateEmailOTPSchema,
  GenerateEmailOTPSchemaValues,
} from './validation';

export interface OTPVerificationProps extends OTPFormProps {
  onSubmitEmailValue?(value: GenerateEmailOTPSchemaValues): void;
  onSubmitOTPValue?(value: AuthenticateSchemaValues): void;
  otpReceived: boolean;
  numberOfFields?: number;
  otpType?: 'number' | 'alphanumeric';
}

const OTPVerificationForm = (props: OTPVerificationProps) => {
  const {
    otpReceived,
    onSubmitEmailValue,
    numberOfFields,
    title,
    subTitle,
    onSubmitOTPValue,
    partProps,
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
          {...partProps?.container}
          onSubmit={handleSubmit(onSubmitEmail)}
        >
          <InputField
            id="emailAddress"
            {...register('emailAddress')}
            errorMsg={errors.emailAddress?.message}
            disabled={isSubmitting}
            placeholder={'Enter your email address'}
            partProps={{
              input: {
                'aria-label': 'email-input',
                role: 'input',
              },
            }}
          />

          <Button
            variant={'primary'}
            type="submit"
            isLoading={isSubmitting}
            width={'100%'}
            marginTop={'10px'}
            data-testid="button.email.submit"
            {...partProps?.button}
          >
            Sign In
          </Button>
        </Box>
      ) : (
        <Box data-testid="otp.component">
          <OTPForm
            partProps={partProps}
            title={title}
            subTitle={subTitle}
            onSubmitOTPValue={value => onSubmitOTP(value)}
            numberOfFields={numberOfFields}
          />
        </Box>
      )}
    </Box>
  );
};

export default OTPVerificationForm;

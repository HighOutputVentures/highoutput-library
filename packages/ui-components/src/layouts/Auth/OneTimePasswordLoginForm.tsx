import {
  Box,
  Button,
  Stack,
  Text,
  BoxProps,
  ButtonProps,
  Heading,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { ReactNode, useRef } from 'react';
import { useForm } from 'react-hook-form';

import InputField from '../../components/InputField/InputField';
import PinInputField from '../../components/PinInputField/PinInputField';

import {
  AuthenticateNumberSchemaValues,
  generateEmailOTPSchema,
  authenticateNumberSchema,
  authenticateAlphaNumericSchema,
  GenerateEmailOTPSchemaValues,
} from './validation';

export interface OTPDefaultLoginProps {
  onSubmitEmailValue?(value: GenerateEmailOTPSchemaValues): void;
  onSubmitOTPValue?(value: AuthenticateNumberSchemaValues): void;
  otpReceived: boolean;
  containerProps: BoxProps;
  buttonProps: ButtonProps;
  title?: ReactNode;
  subTitle?: ReactNode;
  otpType?: 'number' | 'alphanumeric';
}

const OneTimePasswordLoginForm = (props: OTPDefaultLoginProps) => {
  const {
    otpReceived,
    onSubmitEmailValue,
    containerProps,
    buttonProps,
    title,
    otpType = 'number',
    subTitle,
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
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: formStateOtp,
  } = useForm<AuthenticateNumberSchemaValues>({
    resolver: yupResolver(
      otpType === 'alphanumeric'
        ? authenticateAlphaNumericSchema
        : authenticateNumberSchema
    ),
    shouldUnregister: true,
    defaultValues: {
      otp: '',
    },
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
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
    <Box>
      {otpReceived ? (
        <Box
          as={'form'}
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
            {...buttonProps}
          >
            Sign In
          </Button>
        </Box>
      ) : (
        <Box
          as="form"
          w={350}
          {...containerProps}
          onSubmit={handleSubmitOtp(onSubmitOTP)}
          mb="4"
        >
          <Box mb="6">
            <Box>
              {title ? (
                title
              ) : (
                <Heading as="h1" mb={2}>
                  Check your inbox
                </Heading>
              )}
            </Box>

            {subTitle ? (
              subTitle
            ) : (
              <Text>We have sent a 6-digit code to your email </Text>
            )}
          </Box>
          <Stack spacing={5}>
            <PinInputField
              {...registerOtp('otp')}
              errorMsg={formStateOtp.errors.otp?.message}
              disabled={formStateOtp.isSubmitting}
              chakraPinInputProps={{
                autoFocus: true,
                onComplete: () => buttonRef.current?.click(),
                type: otpType,
              }}
            />
            <Button
              variant={'primary'}
              ref={buttonRef}
              type="submit"
              isLoading={formStateOtp.isSubmitting}
              width={'100%'}
              {...buttonProps}
            >
              Sign In
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default OneTimePasswordLoginForm;

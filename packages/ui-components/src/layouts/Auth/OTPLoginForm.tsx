import {
  Box,
  Button,
  Heading,
  Text,
  ButtonProps,
  BoxProps,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import PinInputField from '../../components/OneTimePassword/PinInputField';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  authenticateAlphaNumericSchema,
  authenticateNumberSchema,
  AuthenticateNumberSchemaValues,
} from './validation';
export interface OTPLoginFormProps {
  title?: string;
  subTitle?: string;
  buttonProps?: ButtonProps;
  containerProps?: BoxProps;
  otpType?: 'number' | 'alphanumeric';
  onSubmitOTPValue?(value: AuthenticateNumberSchemaValues): void;
}
const OTPLoginForm = (props: OTPLoginFormProps) => {
  const {
    subTitle,
    title,
    buttonProps,
    otpType = 'number',
    containerProps,
    onSubmitOTPValue,
  } = props;
  const buttonRef = React.useRef<HTMLButtonElement>(null);
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
  const onSubmitOTP = async (value: AuthenticateNumberSchemaValues) => {
    if (onSubmitOTPValue) {
      onSubmitOTPValue(value);
    }
  };
  return (
    <Box as="form" onSubmit={handleSubmitOtp(onSubmitOTP)} {...containerProps}>
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
        marginTop={5}
        {...buttonProps}
      >
        Sign In
      </Button>
    </Box>
  );
};

export default OTPLoginForm;

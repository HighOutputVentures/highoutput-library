import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Heading,
  PinInputFieldProps as PinProps,
  Text,
  TextProps,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';

import React, { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import PinInputField from '../../components/PinInputField/PinInputField';
import {
  authenticateSchema,
  AuthenticateSchemaValues,
} from '../../layouts/Auth/validation';

type WithoutChildren<T> = Omit<T, 'children'>;
export interface OTPFormProps {
  title?: ReactNode;
  subTitle?: ReactNode;
  numberOfFields?: number;
  buttonText?: string;
  otpType?: 'number' | 'alphanumeric';
  onSubmitOTPValue?(value: AuthenticateSchemaValues): void;
  partProps?: {
    title: WithoutChildren<TextProps>;
    subTitle: WithoutChildren<TextProps>;
    button: WithoutChildren<ButtonProps>;
    container: WithoutChildren<BoxProps>;
    pin: WithoutChildren<PinProps>;
  };
}
const OTPForm = (props: OTPFormProps) => {
  const {
    subTitle,
    title,
    otpType = 'number',
    numberOfFields = 6,
    buttonText,
    onSubmitOTPValue,
    partProps,
  } = props;
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: formStateOtp,
  } = useForm<AuthenticateSchemaValues>({
    resolver: yupResolver(authenticateSchema),
    context: { numberOfFields: numberOfFields },
    shouldUnregister: true,
    defaultValues: {
      otp: '',
    },
  });
  const onSubmitOTP = async (value: AuthenticateSchemaValues) => {
    if (onSubmitOTPValue) {
      onSubmitOTPValue(value);
    }
  };
  return (
    <Box
      as="form"
      w={350}
      data-testid="box.otpform.form"
      onSubmit={handleSubmitOtp(onSubmitOTP)}
      {...partProps?.container}
    >
      <Box mb="6">
        {title ? (
          title
        ) : (
          <Heading as="h1" mb={2} {...partProps?.title}>
            Check your inbox
          </Heading>
        )}

        {subTitle ? (
          subTitle
        ) : (
          <Text {...partProps?.subTitle}>
            We have sent a 6-digit code to your email{' '}
          </Text>
        )}
      </Box>

      <PinInputField
        id="otp"
        {...registerOtp('otp')}
        errorMsg={formStateOtp.errors.otp?.message}
        disabled={formStateOtp.isSubmitting}
        numberOfFields={numberOfFields}
        autoFocus
        onComplete={buttonRef.current?.click}
        type={otpType}
        partProps={{ pin: partProps?.pin }}
      />
      <Button
        variant={'primary'}
        ref={buttonRef}
        type="submit"
        isLoading={formStateOtp.isSubmitting}
        width={'100%'}
        data-testid="button.otp.submit"
        marginTop={5}
        {...partProps?.button}
      >
        {buttonText ? buttonText : 'Sign In'}
      </Button>
    </Box>
  );
};

export default OTPForm;

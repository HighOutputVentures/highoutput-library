import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Center,
  Stack,
  Text,
  TextProps,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FC, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import InputField, {
  InputFieldProps,
} from '../../components/InputField/InputField';
import {
  CredentialFormInputEmailProps,
  CredentialFormInputNameProps,
  withCredentialFormSchemaEmail,
  withCredentialFormSchemaEmailValues,
  withCredentialFormSchemaName,
  withCredentialFormSchemaNameValues,
} from './validation';

type WithoutChildren<T> = Omit<T, 'children'>;

export type CredentialLoginFormDefaultProps = {
  loginTitle?: ReactNode;
  signUpTitle?: ReactNode;
  partProps?: {
    title?: WithoutChildren<TextProps>;
    button?: WithoutChildren<ButtonProps>;
    containerProps?: WithoutChildren<BoxProps>;
    input?: WithoutChildren<InputFieldProps>;
  };
};
export interface CredentialLoginFormNameProps
  extends CredentialLoginFormDefaultProps {
  variant?: 'name-password';
  nameLabel: string;
  onSubmit?(values: CredentialFormInputNameProps): void;
}
export interface CredentialLoginFormEmailProps
  extends CredentialLoginFormDefaultProps {
  variant?: 'email-password';
  nameLabel?: never;
  onSubmit?(values: CredentialFormInputEmailProps): void;
}

export type CredentialLoginFormProps =
  | CredentialLoginFormNameProps
  | CredentialLoginFormEmailProps;

const CredentialLoginForm: FC<CredentialLoginFormProps> = props => {
  const {
    partProps,
    signUpTitle,
    loginTitle,
    variant,
    onSubmit,
    nameLabel = 'Username',
  } = props;

  const [showPassword, setShowPassword] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const { register, handleSubmit, formState } = useForm<
    withCredentialFormSchemaEmailValues & withCredentialFormSchemaNameValues
  >({
    resolver: yupResolver(
      variant === 'name-password'
        ? withCredentialFormSchemaName
        : withCredentialFormSchemaEmail
    ),
    shouldUnregister: true,
  });

  const onSubmitForm = async (
    values: withCredentialFormSchemaNameValues &
      withCredentialFormSchemaEmailValues
  ) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <Box
      as={'form'}
      maxW={512}
      {...partProps?.containerProps}
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <Center m={0} p={0}>
        {isSignUp && signUpTitle ? (
          signUpTitle
        ) : !isSignUp && loginTitle ? (
          loginTitle
        ) : !isSignUp && !loginTitle ? (
          <Text size="text-3xl" my={8} {...partProps?.title}>
            Login
          </Text>
        ) : (
          isSignUp &&
          !signUpTitle && (
            <Text size="text-3xl" my={8} {...partProps?.title}>
              Sign up
            </Text>
          )
        )}
      </Center>

      <Stack spacing={'1rem'}>
        {variant === 'name-password' ? (
          <InputField
            {...register('name')}
            id={'name'}
            label={nameLabel?.charAt(0).toUpperCase() + nameLabel?.slice(1)}
            placeholder={`Input your ${nameLabel?.toLowerCase()}`}
            errorMsg={formState.errors.name?.message}
            disabled={formState.isSubmitting}
            partProps={{
              input: {
                'aria-label': 'name-input',
                role: 'input',
              },
            }}
            {...partProps?.input}
          />
        ) : (
          <InputField
            {...register('email')}
            id={'email'}
            label="Email"
            placeholder="Input your email"
            errorMsg={formState.errors.email?.message}
            disabled={formState.isSubmitting}
            partProps={{
              input: { 'aria-label': 'email-input', role: 'input' },
            }}
            {...partProps?.input}
          />
        )}

        <InputField
          {...register('password')}
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Input your password"
          errorMsg={formState.errors.password?.message}
          disabled={formState.isSubmitting}
          rightIcon={
            <Button
              data-testid={'show-hide-btn'}
              background={'none'}
              _hover={{ background: 'none' }}
              _active={{ background: 'none' }}
              aria-label={showPassword ? 'show-password' : 'hide-password'}
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          }
          partProps={{
            input: {
              'aria-label': 'password-input',
              role: 'input',
            },
          }}
          {...partProps?.input}
        />
      </Stack>
      <Button
        w="full"
        variant="primary"
        isLoading={formState.isSubmitting}
        type="submit"
        my={8}
        {...partProps?.button}
      >
        {isSignUp ? 'Sign Up' : 'Login'}
      </Button>
      <Center>
        <Text>
          {isSignUp ? 'Already have an account?' : 'No account yet?'}{' '}
          <Text
            as={'a'}
            data-testid={'switch-form-link'}
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            aria-label={isSignUp ? 'login-link-label' : 'signup-link-label'}
            onClick={() => setIsSignUp(prev => !prev)}
            fontWeight={'bold'}
            role={'link'}
          >
            {isSignUp ? 'Login' : 'Sign up'}
          </Text>
        </Text>
      </Center>
    </Box>
  );
};

export default CredentialLoginForm;

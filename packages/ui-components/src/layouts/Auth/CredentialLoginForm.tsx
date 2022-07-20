import {
  ButtonProps,
  Button,
  Text,
  Box,
  StackProps,
  Center,
  Stack,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import InputField from '../../components/InputField/InputField';
import { useForm } from 'react-hook-form';
import {
  withCredentialFormSchemaEmail,
  withCredentialFormSchemaName,
  withCredentialFormSchemaEmailValues,
  withCredentialFormSchemaNameValues,
} from './validation';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { yupResolver } from '@hookform/resolvers/yup';
type CredentialLoginFormDefault = {
  loginTitle?: ReactNode;
  signUpTitle?: ReactNode;
  buttonProps?: ButtonProps;
  containerProps?: StackProps;
  selfRegisterLabel?: ReactNode;
  selfRegisterUrl?: ReactNode;
};
export interface CredentialLoginFormName extends CredentialLoginFormDefault {
  variant?: 'name-password';
  nameLabel: string;
}
export interface CredentialLoginFormEmail extends CredentialLoginFormDefault {
  variant?: 'email-password';
  nameLabel?: never;
}

type CredentialLoginFormProps =
  | CredentialLoginFormName
  | CredentialLoginFormEmail;

const CredentialLoginForm = (props: CredentialLoginFormProps) => {
  const {
    buttonProps,
    signUpTitle,
    loginTitle,
    containerProps,
    variant,
    nameLabel,
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

  const onSubmit = async (
    values:
      | withCredentialFormSchemaNameValues
      | withCredentialFormSchemaEmailValues
  ) => {
    console.log(values);
  };
  return (
    <Box
      as={'form'}
      maxW={512}
      onSubmit={handleSubmit(onSubmit)}
      {...containerProps}
    >
      <Center m={0} p={0}>
        {isSignUp && signUpTitle ? (
          signUpTitle
        ) : !isSignUp && loginTitle ? (
          loginTitle
        ) : !isSignUp && !loginTitle ? (
          <Text size="text-3xl" my={8}>
            Login
          </Text>
        ) : (
          isSignUp &&
          !signUpTitle && (
            <Text size="text-3xl" my={8}>
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
            label={nameLabel.charAt(0).toUpperCase() + nameLabel.slice(1)}
            placeholder={`Input your ${nameLabel.toLowerCase()}`}
            errorMsg={formState.errors.name?.message}
            disabled={formState.isSubmitting}
            inputChakraProps={{
              'aria-label': 'name-input',
              role: 'input',
            }}
          />
        ) : (
          <InputField
            {...register('email')}
            id={'email'}
            label="Email"
            placeholder="Input your email"
            errorMsg={formState.errors.email?.message}
            disabled={formState.isSubmitting}
            inputChakraProps={{ 'aria-label': 'email-input', role: 'input' }}
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
          inputChakraProps={{
            'aria-label': 'password-input',
            role: 'input',
          }}
        />
      </Stack>
      <Button
        w="full"
        variant="primary"
        isLoading={formState.isSubmitting}
        type="submit"
        my={8}
        {...buttonProps}
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

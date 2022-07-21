import { InferType, object, SchemaOf, string } from 'yup';

export interface CredentialFormInputEmailProps {
  email: string;
  password: string;
}

export const withCredentialFormSchemaEmail: SchemaOf<CredentialFormInputEmailProps> = object().shape(
  {
    email: string()
      .email('Please enter a valid email address')
      .required('Email is required.'),
    password: string().required('Password is required'),
  }
);

export type withCredentialFormSchemaEmailValues = InferType<
  typeof withCredentialFormSchemaEmail
>;
export interface CredentialFormInputNameProps {
  name: string;
  password: string;
}

export const withCredentialFormSchemaName: SchemaOf<CredentialFormInputNameProps> = object().shape(
  {
    name: string()
      .required('Name is required')
      .trim(),
    password: string().required('Password is required'),
  }
);

export type withCredentialFormSchemaNameValues = InferType<
  typeof withCredentialFormSchemaName
>;

export const generateEmailOTPSchema: SchemaOf<{
  emailAddress: string;
}> = object().shape({
  emailAddress: string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
});

export type GenerateEmailOTPSchemaValues = InferType<
  typeof generateEmailOTPSchema
>;
export const authenticateNumberSchema: SchemaOf<{
  otp: string;
}> = object().shape({
  otp: string()
    .matches(/^[0-9]+$/g, 'Invalid OTP code')
    .length(6, 'OTP code is incomplete.')
    .required('OTP code is required.'),
});

export type AuthenticateNumberSchemaValues = InferType<
  typeof authenticateNumberSchema
>;
export const authenticateAlphaNumericSchema: SchemaOf<{
  otp: string;
}> = object().shape({
  otp: string()
    .matches(/^[a-zA-Z0-9]+$/g, 'Invalid OTP code')
    .length(6, 'OTP code is incomplete.')
    .required('OTP code is required.'),
});

export type AuthenticateAlphaNumericSchemaValues = InferType<
  typeof authenticateAlphaNumericSchema
>;

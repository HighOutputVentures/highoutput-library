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

export const authenticateSchema: SchemaOf<{
  otp: string;
}> = object().shape({
  otp: string()
    .when(
      '$numberOfFields',
      (numberOfFields: number, authenticateSchema: any) => {
        return authenticateSchema.length(
          numberOfFields,
          'OTP code is incomplete.'
        );
      }
    )
    .required('OTP code is required.'),
});

export type AuthenticateSchemaValues = InferType<typeof authenticateSchema>;

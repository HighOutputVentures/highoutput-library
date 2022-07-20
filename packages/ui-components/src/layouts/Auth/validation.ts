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

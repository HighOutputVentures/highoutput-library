import { InferType, object, SchemaOf, string } from 'yup';

export interface ContactFormInputProps {
  emailAddress: string;
  message: string;
  details: { name: string };
}

export const withContactFormSchema: SchemaOf<ContactFormInputProps> = object().shape(
  {
    emailAddress: string()
      .email('Please enter a valid email address.')
      .required('Email is required.'),
    message: string().required('Description is required.'),
    details: object().shape({ name: string().required('Name is required.') }),
  }
);

export type withContactFormSchemaValues = InferType<
  typeof withContactFormSchema
>;

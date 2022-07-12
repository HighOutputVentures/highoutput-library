import { InferType, object, SchemaOf, string } from 'yup';

export interface ContactFormInputProps {
  name: string;
  email: string;
  category: string;
  description: string;
}

export const withContactFormSchema: SchemaOf<ContactFormInputProps> = object().shape(
  {
    name: string().required('Name is required.'),
    email: string()
      .email('Please enter a valid email address.')
      .required('Email is required.'),
    category: string().required('Category is required.'),
    description: string().required('Description is required.'),
  }
);

export type withContactFormSchemaValues = InferType<
  typeof withContactFormSchema
>;

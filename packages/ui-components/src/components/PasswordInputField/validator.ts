import { object, SchemaOf, string } from 'yup';

export const PasswordValidator: SchemaOf<PasswordProps> = object()
  .shape({
    password: string().required('Password is required'),
  })
  .required();

export interface PasswordProps {
  password: string;
}

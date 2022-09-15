import { array, object, SchemaOf, string, InferType } from 'yup';

export interface ArrayInputFieldProps {
  value: string;
}

export const ArrayFieldSchema: SchemaOf<ArrayInputFieldProps> = object()
  .shape({
    input: array(
      object().shape({
        value: string().required('input is required'),
      })
    ),
  })
  .required();

export type ArrayFieldTypeValues = InferType<typeof ArrayFieldSchema>;

import { InferType, object, string } from 'yup';

export const schema = object().shape({
  title: string()
    .required()
    .label('Title')
    .required('This is required'),
  description: string()
    .label('Description')
    .meta({ type: 'textarea' })
    .required('This is required'),
});

export type SchemaValues = InferType<typeof schema>;

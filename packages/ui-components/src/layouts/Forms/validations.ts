import { InferType, object, string } from 'yup';

export const autoFormSchema = object().shape({
  title: string()
    .required()
    .label('Title')
    .required('Title is required'),
  description: string()
    .label('Description')
    .meta({ type: 'textarea' })
    .required('Description is required'),
});

export type SchemaValues = InferType<typeof autoFormSchema>;

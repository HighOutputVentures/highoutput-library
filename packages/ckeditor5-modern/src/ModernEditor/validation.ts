import { string, object, SchemaOf, InferType } from 'yup';

type PostVariables = {
  content?: string;
  category: string;
};

export const postFormSchema: SchemaOf<PostVariables> = object().shape({
  content: string(),
  category: string().required('Post category is required.'),
});

export type PostFormSchemaValues = InferType<typeof postFormSchema>;
